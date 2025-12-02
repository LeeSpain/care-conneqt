import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, facilityId, companyId, language = 'en' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Verify user has facility/company admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const allowedRoles = ['facility_admin', 'company_admin', 'insurance_admin', 'admin'];
    const hasAccess = roles?.some(r => allowedRoles.includes(r.role));
    if (!hasAccess) {
      throw new Error('Facility or company admin role required');
    }

    // Get Isabella configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*, ai_agent_configurations(*)')
      .eq('name', 'isabella')
      .single();

    if (!agent || !agent.ai_agent_configurations) {
      throw new Error('Isabella agent not configured');
    }

    const config = agent.ai_agent_configurations;

    const { data: knowledge } = await supabase
      .from('ai_agent_knowledge_base')
      .select('*')
      .eq('agent_id', agent.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    const languageMap: { [key: string]: string } = {
      'en': 'English', 'es': 'Spanish', 'nl': 'Dutch'
    };
    const languageName = languageMap[language] || 'English';

    let systemPrompt = config.system_prompt;
    
    if (knowledge && knowledge.length > 0) {
      systemPrompt += '\n\nKnowledge Base:\n';
      knowledge.forEach((item: any) => {
        systemPrompt += `\n[${item.category}] ${item.title}:\n${item.content}\n`;
      });
    }

    // Add facility context
    if (facilityId) {
      const { data: facility } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', facilityId)
        .single();

      if (facility) {
        systemPrompt += `\n\n=== FACILITY CONTEXT ===\n`;
        systemPrompt += `Facility: ${facility.name}\n`;
        systemPrompt += `Type: ${facility.facility_type || 'N/A'}\n`;
        systemPrompt += `Capacity: ${facility.bed_capacity || 'N/A'} beds\n`;

        // Get resident count
        const { count: residentCount } = await supabase
          .from('facility_residents')
          .select('*', { count: 'exact', head: true })
          .eq('facility_id', facilityId)
          .is('discharge_date', null);

        systemPrompt += `Current Residents: ${residentCount || 0}\n`;

        // Get staff count
        const { count: staffCount } = await supabase
          .from('facility_staff')
          .select('*', { count: 'exact', head: true })
          .eq('facility_id', facilityId);

        systemPrompt += `Staff Members: ${staffCount || 0}\n`;
        systemPrompt += `=== END FACILITY CONTEXT ===\n`;
      }
    }

    // Add company context
    if (companyId) {
      const { data: company } = await supabase
        .from('care_companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (company) {
        systemPrompt += `\n\n=== COMPANY CONTEXT ===\n`;
        systemPrompt += `Company: ${company.name}\n`;
        systemPrompt += `Type: ${company.company_type || 'N/A'}\n`;
        systemPrompt += `Total Staff: ${company.total_staff || 0}\n`;
        systemPrompt += `Total Clients: ${company.total_clients || 0}\n`;
        systemPrompt += `=== END COMPANY CONTEXT ===\n`;
      }
    }

    systemPrompt += `\n\nRespond in ${languageName}. Be professional and data-driven.`;

    console.log('Calling Lovable AI for Isabella...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: parseFloat(config.temperature),
        max_tokens: config.max_tokens,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service unavailable' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    await supabase.from('ai_agent_conversations').insert({
      agent_id: agent.id,
      user_id: user.id,
      conversation_data: [...messages, { role: 'assistant', content: assistantMessage }],
    });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      agent: 'Isabella'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in isabella-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

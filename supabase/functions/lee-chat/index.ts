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
    const { messages, language = 'en' } = await req.json();
    
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

    // Verify admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      throw new Error('Admin role required for LEE access');
    }

    // Get LEE configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*, ai_agent_configurations(*)')
      .eq('name', 'lee-the-brain')
      .single();

    if (!agent || !agent.ai_agent_configurations) {
      throw new Error('LEE agent not configured');
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

    // Add system-wide analytics
    systemPrompt += '\n\n=== SYSTEM OVERVIEW ===\n';

    // Get member count
    const { count: memberCount } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });
    systemPrompt += `Total Members: ${memberCount || 0}\n`;

    // Get facility count
    const { count: facilityCount } = await supabase
      .from('facilities')
      .select('*', { count: 'exact', head: true });
    systemPrompt += `Facilities: ${facilityCount || 0}\n`;

    // Get care company count
    const { count: companyCount } = await supabase
      .from('care_companies')
      .select('*', { count: 'exact', head: true });
    systemPrompt += `Care Companies: ${companyCount || 0}\n`;

    // Get insurance company count
    const { count: insuranceCount } = await supabase
      .from('insurance_companies')
      .select('*', { count: 'exact', head: true });
    systemPrompt += `Insurance Companies: ${insuranceCount || 0}\n`;

    // Get lead stats
    const { data: leadStats } = await supabase
      .from('leads')
      .select('status');
    
    const newLeads = leadStats?.filter(l => l.status === 'new').length || 0;
    const qualifiedLeads = leadStats?.filter(l => l.status === 'qualified').length || 0;
    systemPrompt += `New Leads: ${newLeads}, Qualified: ${qualifiedLeads}\n`;

    // Get active alerts
    const { count: alertCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    systemPrompt += `Active Alerts: ${alertCount || 0}\n`;

    // Get AI agent stats
    const { data: agents } = await supabase
      .from('ai_agents')
      .select('name, display_name, status');
    
    systemPrompt += `\nAI Agents: ${agents?.map(a => `${a.display_name} (${a.status})`).join(', ')}\n`;
    systemPrompt += '=== END SYSTEM OVERVIEW ===\n';

    systemPrompt += `\n\nRespond in ${languageName}. Provide executive-level insights and recommendations.

FORMATTING RULES:
- Never use markdown formatting (no **, *, #, -, bullet points, or asterisks)
- Write in clear, well-structured paragraphs separated by line breaks
- Each paragraph should cover one topic or data point
- Use short, direct sentences that executives can scan quickly
- Present key metrics first, then supporting details
- When listing multiple items, write each on a new line with a number (1. 2. 3.)
- Keep the overall response concise but properly structured
- Sound authoritative and professional, like a chief of staff briefing`;

    console.log('Calling Lovable AI for LEE The Brain...');

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
      agent: 'LEE The Brain'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in lee-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

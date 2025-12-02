import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const medicalPatterns = [
  /symptom/i, /medication/i, /medicine/i, /dose/i, /dosage/i,
  /blood pressure/i, /heart rate/i, /glucose/i, /should I worry/i,
  /pain/i, /fever/i, /breathing/i, /emergency/i, /urgent/i,
  /is it serious/i, /side effect/i, /wound/i, /infection/i
];

function requiresMedicalHandoff(message: string): boolean {
  return medicalPatterns.some(pattern => pattern.test(message));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, memberId, language = 'en' } = await req.json();
    
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

    // Get Clara Family configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*, ai_agent_configurations(*)')
      .eq('name', 'clara-family')
      .single();

    if (!agent || !agent.ai_agent_configurations) {
      throw new Error('Clara Family agent not configured');
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

    // Get member context for the family member's loved one
    if (memberId) {
      const { data: memberData } = await supabase
        .from('members')
        .select(`*, profiles:user_id (first_name, last_name)`)
        .eq('id', memberId)
        .single();

      if (memberData) {
        systemPrompt += `\n\nYou are helping a family carer of ${memberData.profiles?.first_name || 'their loved one'}.\n`;
        systemPrompt += `Care Level: ${memberData.care_level || 'N/A'}\n`;
      }
    }

    systemPrompt += `\n\nRespond in ${languageName}. Be supportive and reassuring.`;

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const needsMedicalHandoff = requiresMedicalHandoff(lastUserMessage);

    let handoffResponse = null;
    
    if (needsMedicalHandoff) {
      console.log('Medical concern detected, consulting Ineke...');
      
      const handoffResult = await fetch(`${supabaseUrl}/functions/v1/agent-handoff`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_agent: 'ineke',
          message: lastUserMessage,
          context: { memberId },
          language
        }),
      });

      if (handoffResult.ok) {
        const handoffData = await handoffResult.json();
        handoffResponse = {
          agent: 'Ineke',
          message: handoffData.message
        };
        
        systemPrompt += `\n\n[NURSE CONSULTATION]\nIneke (Nurse AI) advises:\n"${handoffData.message}"\n\nExplain this to the family member in reassuring, simple terms.`;
      }
    }

    console.log('Calling Lovable AI for Clara Family...');

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
      agent: 'Clara',
      handoff: handoffResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in clara-family-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

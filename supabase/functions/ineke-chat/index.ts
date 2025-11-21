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
    const { messages, context } = await req.json();
    
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

    // Verify nurse role
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isNurse = roles?.some(r => r.role === 'nurse' || r.role === 'admin');
    if (!isNurse) {
      throw new Error('Nurse role required');
    }

    // Get Ineke's configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*, ai_agent_configurations(*)')
      .eq('name', 'ineke')
      .single();

    if (!agent || !agent.ai_agent_configurations) {
      throw new Error('Ineke agent not configured');
    }

    const config = agent.ai_agent_configurations;

    // Get active knowledge base
    const { data: knowledge } = await supabase
      .from('ai_agent_knowledge_base')
      .select('*')
      .eq('agent_id', agent.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    // Build enhanced system prompt with knowledge and context
    let systemPrompt = config.system_prompt;
    
    if (knowledge && knowledge.length > 0) {
      systemPrompt += '\n\nKnowledge Base:\n';
      knowledge.forEach(item => {
        systemPrompt += `\n[${item.category}] ${item.title}:\n${item.content}\n`;
      });
    }

    // Add dashboard context if provided
    if (context) {
      systemPrompt += '\n\nCurrent Dashboard Context:\n';
      if (context.memberId) {
        systemPrompt += `Current Member ID: ${context.memberId}\n`;
      }
      if (context.alerts) {
        systemPrompt += `Active Alerts: ${JSON.stringify(context.alerts)}\n`;
      }
      if (context.tasks) {
        systemPrompt += `Pending Tasks: ${JSON.stringify(context.tasks)}\n`;
      }
    }

    console.log('Calling Lovable AI for Ineke...');

    // Call Lovable AI
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
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Service unavailable. Please contact support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Store conversation
    const conversationData = [
      ...messages,
      { role: 'assistant', content: assistantMessage }
    ];

    await supabase
      .from('ai_agent_conversations')
      .insert({
        agent_id: agent.id,
        user_id: user.id,
        conversation_data: conversationData,
      });

    // Update analytics
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('ai_agent_analytics')
      .upsert({
        agent_id: agent.id,
        date: today,
        total_conversations: 1,
        successful_resolutions: 1,
      }, {
        onConflict: 'agent_id,date',
        ignoreDuplicates: false
      });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      agent: 'Ineke'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ineke-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

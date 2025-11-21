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
    const { messages, sessionId, context, language = 'en' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Clara's configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*, ai_agent_configurations(*)')
      .eq('name', 'clara')
      .single();

    if (!agent || !agent.ai_agent_configurations) {
      throw new Error('Clara agent not configured');
    }

    const config = agent.ai_agent_configurations;

    // Get active knowledge base
    const { data: knowledge } = await supabase
      .from('ai_agent_knowledge_base')
      .select('*')
      .eq('agent_id', agent.id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    // Map language codes to full language names
    const languageMap: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'nl': 'Dutch'
    };
    const languageName = languageMap[language] || 'English';

    // Build enhanced system prompt with knowledge
    let systemPrompt = config.system_prompt;
    
    if (knowledge && knowledge.length > 0) {
      systemPrompt += '\n\nKnowledge Base:\n';
      knowledge.forEach(item => {
        systemPrompt += `\n[${item.category}] ${item.title}:\n${item.content}\n`;
      });
    }

    // Add context-aware enhancements based on page
    if (context?.page) {
      if (context.page.includes('institutional') || context.page.includes('commercial')) {
        systemPrompt += '\n\nCONTEXT: User is viewing institutional/commercial solutions. Focus on B2B offerings, volume pricing, enterprise features, and commercial partnerships. Offer to schedule demos and generate quotes.';
      } else if (context.page.includes('personal-care')) {
        systemPrompt += '\n\nCONTEXT: User is viewing personal care plans. Focus on individual/family memberships, pricing tiers, and getting started. Offer to capture leads and answer pricing questions.';
      } else if (context.page.includes('devices')) {
        systemPrompt += '\n\nCONTEXT: User is viewing our device catalog. Focus on device features, specifications, pricing, and compatibility. Help them understand which devices best suit their needs.';
      } else if (context.page.includes('nurses')) {
        systemPrompt += '\n\nCONTEXT: User is learning about our nursing team. Focus on nurse qualifications, 24/7 availability, response protocols, and the human care element of our service.';
      }
    }

    // Add language instruction
    systemPrompt += `\n\nCRITICAL INSTRUCTION: You MUST respond in ${languageName}. The user's interface is in ${languageName}, so ALL your responses must be in ${languageName}. Do not use any other language under any circumstances. When discussing pricing, use appropriate currency symbols (€ for Spanish/Dutch, £ for English).`;

    console.log('Calling Lovable AI for Clara...');

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

    // Get user ID if authenticated
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Store conversation
    const conversationData = [
      ...messages,
      { role: 'assistant', content: assistantMessage }
    ];

    await supabase
      .from('ai_agent_conversations')
      .insert({
        agent_id: agent.id,
        user_id: userId,
        session_id: sessionId,
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
      agent: 'Clara'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in clara-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

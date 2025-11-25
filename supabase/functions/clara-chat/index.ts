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

    // Add sales capabilities and lease terms
    systemPrompt += `\n\nIMPORTANT SALES INFORMATION:
- ALL devices come with a 24-MONTH LEASE (not 12 months)
- No upfront purchase required - monthly subscription model
- Free shipping, setup, and 24/7 technical support included
- Device protection and automatic replacement included

SALES CAPABILITIES - You have access to these powerful tools:
1. get_pricing_plans - Retrieve all current plans with pricing
2. get_products - Show available add-on devices
3. build_quote - Calculate exact pricing for plan + device combinations
4. create_checkout - Generate Stripe payment link to complete purchase (requires customer name and email)
5. capture_lead - Save lead when customer wants to be contacted later

SALES PROCESS:
- Listen to customer needs and recommend appropriate plans
- Use build_quote to show exact pricing when discussing options
- When customer is ready to purchase: collect name and email, then use create_checkout
- Always mention the 24-month lease period when discussing devices
- If customer wants more info or isn't ready: use capture_lead

When you create a checkout session, I will display the payment link to the user.`;

    // Add language instruction
    systemPrompt += `\n\nCRITICAL INSTRUCTION: You MUST respond in ${languageName}. The user's interface is in ${languageName}, so ALL your responses must be in ${languageName}. Do not use any other language under any circumstances. When discussing pricing, use appropriate currency symbols (€ for Spanish/Dutch, £ for English).`;

    console.log('Calling Lovable AI for Clara...');

    // Define tools Clara can use for sales
    const tools = [
      {
        type: "function",
        function: {
          name: "get_pricing_plans",
          description: "Get available pricing plans with details",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "get_products",
          description: "Get available add-on products/devices",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "build_quote",
          description: "Calculate total price for a plan with optional devices",
          parameters: {
            type: "object",
            properties: {
              planId: { type: "string" },
              deviceIds: { type: "array", items: { type: "string" } },
            },
            required: ["planId"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "create_checkout",
          description: "Create checkout session for purchase",
          parameters: {
            type: "object",
            properties: {
              planId: { type: "string" },
              deviceIds: { type: "array", items: { type: "string" } },
              customerName: { type: "string" },
              customerEmail: { type: "string" },
            },
            required: ["planId", "customerName", "customerEmail"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "capture_lead",
          description: "Save lead for follow-up",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              interestType: { type: "string" },
              message: { type: "string" },
            },
            required: ["name", "email", "interestType"],
          },
        },
      },
    ];

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
        tools: tools,
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
    const assistantMessage = data.choices[0].message;

    // Handle tool calls if present
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      console.log('Tool call:', functionName, functionArgs);

      let toolResult;

      switch (functionName) {
        case 'get_pricing_plans':
          const { data: plans } = await supabase
            .from('pricing_plans')
            .select('*, plan_translations(*)')
            .eq('is_active', true)
            .order('sort_order');
          toolResult = plans;
          break;

        case 'get_products':
          const { data: products } = await supabase
            .from('products')
            .select('*, product_translations(*)')
            .eq('is_active', true)
            .eq('category', 'device')
            .order('sort_order');
          toolResult = products;
          break;

        case 'build_quote':
          const { data: plan } = await supabase
            .from('pricing_plans')
            .select('*, plan_translations(*)')
            .eq('id', functionArgs.planId)
            .single();
          
          let total = plan?.monthly_price || 0;
          let devices: any[] = [];

          if (functionArgs.deviceIds && functionArgs.deviceIds.length > 0) {
            const { data: selectedDevices } = await supabase
              .from('products')
              .select('*, product_translations(*)')
              .in('id', functionArgs.deviceIds);
            
            devices = selectedDevices || [];
            total += devices.reduce((sum: number, d: any) => sum + (d.monthly_price || 0), 0);
          }

          toolResult = { plan, devices, totalMonthly: total };
          break;

        case 'create_checkout':
          const checkoutResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/clara-checkout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              planId: functionArgs.planId,
              devices: functionArgs.deviceIds || [],
              customerEmail: functionArgs.customerEmail,
              customerName: functionArgs.customerName,
              sessionId,
              conversationId: null, // Will be set after saving conversation
            }),
          });
          toolResult = await checkoutResponse.json();
          break;

        case 'capture_lead':
          const { data: lead } = await supabase
            .from('leads')
            .insert({
              name: functionArgs.name,
              email: functionArgs.email,
              phone: functionArgs.phone,
              interest_type: functionArgs.interestType,
              message: functionArgs.message,
              source_page: context?.page || 'clara_chat',
              status: 'new',
            })
            .select()
            .single();
          toolResult = { success: true, leadId: lead?.id };
          break;
      }

      // Continue conversation with tool result
      const followUpMessages = [
        ...messages,
        assistantMessage,
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        }
      ];

      const followUpResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...followUpMessages
          ],
          temperature: parseFloat(config.temperature),
          max_tokens: config.max_tokens,
        }),
      });

      const followUpData = await followUpResponse.json();
      const finalMessage = followUpData.choices[0].message.content;

      // Store conversation with tool execution
      const conversationData = [
        ...messages,
        { role: 'assistant', content: finalMessage, tool_used: functionName }
      ];

      await supabase
        .from('ai_agent_conversations')
        .insert({
          agent_id: agent.id,
          user_id: null, // Will be set if authenticated
          session_id: sessionId,
          conversation_data: conversationData,
        });

      // Special handling for checkout - return payment link
      if (functionName === 'create_checkout' && toolResult.checkoutUrl) {
        return new Response(
          JSON.stringify({
            message: finalMessage,
            checkoutUrl: toolResult.checkoutUrl,
            orderId: toolResult.orderId,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ message: finalMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const assistantContent = assistantMessage.content;

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
      { role: 'assistant', content: assistantContent }
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
      message: assistantContent,
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

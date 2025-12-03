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

    // Add messaging capability instructions
    systemPrompt += `\n\n=== MESSAGING CAPABILITY ===
You can send messages to users. When asked to send a message, respond with a JSON block like this:
\`\`\`action
{"action": "send_message", "recipient_type": "user|role|broadcast", "recipient_id": "user_id_or_role_name", "message": "Your message content", "priority": "normal|urgent"}
\`\`\`

Examples:
- To message a specific user: {"action": "send_message", "recipient_type": "user", "recipient_id": "user-uuid", "message": "Hello!", "priority": "normal"}
- To message all nurses: {"action": "send_message", "recipient_type": "role", "recipient_id": "nurse", "message": "Team update...", "priority": "normal"}
- To broadcast to all: {"action": "send_message", "recipient_type": "broadcast", "recipient_id": "all", "message": "Important announcement...", "priority": "urgent"}

When the user asks to send a message, first confirm what they want to send and to whom, then include the action block.
=== END MESSAGING CAPABILITY ===\n`;

    systemPrompt += `\n\nRespond in ${languageName}. Provide executive-level insights.

CRITICAL FORMATTING REQUIREMENTS - YOU MUST FOLLOW THESE:
1. NEVER use markdown (no **, *, #, - symbols)
2. ALWAYS separate ideas into SHORT paragraphs (2-3 sentences max per paragraph)
3. ALWAYS add a blank line between paragraphs
4. Start with a brief summary statement
5. Then provide details in separate paragraphs
6. For data points, put each on its own line like:
   Alert Response Time: 4.2 minutes
   Task Completion Rate: 94%
7. End with a brief recommendation or next steps
8. Keep total response under 150 words unless asked for detail
9. When sending messages, include the action block at the end of your response`;

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
    let assistantMessage = data.choices[0].message.content;

    // Check for action blocks and execute them
    const actionMatch = assistantMessage.match(/```action\s*([\s\S]*?)\s*```/);
    let actionResult = null;

    if (actionMatch) {
      try {
        const actionData = JSON.parse(actionMatch[1]);
        
        if (actionData.action === 'send_message') {
          actionResult = await executeSendMessage(supabase, user.id, actionData);
        }
      } catch (e) {
        console.error('Error executing action:', e);
      }
    }

    await supabase.from('ai_agent_conversations').insert({
      agent_id: agent.id,
      user_id: user.id,
      conversation_data: [...messages, { role: 'assistant', content: assistantMessage }],
    });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      agent: 'LEE The Brain',
      action_result: actionResult
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

async function executeSendMessage(
  supabase: any,
  senderId: string,
  actionData: { recipient_type: string; recipient_id: string; message: string; priority: string }
) {
  const { recipient_type, recipient_id, message, priority } = actionData;
  
  try {
    let recipientIds: string[] = [];

    if (recipient_type === 'user') {
      recipientIds = [recipient_id];
    } else if (recipient_type === 'role') {
      const { data: roleUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', recipient_id);
      
      recipientIds = roleUsers?.map((u: any) => u.user_id) || [];
    } else if (recipient_type === 'broadcast') {
      // Get all users except sender
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id')
        .neq('id', senderId);
      
      recipientIds = allUsers?.map((u: any) => u.id) || [];
    }

    if (recipientIds.length === 0) {
      return { success: false, error: 'No recipients found' };
    }

    // Remove sender from recipients
    recipientIds = recipientIds.filter(id => id !== senderId);

    // Create conversation
    const { data: conversation, error: convoError } = await supabase
      .from('conversations')
      .insert({
        type: recipientIds.length > 1 ? 'group' : 'direct',
        title: recipient_type === 'broadcast' ? 'Broadcast from LEE' : 
               recipient_type === 'role' ? `Message to ${recipient_id}s` : null,
        is_broadcast: recipient_type === 'broadcast' || recipient_type === 'role'
      })
      .select()
      .single();

    if (convoError) throw convoError;

    // Add participants
    const participants = [senderId, ...recipientIds].map((userId, i) => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: i === 0 ? 'owner' : 'participant'
    }));

    await supabase.from('conversation_participants').insert(participants);

    // Send message
    await supabase.from('platform_messages').insert({
      conversation_id: conversation.id,
      sender_id: senderId,
      message,
      message_type: 'text',
      priority: priority || 'normal'
    });

    return { 
      success: true, 
      recipients_count: recipientIds.length,
      conversation_id: conversation.id
    };
  } catch (error: any) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}

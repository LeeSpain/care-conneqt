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
    
    // Add condensed knowledge base (top 5 entries only for speed)
    if (knowledge && knowledge.length > 0) {
      systemPrompt += '\n\nKey Knowledge:\n';
      knowledge.slice(0, 5).forEach((item: any) => {
        systemPrompt += `[${item.category}] ${item.title}\n`;
      });
    }

    // Parallel fetch all stats for speed
    const [
      memberResult,
      facilityResult,
      companyResult,
      insuranceResult,
      leadResult,
      alertResult,
      agentsResult,
      staffResult,
      rolesResult
    ] = await Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('facilities').select('*', { count: 'exact', head: true }),
      supabase.from('care_companies').select('*', { count: 'exact', head: true }),
      supabase.from('insurance_companies').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('status'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('ai_agents').select('display_name, status'),
      supabase.from('profiles').select('id, first_name, last_name, email').limit(50),
      supabase.from('user_roles').select('user_id, role')
    ]);

    const newLeads = leadResult.data?.filter((l: any) => l.status === 'new').length || 0;
    const qualifiedLeads = leadResult.data?.filter((l: any) => l.status === 'qualified').length || 0;

    // Compact system overview
    systemPrompt += `\n\n=== SYSTEM STATS ===
Members: ${memberResult.count || 0} | Facilities: ${facilityResult.count || 0} | Companies: ${companyResult.count || 0} | Insurance: ${insuranceResult.count || 0}
Leads: ${newLeads} new, ${qualifiedLeads} qualified | Active Alerts: ${alertResult.count || 0}
Agents: ${agentsResult.data?.map((a: any) => a.display_name).join(', ')}
=== END STATS ===\n`;

    // Compact staff list
    systemPrompt += '\n=== STAFF (use lookup_user for details) ===\n';
    staffResult.data?.slice(0, 20).forEach((s: any) => {
      const roles = rolesResult.data?.filter((r: any) => r.user_id === s.id).map((r: any) => r.role) || [];
      systemPrompt += `${s.first_name || ''} ${s.last_name || ''} (${roles.join(',')}) ID:${s.id}\n`;
    });
    systemPrompt += '=== END STAFF ===\n';

    // Condensed capability instructions
    systemPrompt += `\n\n=== COMMANDS ===
Execute with: \`\`\`action {"action": "name", ...params} \`\`\`

Actions:
1. send_message: {recipient_type:"user|role|broadcast", recipient_id, message, priority:"normal|urgent"}
2. schedule_appointment: {title, start_time, end_time, appointment_type:"meeting|call|video", participant_ids:[], requires_confirmation:true}
3. create_task: {title, member_id, nurse_id, task_type:"check_in|medication|assessment|other", priority, due_date}
4. create_reminder: {title, reminder_time, priority:"low|normal|high|urgent", related_entity_type, related_entity_id}
5. manage_alert: {alert_id, operation:"acknowledge|escalate|resolve", notes}
6. update_lead: {lead_id, status:"new|contacted|qualified|proposal|won|lost", notes}
7. lookup_user: {query, search_type:"name|email|role"}

Today: ${new Date().toISOString().split('T')[0]}
Rules: Use lookup_user first to find IDs. Put action blocks at END of response.
=== END COMMANDS ===\n`;

    systemPrompt += `\n\nRespond in ${languageName}. Be concise. No markdown. Keep responses under 100 words unless detailed info requested. Put action blocks at the END.`;

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
        max_tokens: Math.min(config.max_tokens, 500), // Cap at 500 for faster responses
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
    const actionMatches = assistantMessage.matchAll(/```action\s*([\s\S]*?)\s*```/g);
    const actionResults: any[] = [];

    for (const actionMatch of actionMatches) {
      try {
        const actionData = JSON.parse(actionMatch[1]);
        let result = null;
        
        switch (actionData.action) {
          case 'send_message':
            result = await executeSendMessage(supabase, user.id, actionData);
            break;
          case 'schedule_appointment':
            result = await executeScheduleAppointment(supabase, user.id, actionData);
            break;
          case 'create_task':
            result = await executeCreateTask(supabase, user.id, actionData);
            break;
          case 'create_reminder':
            result = await executeCreateReminder(supabase, user.id, actionData);
            break;
          case 'manage_alert':
            result = await executeManageAlert(supabase, user.id, actionData);
            break;
          case 'update_lead':
            result = await executeUpdateLead(supabase, user.id, actionData);
            break;
          case 'lookup_user':
            result = await executeLookupUser(supabase, actionData);
            break;
        }
        
        if (result) {
          actionResults.push({ action: actionData.action, result });
        }
      } catch (e) {
        console.error('Error executing action:', e);
        actionResults.push({ error: e instanceof Error ? e.message : 'Unknown error' });
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
      action_results: actionResults.length > 0 ? actionResults : null
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

// ==================== ACTION EXECUTORS ====================

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
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id')
        .neq('id', senderId);
      
      recipientIds = allUsers?.map((u: any) => u.id) || [];
    }

    if (recipientIds.length === 0) {
      return { success: false, error: 'No recipients found' };
    }

    recipientIds = recipientIds.filter(id => id !== senderId);

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

    const participants = [senderId, ...recipientIds].map((userId, i) => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: i === 0 ? 'owner' : 'participant'
    }));

    await supabase.from('conversation_participants').insert(participants);

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

async function executeScheduleAppointment(
  supabase: any,
  organizerId: string,
  actionData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    appointment_type?: string;
    participant_ids?: string[];
    requires_confirmation?: boolean;
    member_id?: string;
  }
) {
  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        title: actionData.title,
        description: actionData.description || null,
        start_time: actionData.start_time,
        end_time: actionData.end_time || new Date(new Date(actionData.start_time).getTime() + 30 * 60000).toISOString(),
        appointment_type: actionData.appointment_type || 'meeting',
        organizer_id: organizerId,
        requires_confirmation: actionData.requires_confirmation !== false,
        member_id: actionData.member_id || null,
        created_by_ai: true,
        ai_agent_name: 'LEE The Brain',
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    // Add participants
    const participantIds = actionData.participant_ids || [];
    if (participantIds.length > 0) {
      const participants = participantIds.map(userId => ({
        appointment_id: appointment.id,
        user_id: userId,
        status: 'pending'
      }));

      await supabase.from('appointment_participants').insert(participants);

      // Send confirmation requests to participants
      for (const participantId of participantIds) {
        const { data: convo } = await supabase.from('conversations').insert({
          type: 'direct',
          title: `Appointment Confirmation: ${actionData.title}`
        }).select().single();
        
        if (convo) {
          await supabase.from('conversation_participants').insert([
            { conversation_id: convo.id, user_id: organizerId, role: 'owner' },
            { conversation_id: convo.id, user_id: participantId, role: 'participant' }
          ]);
          await supabase.from('platform_messages').insert({
            conversation_id: convo.id,
            sender_id: organizerId,
            message: `LEE has scheduled an appointment: "${actionData.title}" on ${new Date(actionData.start_time).toLocaleString()}. Please confirm your attendance.`,
            message_type: 'text',
            priority: 'normal'
          });
        }
      }
    }

    return { 
      success: true, 
      appointment_id: appointment.id,
      participants_notified: participantIds.length
    };
  } catch (error: any) {
    console.error('Error scheduling appointment:', error);
    return { success: false, error: error.message };
  }
}

async function executeCreateTask(
  supabase: any,
  creatorId: string,
  actionData: {
    title: string;
    description?: string;
    member_id: string;
    nurse_id: string;
    task_type?: string;
    priority?: string;
    due_date?: string;
  }
) {
  try {
    const { data: task, error } = await supabase
      .from('nurse_tasks')
      .insert({
        title: actionData.title,
        description: actionData.description || null,
        member_id: actionData.member_id,
        nurse_id: actionData.nurse_id,
        task_type: actionData.task_type || 'other',
        priority: actionData.priority || 'medium',
        due_date: actionData.due_date || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, task_id: task.id };
  } catch (error: any) {
    console.error('Error creating task:', error);
    return { success: false, error: error.message };
  }
}

async function executeCreateReminder(
  supabase: any,
  userId: string,
  actionData: {
    title: string;
    description?: string;
    reminder_time: string;
    priority?: string;
    related_entity_type?: string;
    related_entity_id?: string;
  }
) {
  try {
    const { data: reminder, error } = await supabase
      .from('admin_reminders')
      .insert({
        user_id: userId,
        title: actionData.title,
        description: actionData.description || null,
        reminder_time: actionData.reminder_time,
        priority: actionData.priority || 'normal',
        related_entity_type: actionData.related_entity_type || null,
        related_entity_id: actionData.related_entity_id || null,
        created_by_ai: true,
        ai_agent_name: 'LEE The Brain'
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, reminder_id: reminder.id };
  } catch (error: any) {
    console.error('Error creating reminder:', error);
    return { success: false, error: error.message };
  }
}

async function executeManageAlert(
  supabase: any,
  userId: string,
  actionData: {
    alert_id: string;
    operation: 'acknowledge' | 'escalate' | 'resolve';
    notes?: string;
  }
) {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    switch (actionData.operation) {
      case 'acknowledge':
        updates.status = 'acknowledged';
        break;
      case 'escalate':
        updates.status = 'escalated';
        updates.priority = 'critical';
        break;
      case 'resolve':
        updates.status = 'resolved';
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = userId;
        break;
    }

    const { error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', actionData.alert_id);

    if (error) throw error;

    return { success: true, operation: actionData.operation, alert_id: actionData.alert_id };
  } catch (error: any) {
    console.error('Error managing alert:', error);
    return { success: false, error: error.message };
  }
}

async function executeUpdateLead(
  supabase: any,
  userId: string,
  actionData: {
    lead_id: string;
    status?: string;
    notes?: string;
  }
) {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (actionData.status) {
      updates.status = actionData.status;
      if (actionData.status === 'contacted') {
        updates.last_contacted_at = new Date().toISOString();
      }
    }

    const { error: leadError } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', actionData.lead_id);

    if (leadError) throw leadError;

    // Log activity
    if (actionData.notes) {
      await supabase.from('lead_activities').insert({
        lead_id: actionData.lead_id,
        activity_type: 'status_change',
        description: actionData.notes,
        created_by: userId,
        metadata: { new_status: actionData.status, changed_by_ai: true }
      });
    }

    return { success: true, lead_id: actionData.lead_id, new_status: actionData.status };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return { success: false, error: error.message };
  }
}

async function executeLookupUser(
  supabase: any,
  actionData: {
    query: string;
    search_type: 'name' | 'email' | 'role';
  }
) {
  try {
    let users: any[] = [];

    if (actionData.search_type === 'name') {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .or(`first_name.ilike.%${actionData.query}%,last_name.ilike.%${actionData.query}%`);
      users = data || [];
    } else if (actionData.search_type === 'email') {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .ilike('email', `%${actionData.query}%`);
      users = data || [];
    } else if (actionData.search_type === 'role') {
      const { data: roleUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', actionData.query);
      
      if (roleUsers && roleUsers.length > 0) {
        const userIds = roleUsers.map((r: any) => r.user_id);
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', userIds);
        users = data || [];
      }
    }

    // Get roles for found users
    if (users.length > 0) {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', users.map(u => u.id));

      users = users.map((user: any) => ({
        ...user,
        roles: userRoles?.filter((r: any) => r.user_id === user.id).map((r: any) => r.role) || []
      }));
    }

    return { 
      success: true, 
      users_found: users.length,
      users: users.slice(0, 10) // Limit to 10 results
    };
  } catch (error: any) {
    console.error('Error looking up user:', error);
    return { success: false, error: error.message };
  }
}

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

    // Get staff list for scheduling
    const { data: staffList } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .limit(100);
    
    systemPrompt += '\n=== AVAILABLE STAFF FOR SCHEDULING ===\n';
    if (staffList && staffList.length > 0) {
      const { data: staffRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      staffList.forEach((staff: any) => {
        const roles = staffRoles?.filter(r => r.user_id === staff.id).map(r => r.role) || [];
        systemPrompt += `${staff.first_name || ''} ${staff.last_name || ''} (${staff.email}) - ID: ${staff.id} - Roles: ${roles.join(', ')}\n`;
      });
    }
    systemPrompt += '=== END STAFF LIST ===\n';

    systemPrompt += '=== END SYSTEM OVERVIEW ===\n';

    // Add comprehensive capability instructions
    systemPrompt += `\n\n=== LEE COMMAND CAPABILITIES ===
You can execute various commands. When performing an action, respond with a JSON block like this:
\`\`\`action
{"action": "action_name", ...parameters}
\`\`\`

AVAILABLE ACTIONS:

1. SEND MESSAGE
{"action": "send_message", "recipient_type": "user|role|broadcast", "recipient_id": "user_id_or_role_name", "message": "content", "priority": "normal|urgent"}
Examples:
- Message specific user: {"action": "send_message", "recipient_type": "user", "recipient_id": "uuid", "message": "Hello!", "priority": "normal"}
- Message all nurses: {"action": "send_message", "recipient_type": "role", "recipient_id": "nurse", "message": "Update...", "priority": "normal"}
- Broadcast to all: {"action": "send_message", "recipient_type": "broadcast", "recipient_id": "all", "message": "Announcement", "priority": "urgent"}

2. SCHEDULE APPOINTMENT
{"action": "schedule_appointment", "title": "Meeting title", "description": "Optional description", "start_time": "ISO datetime", "end_time": "ISO datetime", "appointment_type": "meeting|call|video", "participant_ids": ["user_id1", "user_id2"], "requires_confirmation": true, "member_id": "optional_member_uuid"}
When user mentions a day like "Wednesday at 3pm", calculate the actual date from today.
Today's date is: ${new Date().toISOString().split('T')[0]}
Example: {"action": "schedule_appointment", "title": "Check-in with Nurse Daisy", "start_time": "2024-01-10T15:00:00Z", "end_time": "2024-01-10T15:30:00Z", "appointment_type": "video", "participant_ids": ["nurse-uuid"], "requires_confirmation": true}

3. CREATE TASK
{"action": "create_task", "title": "Task title", "description": "Description", "member_id": "member_uuid", "nurse_id": "nurse_uuid", "task_type": "check_in|medication|assessment|other", "priority": "low|medium|high|urgent", "due_date": "ISO datetime"}
Example: {"action": "create_task", "title": "Weekly check-in", "member_id": "uuid", "nurse_id": "uuid", "task_type": "check_in", "priority": "medium", "due_date": "2024-01-15T10:00:00Z"}

4. CREATE REMINDER
{"action": "create_reminder", "title": "Reminder title", "description": "Details", "reminder_time": "ISO datetime", "priority": "low|normal|high|urgent", "related_entity_type": "member|lead|facility", "related_entity_id": "optional_uuid"}
Example: {"action": "create_reminder", "title": "Follow up with lead", "reminder_time": "2024-01-12T09:00:00Z", "priority": "high", "related_entity_type": "lead", "related_entity_id": "lead-uuid"}

5. MANAGE ALERT
{"action": "manage_alert", "alert_id": "uuid", "operation": "acknowledge|escalate|resolve", "notes": "Optional notes"}
Example: {"action": "manage_alert", "alert_id": "uuid", "operation": "acknowledge", "notes": "Will review shortly"}

6. UPDATE LEAD STATUS
{"action": "update_lead", "lead_id": "uuid", "status": "new|contacted|qualified|proposal|won|lost", "notes": "Optional notes"}
Example: {"action": "update_lead", "lead_id": "uuid", "status": "qualified", "notes": "Ready for proposal"}

7. LOOKUP USER
{"action": "lookup_user", "query": "name or email or role", "search_type": "name|email|role"}
Example: {"action": "lookup_user", "query": "Daisy", "search_type": "name"}

IMPORTANT RULES:
- When asked to schedule something with a person, first use lookup_user to find their ID, then schedule_appointment
- When scheduling requires confirmation, the system will send a confirmation request to participants
- Always confirm details with admin before executing actions
- For natural date references (next Wednesday, tomorrow, etc.), calculate the actual date
- Include action blocks at the END of your response after your explanation

=== END CAPABILITIES ===\n`;

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
9. Include action blocks at the END of your response after explanation`;

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

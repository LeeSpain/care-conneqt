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

    // Compact system overview (stats fetched on demand via actions now)
    systemPrompt += `\n\n=== SYSTEM OVERVIEW ===
You have full READ access to all system data. Use query actions to get current data.
Today: ${new Date().toISOString().split('T')[0]}
=== END OVERVIEW ===\n`;

    // Comprehensive capability instructions
    systemPrompt += `\n\n=== COMMANDS ===
Execute with: \`\`\`action {"action": "name", ...params} \`\`\`

=== READ ACTIONS (Query Data) ===
1. get_members: {status?:"active|inactive", care_level?:"low|medium|high", limit?:number, search?:string}
2. get_member_details: {member_id:string} - Full profile with devices, alerts, nurses
3. get_nurses: {limit?:number} - List nurses with workload stats
4. get_facilities: {limit?:number} - List facilities with occupancy
5. get_leads: {status?:"new|contacted|qualified|proposal|won|lost", limit?:number}
6. get_products: {type?:"device|service", active_only?:boolean}
7. get_pricing_plans: {} - List all pricing plans
8. get_support_tickets: {status?:"open|in_progress|resolved|closed", limit?:number}
9. get_announcements: {active_only?:boolean, limit?:number}
10. get_analytics: {} - Platform-wide statistics
11. get_companies: {type?:"care|insurance", limit?:number}
12. lookup_user: {query:string, search_type:"name|email|role"}

=== WRITE ACTIONS ===
13. send_message: {recipient_type:"user|role|broadcast", recipient_id:string, message:string, priority?:"normal|urgent"}
14. schedule_appointment: {title:string, start_time:string, end_time:string, appointment_type?:"meeting|call|video", participant_ids?:[], requires_confirmation?:boolean}
15. create_task: {title:string, member_id:string, nurse_id:string, task_type?:"check_in|medication|assessment|other", priority?:string, due_date?:string}
16. create_reminder: {title:string, reminder_time:string, priority?:"low|normal|high|urgent", related_entity_type?:string, related_entity_id?:string}
17. manage_alert: {alert_id:string, operation:"acknowledge|escalate|resolve", notes?:string}
18. update_lead: {lead_id:string, status?:"new|contacted|qualified|proposal|won|lost", notes?:string}

Rules:
- Use READ actions to answer questions about the system
- Use lookup_user first to find user IDs before sending messages or creating tasks
- Put action blocks at END of response
- Keep text brief - action results display automatically
=== END COMMANDS ===\n`;

    systemPrompt += `\n\nRespond in ${languageName}. Be concise. NEVER repeat action results in your text - they are shown automatically. Just acknowledge the action briefly (e.g., "Here are the nurses:" or "Done.") then put the action block. Keep responses under 50 words.`;

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
        max_tokens: Math.min(config.max_tokens, 1500),
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
          // READ actions
          case 'get_members':
            result = await executeGetMembers(supabase, actionData);
            break;
          case 'get_member_details':
            result = await executeGetMemberDetails(supabase, actionData);
            break;
          case 'get_nurses':
            result = await executeGetNurses(supabase, actionData);
            break;
          case 'get_facilities':
            result = await executeGetFacilities(supabase, actionData);
            break;
          case 'get_leads':
            result = await executeGetLeads(supabase, actionData);
            break;
          case 'get_products':
            result = await executeGetProducts(supabase, actionData);
            break;
          case 'get_pricing_plans':
            result = await executeGetPricingPlans(supabase);
            break;
          case 'get_support_tickets':
            result = await executeGetSupportTickets(supabase, actionData);
            break;
          case 'get_announcements':
            result = await executeGetAnnouncements(supabase, actionData);
            break;
          case 'get_analytics':
            result = await executeGetAnalytics(supabase);
            break;
          case 'get_companies':
            result = await executeGetCompanies(supabase, actionData);
            break;
          case 'lookup_user':
            result = await executeLookupUser(supabase, actionData);
            break;
          // WRITE actions
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

// ==================== READ ACTION EXECUTORS ====================

async function executeGetMembers(
  supabase: any,
  actionData: { status?: string; care_level?: string; limit?: number; search?: string }
) {
  try {
    let query = supabase
      .from('members')
      .select(`
        id, user_id, care_level, subscription_status, city, country, created_at,
        profiles:user_id (first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(actionData.limit || 20);

    if (actionData.status) {
      query = query.eq('subscription_status', actionData.status);
    }
    if (actionData.care_level) {
      query = query.eq('care_level', actionData.care_level);
    }

    const { data, error } = await query;
    if (error) throw error;

    const members = data?.map((m: any) => ({
      id: m.id,
      name: m.profiles ? `${m.profiles.first_name || ''} ${m.profiles.last_name || ''}`.trim() : 'Unknown',
      email: m.profiles?.email || '',
      care_level: m.care_level || 'not set',
      status: m.subscription_status || 'unknown',
      location: [m.city, m.country].filter(Boolean).join(', ') || 'Unknown',
      joined: m.created_at?.split('T')[0] || ''
    })) || [];

    return { success: true, count: members.length, members };
  } catch (error: any) {
    console.error('Error getting members:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetMemberDetails(
  supabase: any,
  actionData: { member_id: string }
) {
  try {
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select(`
        *,
        profiles:user_id (first_name, last_name, email, phone, avatar_url)
      `)
      .eq('id', actionData.member_id)
      .single();

    if (memberError) throw memberError;

    // Parallel fetch related data
    const [devicesResult, alertsResult, assignmentsResult] = await Promise.all([
      supabase.from('member_devices').select('*').eq('member_id', actionData.member_id),
      supabase.from('alerts').select('*').eq('member_id', actionData.member_id).order('created_at', { ascending: false }).limit(5),
      supabase.from('nurse_assignments').select(`
        *,
        nurse:nurse_id (id, first_name, last_name, email)
      `).eq('member_id', actionData.member_id)
    ]);

    return {
      success: true,
      member: {
        id: member.id,
        name: member.profiles ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim() : 'Unknown',
        email: member.profiles?.email,
        phone: member.profiles?.phone,
        care_level: member.care_level,
        status: member.subscription_status,
        medical_conditions: member.medical_conditions || [],
        medications: member.medications || [],
        allergies: member.allergies || [],
        address: [member.address_line1, member.city, member.postal_code, member.country].filter(Boolean).join(', '),
        emergency_contact: member.emergency_contact_name ? {
          name: member.emergency_contact_name,
          phone: member.emergency_contact_phone,
          relationship: member.emergency_contact_relationship
        } : null
      },
      devices: devicesResult.data?.map((d: any) => ({
        id: d.id,
        name: d.device_name,
        type: d.device_type,
        status: d.device_status,
        battery: d.battery_level,
        last_sync: d.last_sync_at
      })) || [],
      recent_alerts: alertsResult.data?.map((a: any) => ({
        id: a.id,
        title: a.title,
        type: a.alert_type,
        priority: a.priority,
        status: a.status,
        created: a.created_at
      })) || [],
      assigned_nurses: assignmentsResult.data?.map((a: any) => ({
        id: a.nurse?.id,
        name: a.nurse ? `${a.nurse.first_name || ''} ${a.nurse.last_name || ''}`.trim() : 'Unknown',
        is_primary: a.is_primary
      })) || []
    };
  } catch (error: any) {
    console.error('Error getting member details:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetNurses(
  supabase: any,
  actionData: { limit?: number }
) {
  try {
    // Get users with nurse role
    const { data: nurseRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'nurse');

    if (!nurseRoles || nurseRoles.length === 0) {
      return { success: true, count: 0, nurses: [] };
    }

    const nurseIds = nurseRoles.map((r: any) => r.user_id);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, avatar_url')
      .in('id', nurseIds)
      .limit(actionData.limit || 20);

    // Get assignment counts
    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select('nurse_id, member_id');

    const assignmentCounts: { [key: string]: number } = {};
    assignments?.forEach((a: any) => {
      assignmentCounts[a.nurse_id] = (assignmentCounts[a.nurse_id] || 0) + 1;
    });

    // Get task counts
    const { data: tasks } = await supabase
      .from('nurse_tasks')
      .select('nurse_id, status')
      .eq('status', 'pending');

    const taskCounts: { [key: string]: number } = {};
    tasks?.forEach((t: any) => {
      taskCounts[t.nurse_id] = (taskCounts[t.nurse_id] || 0) + 1;
    });

    const nurses = profiles?.map((p: any) => ({
      id: p.id,
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
      email: p.email,
      phone: p.phone,
      assigned_members: assignmentCounts[p.id] || 0,
      pending_tasks: taskCounts[p.id] || 0
    })) || [];

    return { success: true, count: nurses.length, nurses };
  } catch (error: any) {
    console.error('Error getting nurses:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetFacilities(
  supabase: any,
  actionData: { limit?: number }
) {
  try {
    const { data: facilities, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name')
      .limit(actionData.limit || 20);

    if (error) throw error;

    // Get resident counts per facility
    const { data: residents } = await supabase
      .from('facility_residents')
      .select('facility_id')
      .is('discharge_date', null);

    const residentCounts: { [key: string]: number } = {};
    residents?.forEach((r: any) => {
      residentCounts[r.facility_id] = (residentCounts[r.facility_id] || 0) + 1;
    });

    const result = facilities?.map((f: any) => ({
      id: f.id,
      name: f.name,
      type: f.facility_type,
      capacity: f.bed_capacity || 0,
      current_residents: residentCounts[f.id] || 0,
      occupancy: f.bed_capacity ? Math.round((residentCounts[f.id] || 0) / f.bed_capacity * 100) : 0,
      location: [f.city, f.country].filter(Boolean).join(', '),
      status: f.subscription_status,
      contact: f.email || f.phone || 'No contact'
    })) || [];

    return { success: true, count: result.length, facilities: result };
  } catch (error: any) {
    console.error('Error getting facilities:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetLeads(
  supabase: any,
  actionData: { status?: string; limit?: number }
) {
  try {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(actionData.limit || 20);

    if (actionData.status) {
      query = query.eq('status', actionData.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const leads = data?.map((l: any) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      type: l.lead_type,
      interest: l.interest_type,
      status: l.status,
      source: l.source_page,
      organization: l.organization_name,
      estimated_value: l.estimated_value,
      created: l.created_at?.split('T')[0],
      last_contacted: l.last_contacted_at?.split('T')[0]
    })) || [];

    return { success: true, count: leads.length, leads };
  } catch (error: any) {
    console.error('Error getting leads:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetProducts(
  supabase: any,
  actionData: { type?: string; active_only?: boolean }
) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order');

    if (actionData.type) {
      query = query.eq('product_type', actionData.type);
    }
    if (actionData.active_only !== false) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    const products = data?.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      type: p.product_type,
      category: p.category,
      price: p.price,
      is_active: p.is_active,
      is_featured: p.is_featured
    })) || [];

    return { success: true, count: products.length, products };
  } catch (error: any) {
    console.error('Error getting products:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetPricingPlans(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select(`
        *,
        pricing_plan_translations (language, name, description, features)
      `)
      .order('sort_order');

    if (error) throw error;

    const plans = data?.map((p: any) => {
      const enTranslation = p.pricing_plan_translations?.find((t: any) => t.language === 'en') || {};
      return {
        id: p.id,
        slug: p.slug,
        name: enTranslation.name || p.slug,
        price: p.monthly_price,
        devices_included: p.devices_included,
        family_dashboards: p.family_dashboards,
        is_active: p.is_active,
        is_popular: p.is_popular
      };
    }) || [];

    return { success: true, count: plans.length, plans };
  } catch (error: any) {
    console.error('Error getting pricing plans:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetSupportTickets(
  supabase: any,
  actionData: { status?: string; limit?: number }
) {
  try {
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:user_id (first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(actionData.limit || 20);

    if (actionData.status) {
      query = query.eq('status', actionData.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const tickets = data?.map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      category: t.category,
      user: t.user ? `${t.user.first_name || ''} ${t.user.last_name || ''}`.trim() : 'Unknown',
      user_email: t.user?.email,
      created: t.created_at?.split('T')[0],
      resolved: t.resolved_at?.split('T')[0]
    })) || [];

    return { success: true, count: tickets.length, tickets };
  } catch (error: any) {
    console.error('Error getting support tickets:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetAnnouncements(
  supabase: any,
  actionData: { active_only?: boolean; limit?: number }
) {
  try {
    let query = supabase
      .from('platform_announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(actionData.limit || 10);

    if (actionData.active_only !== false) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    const announcements = data?.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.content?.substring(0, 100) + (a.content?.length > 100 ? '...' : ''),
      priority: a.priority,
      target_roles: a.target_roles,
      is_active: a.is_active,
      published: a.published_at?.split('T')[0],
      expires: a.expires_at?.split('T')[0]
    })) || [];

    return { success: true, count: announcements.length, announcements };
  } catch (error: any) {
    console.error('Error getting announcements:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetAnalytics(supabase: any) {
  try {
    const [
      membersResult,
      facilitiesResult,
      careCompaniesResult,
      insuranceResult,
      leadsResult,
      alertsResult,
      ticketsResult,
      ordersResult,
      nursesResult
    ] = await Promise.all([
      supabase.from('members').select('subscription_status'),
      supabase.from('facilities').select('subscription_status'),
      supabase.from('care_companies').select('subscription_status'),
      supabase.from('insurance_companies').select('subscription_status'),
      supabase.from('leads').select('status, lead_type, estimated_value'),
      supabase.from('alerts').select('status, priority'),
      supabase.from('support_tickets').select('status, priority'),
      supabase.from('orders').select('status, total_amount'),
      supabase.from('user_roles').select('user_id').eq('role', 'nurse')
    ]);

    const members = membersResult.data || [];
    const leads = leadsResult.data || [];
    const alerts = alertsResult.data || [];
    const tickets = ticketsResult.data || [];
    const orders = ordersResult.data || [];

    return {
      success: true,
      analytics: {
        members: {
          total: members.length,
          active: members.filter((m: any) => m.subscription_status === 'active').length,
          trial: members.filter((m: any) => m.subscription_status === 'trial').length
        },
        facilities: {
          total: facilitiesResult.data?.length || 0
        },
        care_companies: {
          total: careCompaniesResult.data?.length || 0
        },
        insurance_companies: {
          total: insuranceResult.data?.length || 0
        },
        nurses: {
          total: nursesResult.data?.length || 0
        },
        leads: {
          total: leads.length,
          new: leads.filter((l: any) => l.status === 'new').length,
          qualified: leads.filter((l: any) => l.status === 'qualified').length,
          won: leads.filter((l: any) => l.status === 'won').length,
          total_value: leads.reduce((sum: number, l: any) => sum + (l.estimated_value || 0), 0),
          by_type: {
            personal: leads.filter((l: any) => l.lead_type === 'personal').length,
            institutional: leads.filter((l: any) => l.lead_type === 'institutional').length
          }
        },
        alerts: {
          total: alerts.length,
          active: alerts.filter((a: any) => a.status === 'new' || a.status === 'acknowledged').length,
          critical: alerts.filter((a: any) => a.priority === 'critical').length
        },
        support: {
          total_tickets: tickets.length,
          open: tickets.filter((t: any) => t.status === 'open').length,
          high_priority: tickets.filter((t: any) => t.priority === 'high' || t.priority === 'urgent').length
        },
        orders: {
          total: orders.length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
          revenue: orders.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)
        }
      }
    };
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetCompanies(
  supabase: any,
  actionData: { type?: string; limit?: number }
) {
  try {
    const results: any = { success: true };

    if (!actionData.type || actionData.type === 'care') {
      const { data: careCompanies } = await supabase
        .from('care_companies')
        .select('*')
        .order('name')
        .limit(actionData.limit || 20);

      results.care_companies = careCompanies?.map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.company_type,
        status: c.subscription_status,
        total_clients: c.total_clients,
        total_staff: c.total_staff,
        location: [c.city, c.country].filter(Boolean).join(', '),
        contact: c.email || c.phone
      })) || [];
    }

    if (!actionData.type || actionData.type === 'insurance') {
      const { data: insuranceCompanies } = await supabase
        .from('insurance_companies')
        .select('*')
        .order('name')
        .limit(actionData.limit || 20);

      results.insurance_companies = insuranceCompanies?.map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.insurance_type,
        status: c.subscription_status,
        total_policies: c.total_policies,
        location: [c.city, c.country].filter(Boolean).join(', '),
        contact: c.email || c.phone
      })) || [];
    }

    return results;
  } catch (error: any) {
    console.error('Error getting companies:', error);
    return { success: false, error: error.message };
  }
}

// ==================== WRITE ACTION EXECUTORS ====================

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

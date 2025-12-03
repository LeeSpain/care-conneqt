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
1. get_members: {status?:"active|inactive", care_level?:"low|medium|high", limit?:number}
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

=== CREATE ACTIONS ===
13. create_user: {email:string, first_name:string, last_name:string, role:"member|nurse|family_carer|facility_admin|company_admin|insurance_admin", phone?:string}
14. create_facility: {name:string, facility_type?:"nursing_home|assisted_living|hospital|clinic", bed_capacity?:number, city?:string, country?:string, email?:string, phone?:string}
15. create_company: {name:string, type:"care|insurance", company_type?:string, city?:string, country?:string, email?:string, phone?:string}
16. create_announcement: {title:string, content:string, priority?:"low|normal|high|urgent", target_roles?:["member","nurse","family_carer","facility_admin"], expires_at?:string}

=== UPDATE ACTIONS ===
17. update_user_role: {user_id:string, operation:"add|remove", role:"member|nurse|family_carer|facility_admin|company_admin|insurance_admin|admin"}
18. update_member: {member_id:string, care_level?:"low|medium|high", subscription_status?:"trial|active|inactive|cancelled", city?:string, country?:string}
19. update_facility: {facility_id:string, name?:string, bed_capacity?:number, subscription_status?:"trial|active|inactive", city?:string, email?:string, phone?:string}
20. update_product: {product_id:string, is_active?:boolean, is_featured?:boolean, price?:number}
21. update_ticket_status: {ticket_id:string, status:"open|in_progress|resolved|closed", priority?:"low|medium|high|urgent"}

=== ASSIGNMENT ACTIONS ===
22. assign_nurse_to_member: {nurse_id:string, member_id:string, is_primary?:boolean} - Create nurse-member assignment
23. reassign_member: {member_id:string, old_nurse_id:string, new_nurse_id:string} - Transfer member to different nurse
24. admit_resident: {facility_id:string, member_id:string, room_number?:string} - Add member to facility
25. discharge_resident: {facility_id:string, member_id:string, reason?:string} - Remove member from facility
26. toggle_user_status: {user_id:string, action:"activate|deactivate"} - Enable/disable user account

=== MESSAGING & SCHEDULING ===
27. send_message: {recipient_type:"user|role|broadcast", recipient_id:string, message:string, priority?:"normal|urgent"}
28. schedule_appointment: {title:string, start_time:string, end_time:string, appointment_type?:"meeting|call|video", participant_ids?:[], requires_confirmation?:boolean}
29. create_task: {title:string, member_id:string, nurse_id:string, task_type?:"check_in|medication|assessment|other", priority?:string, due_date?:string}
30. create_reminder: {title:string, reminder_time:string, priority?:"low|normal|high|urgent", related_entity_type?:string, related_entity_id?:string}
31. manage_alert: {alert_id:string, operation:"acknowledge|escalate|resolve", notes?:string}
32. update_lead: {lead_id:string, status?:"new|contacted|qualified|proposal|won|lost", notes?:string}

=== FINANCE ACTIONS ===
33. get_revenue_stats: {} - Get MRR, ARR, total revenue, invoice stats, and financial overview
34. get_subscription_details: {subscription_id?:string, member_id?:string, status?:"active|past_due|canceled|trialing"} - Query subscriptions
35. issue_credit: {member_id:string, amount:number, reason:string, expires_at?:string} - Issue credit to member account
36. process_refund: {invoice_id:string, amount?:number, reason:string} - Process full or partial refund

RULES:
- Use READ actions first to get IDs before modifying data
- Use lookup_user to find user/nurse IDs before assignments
- Put action blocks at END of response
- Keep text brief - action results display automatically
- For assignments, first verify the nurse exists and member exists
- For finance actions, verify member/invoice exists before issuing credits or refunds
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
          // CREATE actions (Phase 2)
          case 'create_user':
            result = await executeCreateUser(supabase, actionData);
            break;
          case 'create_facility':
            result = await executeCreateFacility(supabase, actionData);
            break;
          case 'create_company':
            result = await executeCreateCompany(supabase, actionData);
            break;
          case 'create_announcement':
            result = await executeCreateAnnouncement(supabase, user.id, actionData);
            break;
          // UPDATE actions (Phase 3)
          case 'update_user_role':
            result = await executeUpdateUserRole(supabase, actionData);
            break;
          case 'update_member':
            result = await executeUpdateMember(supabase, actionData);
            break;
          case 'update_facility':
            result = await executeUpdateFacility(supabase, actionData);
            break;
          case 'update_product':
            result = await executeUpdateProduct(supabase, actionData);
            break;
          case 'update_ticket_status':
            result = await executeUpdateTicketStatus(supabase, actionData);
            break;
          // Phase 4: ASSIGNMENT actions
          case 'assign_nurse_to_member':
            result = await executeAssignNurseToMember(supabase, user.id, actionData);
            break;
          case 'reassign_member':
            result = await executeReassignMember(supabase, user.id, actionData);
            break;
          case 'admit_resident':
            result = await executeAdmitResident(supabase, actionData);
            break;
          case 'discharge_resident':
            result = await executeDischargeResident(supabase, actionData);
            break;
          case 'toggle_user_status':
            result = await executeToggleUserStatus(supabase, actionData);
            break;
          // Existing WRITE actions
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
          // FINANCE actions
          case 'get_revenue_stats':
            result = await executeGetRevenueStats(supabase);
            break;
          case 'get_subscription_details':
            result = await executeGetSubscriptionDetails(supabase, actionData);
            break;
          case 'issue_credit':
            result = await executeIssueCredit(supabase, user.id, actionData);
            break;
          case 'process_refund':
            result = await executeProcessRefund(supabase, user.id, actionData);
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

// ==================== PHASE 2: CREATE ACTION EXECUTORS ====================

async function executeCreateUser(
  supabase: any,
  actionData: {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone?: string;
  }
) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: actionData.email,
      email_confirm: true,
      user_metadata: {
        first_name: actionData.first_name,
        last_name: actionData.last_name
      }
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Update profile with phone if provided
    if (actionData.phone) {
      await supabase.from('profiles').update({ phone: actionData.phone }).eq('id', userId);
    }

    // Add role
    if (actionData.role && actionData.role !== 'member') {
      await supabase.from('user_roles').insert({
        user_id: userId,
        role: actionData.role
      });
    }

    // If role is member, create member record
    if (actionData.role === 'member') {
      await supabase.from('members').insert({
        user_id: userId,
        subscription_status: 'trial'
      });
    }

    return { 
      success: true, 
      user_id: userId,
      name: `${actionData.first_name} ${actionData.last_name}`,
      email: actionData.email,
      role: actionData.role
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

async function executeCreateFacility(
  supabase: any,
  actionData: {
    name: string;
    facility_type?: string;
    bed_capacity?: number;
    city?: string;
    country?: string;
    email?: string;
    phone?: string;
  }
) {
  try {
    const { data: facility, error } = await supabase
      .from('facilities')
      .insert({
        name: actionData.name,
        facility_type: actionData.facility_type || 'nursing_home',
        bed_capacity: actionData.bed_capacity || 0,
        city: actionData.city || null,
        country: actionData.country || 'NL',
        email: actionData.email || null,
        phone: actionData.phone || null,
        subscription_status: 'trial'
      })
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      facility_id: facility.id,
      name: facility.name,
      type: facility.facility_type
    };
  } catch (error: any) {
    console.error('Error creating facility:', error);
    return { success: false, error: error.message };
  }
}

async function executeCreateCompany(
  supabase: any,
  actionData: {
    name: string;
    type: 'care' | 'insurance';
    company_type?: string;
    city?: string;
    country?: string;
    email?: string;
    phone?: string;
  }
) {
  try {
    const tableName = actionData.type === 'care' ? 'care_companies' : 'insurance_companies';
    const typeField = actionData.type === 'care' ? 'company_type' : 'insurance_type';
    
    const insertData: any = {
      name: actionData.name,
      city: actionData.city || null,
      country: actionData.country || 'NL',
      email: actionData.email || null,
      phone: actionData.phone || null,
      subscription_status: 'trial'
    };
    
    if (actionData.company_type) {
      insertData[typeField] = actionData.company_type;
    }

    const { data: company, error } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      company_id: company.id,
      name: company.name,
      type: actionData.type
    };
  } catch (error: any) {
    console.error('Error creating company:', error);
    return { success: false, error: error.message };
  }
}

async function executeCreateAnnouncement(
  supabase: any,
  userId: string,
  actionData: {
    title: string;
    content: string;
    priority?: string;
    target_roles?: string[];
    expires_at?: string;
  }
) {
  try {
    const { data: announcement, error } = await supabase
      .from('platform_announcements')
      .insert({
        title: actionData.title,
        content: actionData.content,
        priority: actionData.priority || 'normal',
        target_roles: actionData.target_roles || ['member', 'nurse', 'family_carer', 'facility_admin'],
        expires_at: actionData.expires_at || null,
        published_at: new Date().toISOString(),
        is_active: true,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      announcement_id: announcement.id,
      title: announcement.title
    };
  } catch (error: any) {
    console.error('Error creating announcement:', error);
    return { success: false, error: error.message };
  }
}

// ==================== PHASE 3: UPDATE ACTION EXECUTORS ====================

async function executeUpdateUserRole(
  supabase: any,
  actionData: {
    user_id: string;
    operation: 'add' | 'remove';
    role: string;
  }
) {
  try {
    if (actionData.operation === 'add') {
      // Check if role already exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', actionData.user_id)
        .eq('role', actionData.role)
        .maybeSingle();

      if (existing) {
        return { success: true, message: 'Role already assigned', user_id: actionData.user_id, role: actionData.role };
      }

      const { error } = await supabase.from('user_roles').insert({
        user_id: actionData.user_id,
        role: actionData.role
      });

      if (error) throw error;

      return { success: true, operation: 'added', user_id: actionData.user_id, role: actionData.role };
    } else {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', actionData.user_id)
        .eq('role', actionData.role);

      if (error) throw error;

      return { success: true, operation: 'removed', user_id: actionData.user_id, role: actionData.role };
    }
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
}

async function executeUpdateMember(
  supabase: any,
  actionData: {
    member_id: string;
    care_level?: string;
    subscription_status?: string;
    city?: string;
    country?: string;
  }
) {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (actionData.care_level) updates.care_level = actionData.care_level;
    if (actionData.subscription_status) updates.subscription_status = actionData.subscription_status;
    if (actionData.city) updates.city = actionData.city;
    if (actionData.country) updates.country = actionData.country;

    const { data: member, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', actionData.member_id)
      .select('id, care_level, subscription_status')
      .single();

    if (error) throw error;

    return { 
      success: true, 
      member_id: member.id,
      care_level: member.care_level,
      status: member.subscription_status
    };
  } catch (error: any) {
    console.error('Error updating member:', error);
    return { success: false, error: error.message };
  }
}

async function executeUpdateFacility(
  supabase: any,
  actionData: {
    facility_id: string;
    name?: string;
    bed_capacity?: number;
    subscription_status?: string;
    city?: string;
    email?: string;
    phone?: string;
  }
) {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (actionData.name) updates.name = actionData.name;
    if (actionData.bed_capacity !== undefined) updates.bed_capacity = actionData.bed_capacity;
    if (actionData.subscription_status) updates.subscription_status = actionData.subscription_status;
    if (actionData.city) updates.city = actionData.city;
    if (actionData.email) updates.email = actionData.email;
    if (actionData.phone) updates.phone = actionData.phone;

    const { data: facility, error } = await supabase
      .from('facilities')
      .update(updates)
      .eq('id', actionData.facility_id)
      .select('id, name, bed_capacity, subscription_status')
      .single();

    if (error) throw error;

    return { 
      success: true, 
      facility_id: facility.id,
      name: facility.name,
      capacity: facility.bed_capacity,
      status: facility.subscription_status
    };
  } catch (error: any) {
    console.error('Error updating facility:', error);
    return { success: false, error: error.message };
  }
}

async function executeUpdateProduct(
  supabase: any,
  actionData: {
    product_id: string;
    is_active?: boolean;
    is_featured?: boolean;
    price?: number;
  }
) {
  try {
    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (actionData.is_active !== undefined) updates.is_active = actionData.is_active;
    if (actionData.is_featured !== undefined) updates.is_featured = actionData.is_featured;
    if (actionData.price !== undefined) updates.price = actionData.price;

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', actionData.product_id)
      .select('id, slug, is_active, is_featured, price')
      .single();

    if (error) throw error;

    return { 
      success: true, 
      product_id: product.id,
      slug: product.slug,
      is_active: product.is_active,
      is_featured: product.is_featured,
      price: product.price
    };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

async function executeUpdateTicketStatus(
  supabase: any,
  actionData: {
    ticket_id: string;
    status: string;
    priority?: string;
  }
) {
  try {
    const updates: any = {
      status: actionData.status,
      updated_at: new Date().toISOString()
    };

    if (actionData.priority) updates.priority = actionData.priority;
    
    if (actionData.status === 'resolved' || actionData.status === 'closed') {
      updates.resolved_at = new Date().toISOString();
    }

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', actionData.ticket_id)
      .select('id, title, status, priority')
      .single();

    if (error) throw error;

    return { 
      success: true, 
      ticket_id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority
    };
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return { success: false, error: error.message };
  }
}

// ==================== PHASE 4: ASSIGNMENT ACTION EXECUTORS ====================

async function executeAssignNurseToMember(
  supabase: any,
  assignedBy: string,
  actionData: {
    nurse_id: string;
    member_id: string;
    is_primary?: boolean;
  }
) {
  try {
    // Verify nurse exists and has nurse role
    const { data: nurseRole } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('user_id', actionData.nurse_id)
      .eq('role', 'nurse')
      .maybeSingle();

    if (!nurseRole) {
      return { success: false, error: 'User is not a nurse or does not exist' };
    }

    // Check if assignment already exists
    const { data: existingAssignment } = await supabase
      .from('nurse_assignments')
      .select('id')
      .eq('nurse_id', actionData.nurse_id)
      .eq('member_id', actionData.member_id)
      .maybeSingle();

    if (existingAssignment) {
      return { success: false, error: 'Nurse is already assigned to this member' };
    }

    // If this is primary, remove primary from existing assignments
    if (actionData.is_primary) {
      await supabase
        .from('nurse_assignments')
        .update({ is_primary: false })
        .eq('member_id', actionData.member_id);
    }

    // Create assignment
    const { data: assignment, error } = await supabase
      .from('nurse_assignments')
      .insert({
        nurse_id: actionData.nurse_id,
        member_id: actionData.member_id,
        is_primary: actionData.is_primary || false,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Get nurse name for response
    const { data: nurseProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', actionData.nurse_id)
      .single();

    return { 
      success: true, 
      assignment_id: assignment.id,
      nurse_name: nurseProfile ? `${nurseProfile.first_name} ${nurseProfile.last_name}`.trim() : 'Unknown',
      is_primary: actionData.is_primary || false
    };
  } catch (error: any) {
    console.error('Error assigning nurse:', error);
    return { success: false, error: error.message };
  }
}

async function executeReassignMember(
  supabase: any,
  assignedBy: string,
  actionData: {
    member_id: string;
    old_nurse_id: string;
    new_nurse_id: string;
  }
) {
  try {
    // Verify new nurse exists and has nurse role
    const { data: nurseRole } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('user_id', actionData.new_nurse_id)
      .eq('role', 'nurse')
      .maybeSingle();

    if (!nurseRole) {
      return { success: false, error: 'New user is not a nurse or does not exist' };
    }

    // Get existing assignment
    const { data: existingAssignment } = await supabase
      .from('nurse_assignments')
      .select('id, is_primary')
      .eq('nurse_id', actionData.old_nurse_id)
      .eq('member_id', actionData.member_id)
      .maybeSingle();

    if (!existingAssignment) {
      return { success: false, error: 'No existing assignment found for old nurse' };
    }

    // Delete old assignment
    await supabase
      .from('nurse_assignments')
      .delete()
      .eq('id', existingAssignment.id);

    // Create new assignment with same primary status
    const { data: newAssignment, error } = await supabase
      .from('nurse_assignments')
      .insert({
        nurse_id: actionData.new_nurse_id,
        member_id: actionData.member_id,
        is_primary: existingAssignment.is_primary,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString(),
        notes: `Reassigned from previous nurse by LEE`
      })
      .select()
      .single();

    if (error) throw error;

    // Get nurse names for response
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', [actionData.old_nurse_id, actionData.new_nurse_id]);

    const oldNurse = profiles?.find((p: any) => p.id === actionData.old_nurse_id);
    const newNurse = profiles?.find((p: any) => p.id === actionData.new_nurse_id);

    return { 
      success: true, 
      assignment_id: newAssignment.id,
      old_nurse: oldNurse ? `${oldNurse.first_name} ${oldNurse.last_name}`.trim() : 'Unknown',
      new_nurse: newNurse ? `${newNurse.first_name} ${newNurse.last_name}`.trim() : 'Unknown',
      is_primary: existingAssignment.is_primary
    };
  } catch (error: any) {
    console.error('Error reassigning member:', error);
    return { success: false, error: error.message };
  }
}

async function executeAdmitResident(
  supabase: any,
  actionData: {
    facility_id: string;
    member_id: string;
    room_number?: string;
  }
) {
  try {
    // Check if member is already in this facility
    const { data: existingResident } = await supabase
      .from('facility_residents')
      .select('id')
      .eq('facility_id', actionData.facility_id)
      .eq('member_id', actionData.member_id)
      .is('discharge_date', null)
      .maybeSingle();

    if (existingResident) {
      return { success: false, error: 'Member is already admitted to this facility' };
    }

    // Create resident record
    const { data: resident, error } = await supabase
      .from('facility_residents')
      .insert({
        facility_id: actionData.facility_id,
        member_id: actionData.member_id,
        room_number: actionData.room_number || null,
        admission_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;

    // Get facility and member names
    const [facilityResult, memberResult] = await Promise.all([
      supabase.from('facilities').select('name').eq('id', actionData.facility_id).single(),
      supabase.from('members').select('user_id, profiles:user_id(first_name, last_name)').eq('id', actionData.member_id).single()
    ]);

    const memberName = memberResult.data?.profiles 
      ? `${memberResult.data.profiles.first_name} ${memberResult.data.profiles.last_name}`.trim() 
      : 'Unknown';

    return { 
      success: true, 
      resident_id: resident.id,
      facility_name: facilityResult.data?.name || 'Unknown',
      member_name: memberName,
      room_number: actionData.room_number || 'Not assigned'
    };
  } catch (error: any) {
    console.error('Error admitting resident:', error);
    return { success: false, error: error.message };
  }
}

async function executeDischargeResident(
  supabase: any,
  actionData: {
    facility_id: string;
    member_id: string;
    reason?: string;
  }
) {
  try {
    // Find active resident record
    const { data: existingResident } = await supabase
      .from('facility_residents')
      .select('id, room_number')
      .eq('facility_id', actionData.facility_id)
      .eq('member_id', actionData.member_id)
      .is('discharge_date', null)
      .maybeSingle();

    if (!existingResident) {
      return { success: false, error: 'Member is not currently admitted to this facility' };
    }

    // Update with discharge date
    const { error } = await supabase
      .from('facility_residents')
      .update({
        discharge_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', existingResident.id);

    if (error) throw error;

    // Get facility and member names
    const [facilityResult, memberResult] = await Promise.all([
      supabase.from('facilities').select('name').eq('id', actionData.facility_id).single(),
      supabase.from('members').select('user_id, profiles:user_id(first_name, last_name)').eq('id', actionData.member_id).single()
    ]);

    const memberName = memberResult.data?.profiles 
      ? `${memberResult.data.profiles.first_name} ${memberResult.data.profiles.last_name}`.trim() 
      : 'Unknown';

    return { 
      success: true, 
      facility_name: facilityResult.data?.name || 'Unknown',
      member_name: memberName,
      room_number: existingResident.room_number,
      discharge_date: new Date().toISOString().split('T')[0],
      reason: actionData.reason || 'Not specified'
    };
  } catch (error: any) {
    console.error('Error discharging resident:', error);
    return { success: false, error: error.message };
  }
}

async function executeToggleUserStatus(
  supabase: any,
  actionData: {
    user_id: string;
    action: 'activate' | 'deactivate';
  }
) {
  try {
    // Get user info first
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('id', actionData.user_id)
      .single();

    if (!profile) {
      return { success: false, error: 'User not found' };
    }

    // Update user status in auth - Note: This requires admin auth API
    // For now, we'll track status in a metadata field or separate table
    // Since we can't directly disable auth users from edge function without admin API
    
    // Update the user's roles table to add/remove a disabled marker
    if (actionData.action === 'deactivate') {
      // Check if already deactivated
      const { data: existingDisabled } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', actionData.user_id)
        .eq('role', 'disabled')
        .maybeSingle();

      if (!existingDisabled) {
        await supabase.from('user_roles').insert({
          user_id: actionData.user_id,
          role: 'disabled'
        });
      }
    } else {
      // Remove disabled role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', actionData.user_id)
        .eq('role', 'disabled');
    }

    return { 
      success: true, 
      user_id: actionData.user_id,
      user_name: `${profile.first_name} ${profile.last_name}`.trim(),
      email: profile.email,
      action: actionData.action,
      status: actionData.action === 'activate' ? 'active' : 'disabled'
    };
  } catch (error: any) {
    console.error('Error toggling user status:', error);
    return { success: false, error: error.message };
  }
}

// ==================== FINANCE ACTION EXECUTORS ====================

async function executeGetRevenueStats(supabase: any) {
  try {
    // Fetch all finance data in parallel
    const [
      subscriptionsResult,
      invoicesResult,
      transactionsResult,
      creditsResult
    ] = await Promise.all([
      supabase.from('subscriptions').select('*').eq('status', 'active'),
      supabase.from('invoices').select('*'),
      supabase.from('transactions').select('*'),
      supabase.from('credits').select('*').eq('status', 'active')
    ]);

    const activeSubscriptions = subscriptionsResult.data || [];
    const invoices = invoicesResult.data || [];
    const transactions = transactionsResult.data || [];
    const credits = creditsResult.data || [];

    // Calculate MRR from active subscriptions
    const mrr = activeSubscriptions.reduce((sum: number, sub: any) => {
      let monthlyAmount = sub.amount || 0;
      if (sub.billing_interval === 'year') {
        monthlyAmount = monthlyAmount / 12;
      }
      return sum + monthlyAmount;
    }, 0);

    // Calculate total revenue from paid invoices
    const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

    // Calculate outstanding amount
    const pendingInvoices = invoices.filter((inv: any) => ['pending', 'overdue'].includes(inv.status));
    const outstandingAmount = pendingInvoices.reduce((sum: number, inv: any) => sum + (inv.amount_due || 0), 0);

    // Calculate total credits balance
    const totalCredits = credits.reduce((sum: number, c: any) => sum + (c.remaining_amount || 0), 0);

    // Transaction stats
    const successfulTransactions = transactions.filter((t: any) => t.status === 'completed');
    const failedTransactions = transactions.filter((t: any) => t.status === 'failed');

    return {
      success: true,
      revenue: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        outstanding: Math.round(outstandingAmount * 100) / 100,
        currency: 'EUR'
      },
      subscriptions: {
        active: activeSubscriptions.length,
        total: subscriptionsResult.data?.length || 0
      },
      invoices: {
        total: invoices.length,
        paid: paidInvoices.length,
        pending: pendingInvoices.length,
        overdue: invoices.filter((inv: any) => inv.status === 'overdue').length
      },
      transactions: {
        total: transactions.length,
        successful: successfulTransactions.length,
        failed: failedTransactions.length
      },
      credits: {
        active_count: credits.length,
        total_balance: Math.round(totalCredits * 100) / 100
      }
    };
  } catch (error: any) {
    console.error('Error getting revenue stats:', error);
    return { success: false, error: error.message };
  }
}

async function executeGetSubscriptionDetails(
  supabase: any,
  actionData: { subscription_id?: string; member_id?: string; status?: string }
) {
  try {
    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        members:member_id (
          id,
          profiles:user_id (first_name, last_name, email)
        ),
        pricing_plans:pricing_plan_id (name, billing_interval)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (actionData.subscription_id) {
      query = query.eq('id', actionData.subscription_id);
    }
    if (actionData.member_id) {
      query = query.eq('member_id', actionData.member_id);
    }
    if (actionData.status) {
      query = query.eq('status', actionData.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const subscriptions = data?.map((sub: any) => ({
      id: sub.id,
      member: sub.members?.profiles 
        ? `${sub.members.profiles.first_name || ''} ${sub.members.profiles.last_name || ''}`.trim()
        : 'Unknown',
      email: sub.members?.profiles?.email || '',
      plan: sub.pricing_plans?.name || sub.plan_name || 'Unknown',
      status: sub.status,
      amount: sub.amount,
      currency: sub.currency,
      billing_interval: sub.billing_interval,
      current_period_start: sub.current_period_start?.split('T')[0],
      current_period_end: sub.current_period_end?.split('T')[0],
      cancel_at_period_end: sub.cancel_at_period_end
    })) || [];

    return { success: true, count: subscriptions.length, subscriptions };
  } catch (error: any) {
    console.error('Error getting subscription details:', error);
    return { success: false, error: error.message };
  }
}

async function executeIssueCredit(
  supabase: any,
  adminUserId: string,
  actionData: { member_id: string; amount: number; reason: string; expires_at?: string }
) {
  try {
    if (!actionData.member_id || !actionData.amount || !actionData.reason) {
      return { success: false, error: 'member_id, amount, and reason are required' };
    }

    if (actionData.amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    // Verify member exists
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, profiles:user_id (first_name, last_name, email)')
      .eq('id', actionData.member_id)
      .single();

    if (memberError || !member) {
      return { success: false, error: 'Member not found' };
    }

    // Create the credit
    const { data: credit, error: creditError } = await supabase
      .from('credits')
      .insert({
        member_id: actionData.member_id,
        amount: actionData.amount,
        remaining_amount: actionData.amount,
        reason: actionData.reason,
        status: 'active',
        currency: 'EUR',
        created_by: adminUserId,
        expires_at: actionData.expires_at || null
      })
      .select()
      .single();

    if (creditError) throw creditError;

    // Log the transaction
    await supabase.from('transactions').insert({
      member_id: actionData.member_id,
      type: 'credit',
      amount: actionData.amount,
      currency: 'EUR',
      status: 'completed',
      description: `Credit issued: ${actionData.reason}`,
      metadata: { credit_id: credit.id, issued_by: adminUserId }
    });

    const memberName = member.profiles 
      ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()
      : 'Unknown';

    return {
      success: true,
      credit: {
        id: credit.id,
        member: memberName,
        email: member.profiles?.email,
        amount: credit.amount,
        currency: credit.currency,
        reason: credit.reason,
        expires_at: credit.expires_at?.split('T')[0] || 'Never'
      }
    };
  } catch (error: any) {
    console.error('Error issuing credit:', error);
    return { success: false, error: error.message };
  }
}

async function executeProcessRefund(
  supabase: any,
  adminUserId: string,
  actionData: { invoice_id: string; amount?: number; reason: string }
) {
  try {
    if (!actionData.invoice_id || !actionData.reason) {
      return { success: false, error: 'invoice_id and reason are required' };
    }

    // Get the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        members:member_id (
          id,
          profiles:user_id (first_name, last_name, email)
        )
      `)
      .eq('id', actionData.invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (invoice.status !== 'paid') {
      return { success: false, error: 'Can only refund paid invoices' };
    }

    const refundAmount = actionData.amount || invoice.amount_paid || invoice.total;

    if (refundAmount <= 0) {
      return { success: false, error: 'Refund amount must be greater than 0' };
    }

    if (refundAmount > (invoice.amount_paid || invoice.total)) {
      return { success: false, error: 'Refund amount exceeds paid amount' };
    }

    // Create refund transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        member_id: invoice.member_id,
        invoice_id: invoice.id,
        type: 'refund',
        amount: -refundAmount,
        currency: invoice.currency,
        status: 'completed',
        description: `Refund: ${actionData.reason}`,
        metadata: { 
          original_invoice: invoice.invoice_number,
          refund_reason: actionData.reason,
          processed_by: adminUserId
        }
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Update invoice status if full refund
    const isFullRefund = refundAmount >= (invoice.amount_paid || invoice.total);
    if (isFullRefund) {
      await supabase
        .from('invoices')
        .update({ 
          status: 'refunded',
          notes: `Refunded on ${new Date().toISOString().split('T')[0]}: ${actionData.reason}`
        })
        .eq('id', invoice.id);
    }

    const memberName = invoice.members?.profiles 
      ? `${invoice.members.profiles.first_name || ''} ${invoice.members.profiles.last_name || ''}`.trim()
      : 'Unknown';

    return {
      success: true,
      refund: {
        transaction_id: transaction.id,
        invoice_number: invoice.invoice_number,
        member: memberName,
        email: invoice.members?.profiles?.email,
        amount: refundAmount,
        currency: invoice.currency,
        type: isFullRefund ? 'full' : 'partial',
        reason: actionData.reason,
        new_invoice_status: isFullRefund ? 'refunded' : 'paid'
      }
    };
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return { success: false, error: error.message };
  }
}

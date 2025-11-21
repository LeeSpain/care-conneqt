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

    // Add comprehensive member context if provided
    if (context?.memberId) {
      systemPrompt += '\n\n=== CURRENT MEMBER CONTEXT ===\n';
      
      // Fetch full member data with profile
      const { data: memberData } = await supabase
        .from('members')
        .select(`
          *,
          profiles:user_id (first_name, last_name, phone, email)
        `)
        .eq('id', context.memberId)
        .single();

      if (memberData) {
        systemPrompt += `\nMember: ${memberData.profiles?.first_name} ${memberData.profiles?.last_name}\n`;
        systemPrompt += `Contact: ${memberData.profiles?.phone || 'N/A'}\n`;
        systemPrompt += `Date of Birth: ${memberData.date_of_birth || 'N/A'}\n`;
        systemPrompt += `Care Level: ${memberData.care_level || 'N/A'}\n`;
        systemPrompt += `Mobility: ${memberData.mobility_level || 'N/A'}\n`;
        
        if (memberData.medical_conditions && memberData.medical_conditions.length > 0) {
          systemPrompt += `\nMedical Conditions: ${JSON.stringify(memberData.medical_conditions)}\n`;
        }
        
        if (memberData.medications && memberData.medications.length > 0) {
          systemPrompt += `Current Medications: ${JSON.stringify(memberData.medications)}\n`;
        }
        
        if (memberData.allergies && memberData.allergies.length > 0) {
          systemPrompt += `⚠️ ALLERGIES: ${JSON.stringify(memberData.allergies)}\n`;
        }

        if (memberData.emergency_contact_name) {
          systemPrompt += `\nEmergency Contact: ${memberData.emergency_contact_name} (${memberData.emergency_contact_relationship || 'N/A'})\n`;
          systemPrompt += `Emergency Phone: ${memberData.emergency_contact_phone || 'N/A'}\n`;
        }
      }

      // Fetch recent health metrics (last 20)
      const { data: vitals } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('member_id', context.memberId)
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (vitals && vitals.length > 0) {
        systemPrompt += `\n--- Recent Vitals (Last 20 readings) ---\n`;
        vitals.forEach(v => {
          systemPrompt += `${v.metric_type}: ${v.metric_value} ${v.metric_unit || ''} (${new Date(v.recorded_at || v.created_at).toLocaleString()})\n`;
        });
      }

      // Fetch activity logs (last 50)
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('member_id', context.memberId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activities && activities.length > 0) {
        systemPrompt += `\n--- Recent Activities (Last 50) ---\n`;
        activities.forEach(a => {
          systemPrompt += `[${a.activity_type}] ${a.description} (${new Date(a.created_at).toLocaleString()})\n`;
        });
      }

      // Fetch clinical notes (last 10)
      const { data: notes } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('member_id', context.memberId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (notes && notes.length > 0) {
        systemPrompt += `\n--- Clinical Notes (Last 10) ---\n`;
        notes.forEach(n => {
          systemPrompt += `[${n.note_type || 'General'}] ${n.content}\n`;
          systemPrompt += `By: ${n.author_id} on ${new Date(n.created_at).toLocaleString()}\n\n`;
        });
      }

      // Fetch connected devices
      const { data: devices } = await supabase
        .from('member_devices')
        .select('*')
        .eq('member_id', context.memberId);

      if (devices && devices.length > 0) {
        systemPrompt += `\n--- Connected Devices ---\n`;
        devices.forEach(d => {
          systemPrompt += `${d.device_name} (${d.device_type}): ${d.device_status}\n`;
          if (d.battery_level) {
            systemPrompt += `  Battery: ${d.battery_level}%\n`;
          }
          if (d.last_sync_at) {
            systemPrompt += `  Last Sync: ${new Date(d.last_sync_at).toLocaleString()}\n`;
          }
        });
      }

      // Add alerts and tasks from context
      if (context.alerts && context.alerts.length > 0) {
        systemPrompt += `\n--- Active Alerts ---\n${JSON.stringify(context.alerts, null, 2)}\n`;
      }
      
      if (context.tasks && context.tasks.length > 0) {
        systemPrompt += `\n--- Pending Tasks ---\n${JSON.stringify(context.tasks, null, 2)}\n`;
      }

      systemPrompt += '\n=== END MEMBER CONTEXT ===\n';
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

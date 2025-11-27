import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { planId, devices, customerEmail, customerName, sessionId, conversationId } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('pricing_plans')
      .select('*, plan_translations(*)')
      .eq('slug', planId)
      .single()

    if (planError) throw planError

    // Calculate total
    let totalMonthly = plan.monthly_price

    // Get device prices if devices selected
    if (devices && devices.length > 0) {
      const { data: productsData } = await supabase
        .from('products')
        .select('id, monthly_price')
        .in('slug', devices)

      if (productsData) {
        totalMonthly += productsData.reduce((sum, p) => sum + (p.monthly_price || 0), 0)
      }
    }

    // Find or create lead for this customer
    let leadId = null
    
    // Check if lead exists with this email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', customerEmail)
      .maybeSingle()
    
    if (existingLead) {
      leadId = existingLead.id
      
      // Update lead status to won and add conversion data
      const updateData: any = {
        status: 'won',
        converted_at: new Date().toISOString(),
      }
      
      // Only add conversation_id if it exists
      if (conversationId) {
        updateData.clara_conversation_id = conversationId
      }
      
      await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
      
      // Log conversion activity
      await supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: 'note',
          description: `Lead converted to customer via Clara AI - purchased ${plan.slug} plan`,
          metadata: { plan_slug: plan.slug, devices: devices || [] },
        })
    } else {
      // Create new lead
      const insertData: any = {
        name: customerName,
        email: customerEmail,
        interest_type: 'personal_care',
        lead_type: 'personal',
        source_page: 'clara_chat',
        status: 'won',
        converted_at: new Date().toISOString(),
        message: `Customer purchased via Clara AI - ${plan.slug} plan`,
      }
      
      // Only add conversation_id if it exists
      if (conversationId) {
        insertData.clara_conversation_id = conversationId
      }
      
      const { data: newLead } = await supabase
        .from('leads')
        .insert(insertData)
        .select('id')
        .single()
      
      leadId = newLead?.id
      
      // Log initial activity
      if (leadId) {
        await supabase
          .from('lead_activities')
          .insert({
            lead_id: leadId,
            activity_type: 'note',
            description: `New lead created and converted via Clara AI - purchased ${plan.slug} plan`,
            metadata: { plan_slug: plan.slug, devices: devices || [] },
          })
      }
    }

    // Create order record with lead link
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        plan_id: plan.id,
        selected_devices: devices || [],
        total_monthly: totalMonthly,
        customer_email: customerEmail,
        customer_name: customerName,
        session_id: sessionId,
        conversation_id: conversationId,
        payment_status: 'pending',
        created_by: 'clara',
        lead_id: leadId,
      })
      .select()
      .single()

    if (orderError) throw orderError
    
    // If lead was created/updated, link order to it
    if (leadId) {
      await supabase
        .from('leads')
        .update({ converted_to_member_id: null }) // Will be set when member account is created
        .eq('id', leadId)
    }

    // Check if Stripe is configured
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!stripeKey) {
      // Stripe not configured - return order without payment link
      return new Response(
        JSON.stringify({
          success: true,
          orderId: order.id,
          message: 'Order created. Stripe not configured - payment processing unavailable.',
          requiresManualSetup: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Stripe checkout session (when Stripe is configured)
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'success_url': `${Deno.env.get('SUPABASE_URL')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${Deno.env.get('SUPABASE_URL')}/payment-cancelled`,
        'customer_email': customerEmail,
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': plan.plan_translations?.[0]?.name || plan.slug,
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][price_data][unit_amount]': Math.round(totalMonthly * 100).toString(),
        'line_items[0][quantity]': '1',
        'metadata[order_id]': order.id,
      }),
    })

    const stripeSession = await stripeResponse.json()

    if (!stripeResponse.ok) {
      throw new Error(`Stripe error: ${stripeSession.error?.message || 'Unknown error'}`)
    }

    // Update order with Stripe session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: stripeSession.id })
      .eq('id', order.id)

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: stripeSession.url,
        orderId: order.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

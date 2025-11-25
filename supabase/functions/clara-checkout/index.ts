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
      .eq('id', planId)
      .single()

    if (planError) throw planError

    // Calculate total
    let totalMonthly = plan.monthly_price

    // Get device prices if devices selected
    if (devices && devices.length > 0) {
      const { data: productsData } = await supabase
        .from('products')
        .select('id, monthly_price')
        .in('id', devices)

      if (productsData) {
        totalMonthly += productsData.reduce((sum, p) => sum + (p.monthly_price || 0), 0)
      }
    }

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        plan_id: planId,
        selected_devices: devices || [],
        total_monthly: totalMonthly,
        customer_email: customerEmail,
        customer_name: customerName,
        session_id: sessionId,
        conversation_id: conversationId,
        payment_status: 'pending',
        created_by: 'clara',
      })
      .select()
      .single()

    if (orderError) throw orderError

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

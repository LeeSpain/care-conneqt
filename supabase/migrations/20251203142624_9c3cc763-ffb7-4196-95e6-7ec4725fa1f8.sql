-- =============================================
-- PHASE 1: FINANCE CONTROL CENTRE DATABASE SCHEMA
-- =============================================

-- 1. SUBSCRIPTIONS TABLE - Track active member subscriptions
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.pricing_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  monthly_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'quarterly', 'yearly')),
  currency TEXT NOT NULL DEFAULT 'EUR',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. SUBSCRIPTION_ITEMS TABLE - Line items within subscriptions
CREATE TABLE public.subscription_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_type TEXT NOT NULL CHECK (product_type IN ('plan', 'device', 'service')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. INVOICES TABLE - All generated invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  member_id UUID NOT NULL REFERENCES public.members(id),
  order_id UUID REFERENCES public.orders(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded', 'partially_refunded')),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  amount_due NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  billing_period_start DATE,
  billing_period_end DATE,
  stripe_invoice_id TEXT,
  pdf_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. INVOICE_ITEMS TABLE - Line items on invoices
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_type TEXT CHECK (product_type IN ('plan', 'device', 'service', 'credit', 'discount')),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. TRANSACTIONS TABLE - Every financial movement
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'credit', 'adjustment', 'chargeback', 'payout')),
  invoice_id UUID REFERENCES public.invoices(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  member_id UUID REFERENCES public.members(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'ideal', 'sepa', 'wallet', 'manual')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_refund_id TEXT,
  card_last_four TEXT,
  card_brand TEXT,
  failure_reason TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. CREDITS TABLE - Customer credits/refunds
CREATE TABLE public.credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id),
  amount NUMERIC(10,2) NOT NULL,
  remaining_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'partially_applied', 'applied', 'expired', 'cancelled')),
  applied_to_invoice_id UUID REFERENCES public.invoices(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. REVENUE_SNAPSHOTS TABLE - Daily/monthly revenue metrics
CREATE TABLE public.revenue_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'monthly', 'quarterly', 'yearly')),
  mrr NUMERIC(12,2) DEFAULT 0,
  arr NUMERIC(12,2) DEFAULT 0,
  new_mrr NUMERIC(12,2) DEFAULT 0,
  churned_mrr NUMERIC(12,2) DEFAULT 0,
  expansion_mrr NUMERIC(12,2) DEFAULT 0,
  contraction_mrr NUMERIC(12,2) DEFAULT 0,
  net_mrr_change NUMERIC(12,2) DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  total_subscriptions INTEGER DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  churned_subscriptions INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  avg_revenue_per_user NUMERIC(10,2) DEFAULT 0,
  churn_rate NUMERIC(5,2) DEFAULT 0,
  payment_success_rate NUMERIC(5,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date, period_type)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_subscriptions_member_id ON public.subscriptions(member_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

CREATE INDEX idx_invoices_member_id ON public.invoices(member_id);
CREATE INDEX idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at);

CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_invoice_id ON public.transactions(invoice_id);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

CREATE INDEX idx_credits_member_id ON public.credits(member_id);
CREATE INDEX idx_credits_status ON public.credits(status);

CREATE INDEX idx_revenue_snapshots_date ON public.revenue_snapshots(snapshot_date);
CREATE INDEX idx_revenue_snapshots_period ON public.revenue_snapshots(period_type);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_snapshots ENABLE ROW LEVEL SECURITY;

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- SUBSCRIPTION_ITEMS POLICIES
CREATE POLICY "Admins can manage all subscription items" ON public.subscription_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own subscription items" ON public.subscription_items
  FOR SELECT USING (subscription_id IN (
    SELECT id FROM subscriptions WHERE member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  ));

-- INVOICES POLICIES
CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own invoices" ON public.invoices
  FOR SELECT USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- INVOICE_ITEMS POLICIES
CREATE POLICY "Admins can manage all invoice items" ON public.invoice_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own invoice items" ON public.invoice_items
  FOR SELECT USING (invoice_id IN (
    SELECT id FROM invoices WHERE member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  ));

-- TRANSACTIONS POLICIES
CREATE POLICY "Admins can manage all transactions" ON public.transactions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own transactions" ON public.transactions
  FOR SELECT USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- CREDITS POLICIES
CREATE POLICY "Admins can manage all credits" ON public.credits
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can view own credits" ON public.credits
  FOR SELECT USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

-- REVENUE_SNAPSHOTS POLICIES (Admin only)
CREATE POLICY "Only admins can view revenue snapshots" ON public.revenue_snapshots
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage revenue snapshots" ON public.revenue_snapshots
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON public.credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- HELPER FUNCTION: Generate Invoice Number
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  year_prefix := to_char(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE year_prefix || '-%';
  
  invoice_num := year_prefix || '-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$$;
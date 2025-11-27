-- Enhance leads table with new columns
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS lead_type TEXT CHECK (lead_type IN ('personal', 'facility', 'care_company', 'insurance', 'other')) DEFAULT 'personal',
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS organization_type TEXT,
ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS converted_to_member_id UUID REFERENCES public.members(id),
ADD COLUMN IF NOT EXISTS converted_to_facility_id UUID REFERENCES public.facilities(id),
ADD COLUMN IF NOT EXISTS clara_conversation_id UUID REFERENCES public.ai_agent_conversations(id),
ADD COLUMN IF NOT EXISTS resident_count TEXT,
ADD COLUMN IF NOT EXISTS agreement_length TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'status_change', 'task_completed')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add lead_id to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id);

-- Enable RLS
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_activities
CREATE POLICY "Admins can manage all lead activities"
  ON public.lead_activities FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON public.lead_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_lead_id ON public.orders(lead_id);
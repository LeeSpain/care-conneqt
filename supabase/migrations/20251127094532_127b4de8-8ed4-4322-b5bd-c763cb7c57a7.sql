-- Phase 1: Critical Security Fixes
-- Fix RLS recursion and secure AI tables

-- 1. Create security definer functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id 
  FROM public.company_staff 
  WHERE user_id = _user_id 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_insurance_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT insurance_company_id 
  FROM public.insurance_staff 
  WHERE user_id = _user_id 
  LIMIT 1;
$$;

-- 2. Drop existing recursive policies on company_staff
DROP POLICY IF EXISTS "Company staff can view their company staff" ON public.company_staff;
DROP POLICY IF EXISTS "Company admins can manage staff" ON public.company_staff;

-- 3. Create new non-recursive policies for company_staff
CREATE POLICY "Company staff can view their company colleagues"
ON public.company_staff
FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Company admins can insert staff"
ON public.company_staff
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_staff cs
    WHERE cs.user_id = auth.uid() 
    AND cs.is_company_admin = true
    AND cs.company_id = company_staff.company_id
  )
);

CREATE POLICY "Company admins can update staff"
ON public.company_staff
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.company_staff cs
    WHERE cs.user_id = auth.uid() 
    AND cs.is_company_admin = true
    AND cs.company_id = company_staff.company_id
  )
);

CREATE POLICY "Company admins can delete staff"
ON public.company_staff
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.company_staff cs
    WHERE cs.user_id = auth.uid() 
    AND cs.is_company_admin = true
    AND cs.company_id = company_staff.company_id
  )
);

-- 4. Drop existing recursive policies on insurance_staff
DROP POLICY IF EXISTS "Insurance staff can view their company staff" ON public.insurance_staff;
DROP POLICY IF EXISTS "Insurance admins can manage staff" ON public.insurance_staff;

-- 5. Create new non-recursive policies for insurance_staff
CREATE POLICY "Insurance staff can view their company colleagues"
ON public.insurance_staff
FOR SELECT
TO authenticated
USING (insurance_company_id = public.get_user_insurance_company_id(auth.uid()));

CREATE POLICY "Insurance admins can insert staff"
ON public.insurance_staff
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.insurance_staff ins
    WHERE ins.user_id = auth.uid() 
    AND ins.is_admin = true
    AND ins.insurance_company_id = insurance_staff.insurance_company_id
  )
);

CREATE POLICY "Insurance admins can update staff"
ON public.insurance_staff
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.insurance_staff ins
    WHERE ins.user_id = auth.uid() 
    AND ins.is_admin = true
    AND ins.insurance_company_id = insurance_staff.insurance_company_id
  )
);

CREATE POLICY "Insurance admins can delete staff"
ON public.insurance_staff
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.insurance_staff ins
    WHERE ins.user_id = auth.uid() 
    AND ins.is_admin = true
    AND ins.insurance_company_id = insurance_staff.insurance_company_id
  )
);

-- 6. Secure AI agent tables - Enable RLS
ALTER TABLE public.ai_agent_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_analytics ENABLE ROW LEVEL SECURITY;

-- 7. Add admin-only policies for AI tables
CREATE POLICY "Only admins can view agent configurations"
ON public.ai_agent_configurations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update agent configurations"
ON public.ai_agent_configurations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can view knowledge base"
ON public.ai_agent_knowledge_base
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage knowledge base"
ON public.ai_agent_knowledge_base
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can view agent functions"
ON public.ai_agent_functions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage agent functions"
ON public.ai_agent_functions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can view analytics"
ON public.ai_agent_analytics
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage analytics"
ON public.ai_agent_analytics
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
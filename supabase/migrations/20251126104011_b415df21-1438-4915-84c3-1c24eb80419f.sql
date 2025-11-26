-- Add new roles for commercial entities
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'company_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'insurance_admin';

-- Create care_companies table
CREATE TABLE public.care_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_type TEXT CHECK (company_type IN ('home_care', 'domiciliary', 'agency', 'other')),
  registration_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'GB',
  phone TEXT,
  email TEXT,
  service_areas JSONB DEFAULT '[]'::jsonb,
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  total_clients INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create company_staff table
CREATE TABLE public.company_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.care_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_role TEXT NOT NULL,
  is_company_admin BOOLEAN DEFAULT false,
  hired_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Create company_clients table
CREATE TABLE public.company_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.care_companies(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  service_type TEXT,
  start_date DATE,
  end_date DATE,
  care_plan_id UUID,
  assigned_carers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, member_id)
);

-- Create insurance_companies table
CREATE TABLE public.insurance_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  insurance_type TEXT CHECK (insurance_type IN ('health', 'care', 'life', 'other')),
  registration_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'GB',
  phone TEXT,
  email TEXT,
  total_policies INTEGER DEFAULT 0,
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create insurance_staff table
CREATE TABLE public.insurance_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_role TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  hired_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(insurance_company_id, user_id)
);

-- Create insurance_policies table
CREATE TABLE public.insurance_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
  policy_name TEXT NOT NULL,
  coverage_type TEXT,
  premium_range TEXT,
  covered_services JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create covered_members table
CREATE TABLE public.covered_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.insurance_policies(id) ON DELETE SET NULL,
  policy_number TEXT,
  coverage_start DATE,
  coverage_end DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(insurance_company_id, member_id, policy_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.care_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.covered_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for care_companies
CREATE POLICY "Admins can manage all care companies"
  ON public.care_companies FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Company staff can view own company"
  ON public.care_companies FOR SELECT
  USING (id IN (SELECT company_id FROM public.company_staff WHERE user_id = auth.uid()));

-- RLS Policies for company_staff
CREATE POLICY "Admins can manage all company staff"
  ON public.company_staff FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Company staff can view company colleagues"
  ON public.company_staff FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.company_staff WHERE user_id = auth.uid()));

CREATE POLICY "Company staff can view own record"
  ON public.company_staff FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for company_clients
CREATE POLICY "Admins can manage all company clients"
  ON public.company_clients FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Company staff can view company clients"
  ON public.company_clients FOR SELECT
  USING (company_id IN (SELECT company_id FROM public.company_staff WHERE user_id = auth.uid()));

-- RLS Policies for insurance_companies
CREATE POLICY "Admins can manage all insurance companies"
  ON public.insurance_companies FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Insurance staff can view own company"
  ON public.insurance_companies FOR SELECT
  USING (id IN (SELECT insurance_company_id FROM public.insurance_staff WHERE user_id = auth.uid()));

-- RLS Policies for insurance_staff
CREATE POLICY "Admins can manage all insurance staff"
  ON public.insurance_staff FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Insurance staff can view colleagues"
  ON public.insurance_staff FOR SELECT
  USING (insurance_company_id IN (SELECT insurance_company_id FROM public.insurance_staff WHERE user_id = auth.uid()));

CREATE POLICY "Insurance staff can view own record"
  ON public.insurance_staff FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for insurance_policies
CREATE POLICY "Admins can manage all insurance policies"
  ON public.insurance_policies FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Insurance staff can view company policies"
  ON public.insurance_policies FOR SELECT
  USING (insurance_company_id IN (SELECT insurance_company_id FROM public.insurance_staff WHERE user_id = auth.uid()));

-- RLS Policies for covered_members
CREATE POLICY "Admins can manage all covered members"
  ON public.covered_members FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Insurance staff can view company covered members"
  ON public.covered_members FOR SELECT
  USING (insurance_company_id IN (SELECT insurance_company_id FROM public.insurance_staff WHERE user_id = auth.uid()));

CREATE POLICY "Members can view own insurance coverage"
  ON public.covered_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.members
    WHERE members.user_id = auth.uid() AND members.id = covered_members.member_id
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_care_companies_updated_at
  BEFORE UPDATE ON public.care_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_staff_updated_at
  BEFORE UPDATE ON public.company_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_clients_updated_at
  BEFORE UPDATE ON public.company_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_companies_updated_at
  BEFORE UPDATE ON public.insurance_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_staff_updated_at
  BEFORE UPDATE ON public.insurance_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_policies_updated_at
  BEFORE UPDATE ON public.insurance_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_covered_members_updated_at
  BEFORE UPDATE ON public.covered_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
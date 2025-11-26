-- Create institutional_registrations table for comprehensive organization registration
CREATE TABLE public.institutional_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Organization Details
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL, -- care_home, municipality, insurance, corporate, care_group
  registration_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'NL',
  website TEXT,
  
  -- Contact Person
  contact_name TEXT NOT NULL,
  contact_job_title TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_contact_method TEXT, -- email, phone, either
  best_time_to_contact TEXT,
  
  -- Service Requirements
  resident_count INTEGER,
  employee_count INTEGER,
  service_interests TEXT[], -- monitoring, ai_guardian, nurse_support, device_management, etc.
  current_systems TEXT, -- existing systems for integration
  implementation_timeline TEXT, -- immediate, 1-3_months, 3-6_months, 6-12_months
  
  -- Contract Preferences
  preferred_agreement_length TEXT, -- pilot, 12_months, 24_months, 36_months
  budget_range TEXT,
  procurement_process TEXT,
  
  -- Compliance & Integration
  gdpr_requirements TEXT,
  ehr_systems TEXT, -- existing EHR/care systems
  security_requirements TEXT,
  additional_notes TEXT,
  
  -- Status & Management
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, proposal_sent, negotiating, closed_won, closed_lost
  assigned_to UUID REFERENCES auth.users(id),
  follow_up_date DATE,
  converted_to_facility_id UUID REFERENCES public.facilities(id),
  converted_to_company_id UUID REFERENCES public.care_companies(id),
  converted_to_insurance_id UUID REFERENCES public.insurance_companies(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.institutional_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can create registrations (public form)
CREATE POLICY "Anyone can create institutional registrations"
ON public.institutional_registrations
FOR INSERT
TO public
WITH CHECK (true);

-- Admins can view and manage all registrations
CREATE POLICY "Admins can view all institutional registrations"
ON public.institutional_registrations
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update institutional registrations"
ON public.institutional_registrations
FOR UPDATE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete institutional registrations"
ON public.institutional_registrations
FOR DELETE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_institutional_registrations_updated_at
BEFORE UPDATE ON public.institutional_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for status queries
CREATE INDEX idx_institutional_registrations_status ON public.institutional_registrations(status);
CREATE INDEX idx_institutional_registrations_created_at ON public.institutional_registrations(created_at DESC);
-- Add customer_type enum
DO $$ BEGIN
  CREATE TYPE customer_type AS ENUM ('member', 'facility', 'care_company', 'insurance_company');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update subscriptions table
ALTER TABLE subscriptions 
  ADD COLUMN IF NOT EXISTS customer_type customer_type DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS facility_id uuid REFERENCES facilities(id),
  ADD COLUMN IF NOT EXISTS care_company_id uuid REFERENCES care_companies(id),
  ADD COLUMN IF NOT EXISTS insurance_company_id uuid REFERENCES insurance_companies(id);

ALTER TABLE subscriptions ALTER COLUMN member_id DROP NOT NULL;

-- Update invoices table  
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS customer_type customer_type DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS facility_id uuid REFERENCES facilities(id),
  ADD COLUMN IF NOT EXISTS care_company_id uuid REFERENCES care_companies(id),
  ADD COLUMN IF NOT EXISTS insurance_company_id uuid REFERENCES insurance_companies(id);

ALTER TABLE invoices ALTER COLUMN member_id DROP NOT NULL;

-- Update transactions table
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS customer_type customer_type DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS facility_id uuid REFERENCES facilities(id),
  ADD COLUMN IF NOT EXISTS care_company_id uuid REFERENCES care_companies(id),
  ADD COLUMN IF NOT EXISTS insurance_company_id uuid REFERENCES insurance_companies(id);

-- Update credits table
ALTER TABLE credits
  ADD COLUMN IF NOT EXISTS customer_type customer_type DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS facility_id uuid REFERENCES facilities(id),
  ADD COLUMN IF NOT EXISTS care_company_id uuid REFERENCES care_companies(id),
  ADD COLUMN IF NOT EXISTS insurance_company_id uuid REFERENCES insurance_companies(id);

ALTER TABLE credits ALTER COLUMN member_id DROP NOT NULL;

-- Add RLS policies for facility/company/insurance access
CREATE POLICY "Facility admins can view facility subscriptions" 
ON subscriptions FOR SELECT 
USING (facility_id = get_user_facility_id(auth.uid()));

CREATE POLICY "Company admins can view company subscriptions" 
ON subscriptions FOR SELECT 
USING (care_company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Insurance admins can view insurance subscriptions" 
ON subscriptions FOR SELECT 
USING (insurance_company_id = get_user_insurance_company_id(auth.uid()));

CREATE POLICY "Facility admins can view facility invoices" 
ON invoices FOR SELECT 
USING (facility_id = get_user_facility_id(auth.uid()));

CREATE POLICY "Company admins can view company invoices" 
ON invoices FOR SELECT 
USING (care_company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Insurance admins can view insurance invoices" 
ON invoices FOR SELECT 
USING (insurance_company_id = get_user_insurance_company_id(auth.uid()));

CREATE POLICY "Facility admins can view facility transactions" 
ON transactions FOR SELECT 
USING (facility_id = get_user_facility_id(auth.uid()));

CREATE POLICY "Company admins can view company transactions" 
ON transactions FOR SELECT 
USING (care_company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Insurance admins can view insurance transactions" 
ON transactions FOR SELECT 
USING (insurance_company_id = get_user_insurance_company_id(auth.uid()));

CREATE POLICY "Facility admins can view facility credits" 
ON credits FOR SELECT 
USING (facility_id = get_user_facility_id(auth.uid()));

CREATE POLICY "Company admins can view company credits" 
ON credits FOR SELECT 
USING (care_company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Insurance admins can view insurance credits" 
ON credits FOR SELECT 
USING (insurance_company_id = get_user_insurance_company_id(auth.uid()));
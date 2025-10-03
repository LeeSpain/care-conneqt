-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('member', 'family_carer', 'nurse', 'facility_admin', 'admin');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'incomplete');

-- Create enum for consent type
CREATE TYPE public.consent_type AS ENUM ('terms_of_service', 'privacy_policy', 'data_processing', 'marketing');

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER ROLES TABLE (SECURITY CRITICAL)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER FUNCTION (PREVENTS RLS RECURSION)
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============================================
-- MEMBERS TABLE (B2C USERS)
-- ============================================
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  date_of_birth DATE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'GB',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  medical_conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  mobility_level TEXT,
  care_level TEXT,
  subscription_status subscription_status DEFAULT 'trial',
  subscription_tier TEXT,
  trial_ends_at TIMESTAMPTZ,
  subscription_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FAMILY CARERS TABLE
-- ============================================
CREATE TABLE public.family_carers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  relationship_to_member TEXT NOT NULL,
  is_primary_contact BOOLEAN DEFAULT FALSE,
  can_view_medical BOOLEAN DEFAULT TRUE,
  can_receive_alerts BOOLEAN DEFAULT TRUE,
  invitation_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.family_carers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MEMBER-CARER RELATIONSHIPS
-- ============================================
CREATE TABLE public.member_carers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  carer_id UUID REFERENCES public.family_carers(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(member_id, carer_id)
);

ALTER TABLE public.member_carers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FACILITIES TABLE (B2B)
-- ============================================
CREATE TABLE public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  facility_type TEXT,
  license_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'GB',
  phone TEXT,
  email TEXT,
  bed_capacity INTEGER,
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FACILITY RESIDENTS
-- ============================================
CREATE TABLE public.facility_residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT,
  admission_date DATE,
  discharge_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(facility_id, member_id)
);

ALTER TABLE public.facility_residents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FACILITY STAFF
-- ============================================
CREATE TABLE public.facility_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  staff_role TEXT NOT NULL,
  is_facility_admin BOOLEAN DEFAULT FALSE,
  hired_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(facility_id, user_id)
);

ALTER TABLE public.facility_staff ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NURSE ASSIGNMENTS (AUTO-ASSIGNMENT)
-- ============================================
CREATE TABLE public.nurse_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.nurse_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CLINICAL NOTES
-- ============================================
CREATE TABLE public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note_type TEXT,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AUDIT LOGS (GDPR COMPLIANCE)
-- ============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER CONSENTS (GDPR)
-- ============================================
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type consent_type NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - USER ROLES
-- ============================================
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - MEMBERS
-- ============================================
CREATE POLICY "Members can view own data"
  ON public.members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Members can update own data"
  ON public.members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Nurses can view assigned members"
  ON public.members FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = members.id
    )
  );

CREATE POLICY "Family carers can view connected members"
  ON public.members FOR SELECT
  USING (
    public.has_role(auth.uid(), 'family_carer') AND
    EXISTS (
      SELECT 1 FROM public.member_carers mc
      JOIN public.family_carers fc ON fc.id = mc.carer_id
      WHERE fc.user_id = auth.uid() AND mc.member_id = members.id
    )
  );

CREATE POLICY "Admins can view all members"
  ON public.members FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - FAMILY CARERS
-- ============================================
CREATE POLICY "Carers can view own data"
  ON public.family_carers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Carers can update own data"
  ON public.family_carers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all carers"
  ON public.family_carers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - MEMBER CARERS
-- ============================================
CREATE POLICY "Members can view own carers"
  ON public.member_carers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = member_carers.member_id
    )
  );

CREATE POLICY "Carers can view own connections"
  ON public.member_carers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_carers
      WHERE user_id = auth.uid() AND id = member_carers.carer_id
    )
  );

-- ============================================
-- RLS POLICIES - CLINICAL NOTES
-- ============================================
CREATE POLICY "Members can view own notes"
  ON public.clinical_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = clinical_notes.member_id
    ) AND NOT is_private
  );

CREATE POLICY "Nurses can view assigned member notes"
  ON public.clinical_notes FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = clinical_notes.member_id
    )
  );

CREATE POLICY "Nurses can create notes"
  ON public.clinical_notes FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = clinical_notes.member_id
    )
  );

CREATE POLICY "Admins can view all notes"
  ON public.clinical_notes FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - FACILITIES
-- ============================================
CREATE POLICY "Facility admins can view own facility"
  ON public.facilities FOR SELECT
  USING (
    public.has_role(auth.uid(), 'facility_admin') AND
    EXISTS (
      SELECT 1 FROM public.facility_staff
      WHERE user_id = auth.uid() AND facility_id = facilities.id AND is_facility_admin = TRUE
    )
  );

CREATE POLICY "Facility admins can update own facility"
  ON public.facilities FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'facility_admin') AND
    EXISTS (
      SELECT 1 FROM public.facility_staff
      WHERE user_id = auth.uid() AND facility_id = facilities.id AND is_facility_admin = TRUE
    )
  );

CREATE POLICY "Admins can view all facilities"
  ON public.facilities FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - AUDIT LOGS
-- ============================================
CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - USER CONSENTS
-- ============================================
CREATE POLICY "Users can view own consents"
  ON public.user_consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own consents"
  ON public.user_consents FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consents"
  ON public.user_consents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_family_carers_updated_at
  BEFORE UPDATE ON public.family_carers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- AUTO NURSE ASSIGNMENT FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.auto_assign_nurse()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available_nurse_id UUID;
BEGIN
  -- Find nurse with least assignments
  SELECT ur.user_id INTO available_nurse_id
  FROM public.user_roles ur
  LEFT JOIN public.nurse_assignments na ON na.nurse_id = ur.user_id
  WHERE ur.role = 'nurse'
  GROUP BY ur.user_id
  ORDER BY COUNT(na.id) ASC
  LIMIT 1;

  -- Assign if nurse found
  IF available_nurse_id IS NOT NULL THEN
    INSERT INTO public.nurse_assignments (nurse_id, member_id, is_primary)
    VALUES (available_nurse_id, NEW.id, TRUE);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_assign_nurse_to_member
  AFTER INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_nurse();
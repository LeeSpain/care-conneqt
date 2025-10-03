-- ============================================
-- DEVICES & HEALTH DATA TABLES
-- ============================================

-- Device types enum
CREATE TYPE public.device_type AS ENUM ('vivago_watch', 'dosell_dispenser', 'bbrain_sensor', 'heart_monitor', 'fall_detector', 'other');

-- Device status enum
CREATE TYPE public.device_status AS ENUM ('active', 'inactive', 'error', 'needs_battery');

-- Member devices
CREATE TABLE public.member_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  device_type device_type NOT NULL,
  device_name TEXT NOT NULL,
  device_serial TEXT,
  device_status device_status DEFAULT 'active',
  last_sync_at TIMESTAMPTZ,
  battery_level INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.member_devices ENABLE ROW LEVEL SECURITY;

-- Health metrics
CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.member_devices(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- Activity logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ALERTS & NOTIFICATIONS
-- ============================================

-- Alert priority enum
CREATE TYPE public.alert_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Alert status enum
CREATE TYPE public.alert_status AS ENUM ('new', 'acknowledged', 'in_progress', 'resolved', 'dismissed');

-- Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  device_id UUID REFERENCES public.member_devices(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  priority alert_priority DEFAULT 'medium',
  status alert_status DEFAULT 'new',
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TASKS & SCHEDULING
-- ============================================

-- Task priority enum
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Task status enum
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Nurse tasks
CREATE TABLE public.nurse_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.nurse_tasks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AI GUARDIAN CHAT
-- ============================================

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FAMILY INVITATIONS
-- ============================================

-- Invitation status enum
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Family invitations
CREATE TABLE public.family_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  invitation_token UUID DEFAULT gen_random_uuid() UNIQUE,
  status invitation_status DEFAULT 'pending',
  relationship TEXT NOT NULL,
  permissions JSONB DEFAULT '{"view_medical": true, "receive_alerts": true}'::jsonb,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - DEVICES
-- ============================================

CREATE POLICY "Members can view own devices"
  ON public.member_devices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = member_devices.member_id
    )
  );

CREATE POLICY "Members can manage own devices"
  ON public.member_devices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = member_devices.member_id
    )
  );

CREATE POLICY "Nurses can view assigned member devices"
  ON public.member_devices FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = member_devices.member_id
    )
  );

CREATE POLICY "Family carers can view connected member devices"
  ON public.member_devices FOR SELECT
  USING (
    public.has_role(auth.uid(), 'family_carer') AND
    EXISTS (
      SELECT 1 FROM public.member_carers mc
      JOIN public.family_carers fc ON fc.id = mc.carer_id
      WHERE fc.user_id = auth.uid() AND mc.member_id = member_devices.member_id
    )
  );

-- ============================================
-- RLS POLICIES - HEALTH METRICS
-- ============================================

CREATE POLICY "Members can view own health metrics"
  ON public.health_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = health_metrics.member_id
    )
  );

CREATE POLICY "Nurses can view assigned member health metrics"
  ON public.health_metrics FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = health_metrics.member_id
    )
  );

CREATE POLICY "Family carers can view connected member health metrics"
  ON public.health_metrics FOR SELECT
  USING (
    public.has_role(auth.uid(), 'family_carer') AND
    EXISTS (
      SELECT 1 FROM public.member_carers mc
      JOIN public.family_carers fc ON fc.id = mc.carer_id
      WHERE fc.user_id = auth.uid() AND mc.member_id = health_metrics.member_id
      AND (mc.accepted_at IS NOT NULL)
    )
  );

-- ============================================
-- RLS POLICIES - ALERTS
-- ============================================

CREATE POLICY "Members can view own alerts"
  ON public.alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = alerts.member_id
    )
  );

CREATE POLICY "Nurses can view and manage assigned member alerts"
  ON public.alerts FOR ALL
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = alerts.member_id
    )
  );

CREATE POLICY "Family carers can view connected member alerts"
  ON public.alerts FOR SELECT
  USING (
    public.has_role(auth.uid(), 'family_carer') AND
    EXISTS (
      SELECT 1 FROM public.member_carers mc
      JOIN public.family_carers fc ON fc.id = mc.carer_id
      WHERE fc.user_id = auth.uid() AND mc.member_id = alerts.member_id
    )
  );

-- ============================================
-- RLS POLICIES - TASKS
-- ============================================

CREATE POLICY "Nurses can view own tasks"
  ON public.nurse_tasks FOR SELECT
  USING (auth.uid() = nurse_id);

CREATE POLICY "Nurses can manage own tasks"
  ON public.nurse_tasks FOR ALL
  USING (auth.uid() = nurse_id);

CREATE POLICY "Admins can view all tasks"
  ON public.nurse_tasks FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - CHAT MESSAGES
-- ============================================

CREATE POLICY "Members can view own chat messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = chat_messages.member_id
    )
  );

CREATE POLICY "Members can create own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = chat_messages.member_id
    )
  );

-- ============================================
-- RLS POLICIES - INVITATIONS
-- ============================================

CREATE POLICY "Members can view own invitations"
  ON public.family_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = family_invitations.member_id
    )
  );

CREATE POLICY "Members can create invitations"
  ON public.family_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = family_invitations.member_id
    )
  );

CREATE POLICY "Members can update own invitations"
  ON public.family_invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = family_invitations.member_id
    )
  );

CREATE POLICY "Anyone can view invitations by token"
  ON public.family_invitations FOR SELECT
  USING (true);

-- ============================================
-- RLS POLICIES - ACTIVITY LOGS
-- ============================================

CREATE POLICY "Members can view own activity"
  ON public.activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid() AND id = activity_logs.member_id
    )
  );

CREATE POLICY "Nurses can view assigned member activity"
  ON public.activity_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'nurse') AND
    EXISTS (
      SELECT 1 FROM public.nurse_assignments
      WHERE nurse_id = auth.uid() AND member_id = activity_logs.member_id
    )
  );

CREATE POLICY "Family carers can view connected member activity"
  ON public.activity_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'family_carer') AND
    EXISTS (
      SELECT 1 FROM public.member_carers mc
      JOIN public.family_carers fc ON fc.id = mc.carer_id
      WHERE fc.user_id = auth.uid() AND mc.member_id = activity_logs.member_id
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_member_devices_updated_at
  BEFORE UPDATE ON public.member_devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_nurse_tasks_updated_at
  BEFORE UPDATE ON public.nurse_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_family_invitations_updated_at
  BEFORE UPDATE ON public.family_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
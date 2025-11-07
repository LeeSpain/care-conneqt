-- Add RLS policies for nurses to view and manage assigned members
CREATE POLICY "Nurses can view assigned members"
ON public.members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = members.id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to view assigned members' health metrics
CREATE POLICY "Nurses can view assigned members health metrics"
ON public.health_metrics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = health_metrics.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to view assigned members' alerts
CREATE POLICY "Nurses can view assigned members alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = alerts.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to update assigned members' alerts
CREATE POLICY "Nurses can update assigned members alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = alerts.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to view assigned members' devices
CREATE POLICY "Nurses can view assigned members devices"
ON public.member_devices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = member_devices.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to view assigned members' activity logs
CREATE POLICY "Nurses can view assigned members activity"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = activity_logs.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to create and view clinical notes for assigned members
CREATE POLICY "Nurses can create clinical notes for assigned members"
ON public.clinical_notes
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = clinical_notes.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

CREATE POLICY "Nurses can view clinical notes for assigned members"
ON public.clinical_notes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = clinical_notes.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);

-- Add RLS policy for nurses to insert health metrics for assigned members
CREATE POLICY "Nurses can insert health metrics for assigned members"
ON public.health_metrics
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.nurse_assignments
    WHERE nurse_assignments.member_id = health_metrics.member_id
    AND nurse_assignments.nurse_id = auth.uid()
  )
);
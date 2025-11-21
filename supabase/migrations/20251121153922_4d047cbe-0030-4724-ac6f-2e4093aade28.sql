-- Step 1: Create helper function to check nurse assignments without triggering RLS
CREATE OR REPLACE FUNCTION public.is_nurse_assigned_to_member(
  p_nurse_id UUID,
  p_member_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.nurse_assignments
    WHERE nurse_id = p_nurse_id 
    AND member_id = p_member_id
  );
$$;

-- Step 2: Fix profiles policy to prevent circular dependencies
DROP POLICY IF EXISTS "Members can view assigned nurse profiles" ON public.profiles;

CREATE POLICY "Members can view assigned nurse profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Members can see profiles of nurses assigned to them
  id IN (
    SELECT na.nurse_id 
    FROM public.nurse_assignments na
    INNER JOIN public.members m ON m.id = na.member_id
    WHERE m.user_id = auth.uid()
  )
  OR
  -- Nurses can see profiles of their assigned members
  id IN (
    SELECT m.user_id
    FROM public.members m
    INNER JOIN public.nurse_assignments na ON na.member_id = m.id
    WHERE na.nurse_id = auth.uid()
  )
);

-- Step 3: Fix members policy with explicit role check and helper function
DROP POLICY IF EXISTS "Nurses can view assigned members" ON public.members;

CREATE POLICY "Nurses can view assigned members"
ON public.members
FOR SELECT
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), members.id)
  AND public.has_role(auth.uid(), 'nurse'::app_role)
);

-- Step 4: Update clinical_notes policy to use helper function
DROP POLICY IF EXISTS "Nurses can view clinical notes for assigned members" ON public.clinical_notes;

CREATE POLICY "Nurses can view clinical notes for assigned members"
ON public.clinical_notes
FOR SELECT
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), clinical_notes.member_id)
);

-- Step 5: Update activity_logs policy to use helper function
DROP POLICY IF EXISTS "Nurses can view assigned members activity" ON public.activity_logs;

CREATE POLICY "Nurses can view assigned members activity"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), activity_logs.member_id)
);

-- Step 6: Update health_metrics policies to use helper function
DROP POLICY IF EXISTS "Nurses can view assigned members health metrics" ON public.health_metrics;

CREATE POLICY "Nurses can view assigned members health metrics"
ON public.health_metrics
FOR SELECT
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), health_metrics.member_id)
);

DROP POLICY IF EXISTS "Nurses can insert health metrics for assigned members" ON public.health_metrics;

CREATE POLICY "Nurses can insert health metrics for assigned members"
ON public.health_metrics
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_nurse_assigned_to_member(auth.uid(), health_metrics.member_id)
);

-- Step 7: Update alerts policies to use helper function
DROP POLICY IF EXISTS "Nurses can view assigned members alerts" ON public.alerts;

CREATE POLICY "Nurses can view assigned members alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), alerts.member_id)
);

DROP POLICY IF EXISTS "Nurses can update assigned members alerts" ON public.alerts;

CREATE POLICY "Nurses can update assigned members alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (
  public.is_nurse_assigned_to_member(auth.uid(), alerts.member_id)
);
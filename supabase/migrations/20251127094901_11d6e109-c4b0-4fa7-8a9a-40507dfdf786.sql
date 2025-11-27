-- Phase 3: RLS Policy Improvements
-- Add policies for better data access control

-- 1. Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Family carers can view member health metrics (based on permissions)
CREATE POLICY "Family carers can view member health metrics"
ON public.health_metrics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.member_carers mc
    JOIN public.family_carers fc ON fc.id = mc.carer_id
    WHERE fc.user_id = auth.uid()
    AND mc.member_id = health_metrics.member_id
    AND fc.can_view_medical = true
  )
);

-- 3. Family carers can view member alerts (based on permissions)
CREATE POLICY "Family carers can receive member alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.member_carers mc
    JOIN public.family_carers fc ON fc.id = mc.carer_id
    WHERE fc.user_id = auth.uid()
    AND mc.member_id = alerts.member_id
    AND fc.can_receive_alerts = true
  )
);

-- 4. Facility residents can view own records
CREATE POLICY "Residents can view own facility records"
ON public.facility_residents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.members
    WHERE members.user_id = auth.uid()
    AND members.id = facility_residents.member_id
  )
);

-- 5. Company clients can view own service details
CREATE POLICY "Clients can view own company service details"
ON public.company_clients
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.members
    WHERE members.user_id = auth.uid()
    AND members.id = company_clients.member_id
  )
);

-- 6. Family carers can view member devices (based on permissions)
CREATE POLICY "Family carers can view member devices"
ON public.member_devices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.member_carers mc
    JOIN public.family_carers fc ON fc.id = mc.carer_id
    WHERE fc.user_id = auth.uid()
    AND mc.member_id = member_devices.member_id
    AND fc.can_view_medical = true
  )
);
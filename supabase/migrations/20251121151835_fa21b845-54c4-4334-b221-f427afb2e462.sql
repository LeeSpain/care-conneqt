-- Add RLS policies for family carers to view alerts for their connected members
CREATE POLICY "Family carers can view assigned members alerts"
ON alerts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM member_carers mc
    JOIN family_carers fc ON fc.id = mc.carer_id
    WHERE fc.user_id = auth.uid()
    AND mc.member_id = alerts.member_id
  )
);

-- Add RLS policy for facility staff to view resident alerts
CREATE POLICY "Facility staff can view resident alerts"
ON alerts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM facility_staff fs
    JOIN facility_residents fr ON fr.facility_id = fs.facility_id
    WHERE fs.user_id = auth.uid()
    AND fr.member_id = alerts.member_id
  )
);
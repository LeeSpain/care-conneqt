
-- Drop and recreate the member_carers RLS policy with better error handling
DROP POLICY IF EXISTS "Carers can view own connections" ON member_carers;

-- Create a simpler, more robust policy
CREATE POLICY "Carers can view own connections"
ON member_carers
FOR SELECT
TO authenticated
USING (
  carer_id IN (
    SELECT id 
    FROM family_carers 
    WHERE user_id = auth.uid()
  )
);

-- Also ensure Members can view their carers policy is working
DROP POLICY IF EXISTS "Members can view own carers" ON member_carers;

CREATE POLICY "Members can view own carers"
ON member_carers
FOR SELECT
TO authenticated
USING (
  member_id IN (
    SELECT id 
    FROM members 
    WHERE user_id = auth.uid()
  )
);


-- Add RLS policies for nurse_assignments table

-- Members can view their assigned nurses
CREATE POLICY "Members can view own nurse assignments"
ON nurse_assignments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM members
    WHERE members.id = nurse_assignments.member_id
    AND members.user_id = auth.uid()
  )
);

-- Nurses can view their assignments
CREATE POLICY "Nurses can view own assignments"
ON nurse_assignments
FOR SELECT
TO authenticated
USING (
  nurse_id = auth.uid()
);

-- Only admins can create/update/delete nurse assignments
-- (This would typically be done through an admin interface)
CREATE POLICY "Admins can manage nurse assignments"
ON nurse_assignments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

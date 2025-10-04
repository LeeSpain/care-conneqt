-- 1) Add foreign keys and indexes for nurse_assignments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'nurse_assignments_nurse_id_fkey'
  ) THEN
    ALTER TABLE public.nurse_assignments
    ADD CONSTRAINT nurse_assignments_nurse_id_fkey
    FOREIGN KEY (nurse_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'nurse_assignments_member_id_fkey'
  ) THEN
    ALTER TABLE public.nurse_assignments
    ADD CONSTRAINT nurse_assignments_member_id_fkey
    FOREIGN KEY (member_id)
    REFERENCES public.members(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Indexes to speed up lookups
CREATE INDEX IF NOT EXISTS idx_nurse_assignments_nurse_id ON public.nurse_assignments(nurse_id);
CREATE INDEX IF NOT EXISTS idx_nurse_assignments_member_id ON public.nurse_assignments(member_id);

-- 2) Profiles policy to allow members to view their assigned nurses' profiles
-- Ensure RLS is enabled (harmless if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing assigned nurse profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Members can view assigned nurse profiles'
  ) THEN
    CREATE POLICY "Members can view assigned nurse profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.nurse_assignments na
        JOIN public.members m ON m.id = na.member_id
        WHERE na.nurse_id = profiles.id
          AND m.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 3) Profiles policy to allow users to view profiles of participants in their messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view profiles in their messages'
  ) THEN
    CREATE POLICY "Users can view profiles in their messages"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.care_messages cm
        WHERE (cm.sender_id = profiles.id OR cm.recipient_id = profiles.id)
          AND (cm.sender_id = auth.uid() OR cm.recipient_id = auth.uid())
      )
    );
  END IF;
END $$;

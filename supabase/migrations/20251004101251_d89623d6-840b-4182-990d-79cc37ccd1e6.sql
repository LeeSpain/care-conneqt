-- Add back the role column that was dropped by CASCADE
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS role public.app_role NOT NULL DEFAULT 'member';

-- Update the test user's role
UPDATE public.user_roles SET role = 'member' WHERE user_id = 'c65c83c8-5d92-41fc-b847-5f76957bd57c';
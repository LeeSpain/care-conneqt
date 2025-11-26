-- Add status field to profiles table for user status management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'deactivated'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Add invitation tracking fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS invited_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS invitation_token text UNIQUE;
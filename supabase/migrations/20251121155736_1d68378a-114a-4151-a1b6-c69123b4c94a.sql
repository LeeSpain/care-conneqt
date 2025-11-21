-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Facility staff can view facility colleagues" ON public.facility_staff;

-- Create security definer function to get user's facility_id
CREATE OR REPLACE FUNCTION public.get_user_facility_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT facility_id 
  FROM public.facility_staff 
  WHERE user_id = _user_id 
  LIMIT 1;
$$;

-- Recreate policy using the security definer function
CREATE POLICY "Facility staff can view facility colleagues"
ON public.facility_staff
FOR SELECT
TO authenticated
USING (
  facility_id = public.get_user_facility_id(auth.uid())
);
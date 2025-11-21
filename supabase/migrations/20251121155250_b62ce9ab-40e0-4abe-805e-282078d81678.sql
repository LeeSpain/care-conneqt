-- Add RLS policies for facility staff to access their own records and facility data

-- Allow facility staff to view their own staff record
CREATE POLICY "Facility staff can view own record"
ON public.facility_staff
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow facility staff to view other staff in their facility
CREATE POLICY "Facility staff can view facility colleagues"
ON public.facility_staff
FOR SELECT
TO authenticated
USING (
  facility_id IN (
    SELECT facility_id 
    FROM public.facility_staff 
    WHERE user_id = auth.uid()
  )
);

-- Allow facility staff to view their facility details
CREATE POLICY "Facility staff can view own facility"
ON public.facilities
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT facility_id 
    FROM public.facility_staff 
    WHERE user_id = auth.uid()
  )
);

-- Allow facility staff to view residents in their facility
CREATE POLICY "Facility staff can view facility residents"
ON public.facility_residents
FOR SELECT
TO authenticated
USING (
  facility_id IN (
    SELECT facility_id 
    FROM public.facility_staff 
    WHERE user_id = auth.uid()
  )
);
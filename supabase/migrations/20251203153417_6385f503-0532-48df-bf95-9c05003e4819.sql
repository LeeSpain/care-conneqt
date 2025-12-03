-- Add complete demo data to Test Care Facility
-- Facility ID: fad8ab7e-a375-483d-9f8e-1d087f87973c

-- Step 1: Create member records for existing profiles that don't have members
INSERT INTO public.members (id, user_id, date_of_birth, emergency_contact_name, emergency_contact_phone, medical_conditions, medications, mobility_level, care_level, subscription_status)
VALUES 
  (gen_random_uuid(), 'aaaaaaaa-bbbb-cccc-dddd-111111111111', '1945-03-15', 'John Johnson', '+31 6 12345001', ARRAY['Hypertension', 'Arthritis'], ARRAY['Lisinopril 10mg', 'Ibuprofen 400mg'], 'assisted', 'standard', 'active'),
  (gen_random_uuid(), 'fdd838e7-2e78-4ecb-a1f9-3eb33e40cc10', '1942-07-22', 'Anna Van Bree', '+31 6 12345002', ARRAY['Diabetes Type 2', 'Heart Disease'], ARRAY['Metformin 500mg', 'Aspirin 100mg'], 'wheelchair', 'intensive', 'active'),
  (gen_random_uuid(), 'b8e7e781-2058-41e3-bcc3-8ccb5b79d007', '1948-11-08', 'Tom Wakeman', '+31 6 12345003', ARRAY['Dementia (mild)'], ARRAY['Donepezil 5mg'], 'independent', 'standard', 'active'),
  (gen_random_uuid(), 'b119f2a2-d07f-4326-94d5-ee5986843916', '1950-05-30', 'Mary Wakeman', '+31 6 12345004', ARRAY['Osteoporosis'], ARRAY['Calcium supplements', 'Vitamin D'], 'assisted', 'basic', 'active'),
  (gen_random_uuid(), '58a8f70b-511c-43f0-a729-62765016d36b', '1940-09-12', 'Peter Wakeman', '+31 6 12345005', ARRAY['COPD', 'Hypertension'], ARRAY['Salbutamol inhaler', 'Amlodipine 5mg'], 'assisted', 'intensive', 'active')
ON CONFLICT (user_id) DO NOTHING;

-- Step 2: Add facility residents (link members to facility with room assignments)
INSERT INTO public.facility_residents (id, facility_id, member_id, room_number, admission_date)
SELECT 
  gen_random_uuid(),
  'fad8ab7e-a375-483d-9f8e-1d087f87973c',
  m.id,
  room_data.room_number,
  room_data.admission_date::date
FROM public.members m
JOIN (
  VALUES 
    ('aaaaaaaa-bbbb-cccc-dddd-111111111111', '101', '2024-06-15'),
    ('fdd838e7-2e78-4ecb-a1f9-3eb33e40cc10', '102', '2024-08-20'),
    ('b8e7e781-2058-41e3-bcc3-8ccb5b79d007', '103', '2024-09-10'),
    ('b119f2a2-d07f-4326-94d5-ee5986843916', '104', '2024-10-05'),
    ('58a8f70b-511c-43f0-a729-62765016d36b', '105', '2024-11-01')
) AS room_data(user_id, room_number, admission_date) ON m.user_id = room_data.user_id::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM public.facility_residents fr 
  WHERE fr.member_id = m.id AND fr.facility_id = 'fad8ab7e-a375-483d-9f8e-1d087f87973c'
);

-- Step 3: Add additional facility staff
INSERT INTO public.facility_staff (id, facility_id, user_id, staff_role, is_facility_admin, hired_at)
VALUES 
  (gen_random_uuid(), 'fad8ab7e-a375-483d-9f8e-1d087f87973c', 'de60f722-1c4d-4c56-873f-a3dd1da3da13', 'Nurse', false, '2024-01-15'),
  (gen_random_uuid(), 'fad8ab7e-a375-483d-9f8e-1d087f87973c', '3ac7a77b-c5b7-4627-9822-601d739c5340', 'Care Assistant', false, '2024-03-01')
ON CONFLICT DO NOTHING;

-- Step 4: Add devices for each resident (using correct column name: device_serial)
INSERT INTO public.member_devices (id, member_id, device_type, device_name, device_status, battery_level, device_serial, last_sync_at)
SELECT 
  gen_random_uuid(),
  m.id,
  device_data.device_type::device_type,
  device_data.device_name,
  device_data.device_status::device_status,
  device_data.battery_level,
  device_data.device_serial,
  NOW() - (random() * interval '24 hours')
FROM public.members m
JOIN (
  VALUES 
    ('aaaaaaaa-bbbb-cccc-dddd-111111111111', 'vivago_watch', 'Vivago Watch Pro', 'active', 85, 'VW-2024-001'),
    ('aaaaaaaa-bbbb-cccc-dddd-111111111111', 'dosell_dispenser', 'Dosell Medication Dispenser', 'active', 92, 'DS-2024-001'),
    ('fdd838e7-2e78-4ecb-a1f9-3eb33e40cc10', 'vivago_watch', 'Vivago Watch Pro', 'active', 78, 'VW-2024-002'),
    ('fdd838e7-2e78-4ecb-a1f9-3eb33e40cc10', 'heart_monitor', 'Cardiac Monitor Plus', 'active', 95, 'HM-2024-001'),
    ('fdd838e7-2e78-4ecb-a1f9-3eb33e40cc10', 'dosell_dispenser', 'Dosell Medication Dispenser', 'active', 88, 'DS-2024-002'),
    ('b8e7e781-2058-41e3-bcc3-8ccb5b79d007', 'vivago_watch', 'Vivago Watch Pro', 'active', 62, 'VW-2024-003'),
    ('b8e7e781-2058-41e3-bcc3-8ccb5b79d007', 'fall_detector', 'Fall Detection Sensor', 'active', 100, 'FD-2024-001'),
    ('b119f2a2-d07f-4326-94d5-ee5986843916', 'vivago_watch', 'Vivago Watch Pro', 'needs_battery', 15, 'VW-2024-004'),
    ('b119f2a2-d07f-4326-94d5-ee5986843916', 'dosell_dispenser', 'Dosell Medication Dispenser', 'active', 80, 'DS-2024-003'),
    ('58a8f70b-511c-43f0-a729-62765016d36b', 'vivago_watch', 'Vivago Watch Pro', 'active', 70, 'VW-2024-005'),
    ('58a8f70b-511c-43f0-a729-62765016d36b', 'heart_monitor', 'Cardiac Monitor Plus', 'active', 90, 'HM-2024-002'),
    ('58a8f70b-511c-43f0-a729-62765016d36b', 'dosell_dispenser', 'Dosell Medication Dispenser', 'error', 45, 'DS-2024-004')
) AS device_data(user_id, device_type, device_name, device_status, battery_level, device_serial) 
ON m.user_id = device_data.user_id::uuid
WHERE NOT EXISTS (
  SELECT 1 FROM public.member_devices md 
  WHERE md.member_id = m.id AND md.device_serial = device_data.device_serial
);
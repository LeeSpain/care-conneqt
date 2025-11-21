-- Phase 3: Seed comprehensive test data for all dashboards

-- Insert test nurses
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'nurse'::app_role
FROM auth.users
WHERE email LIKE '%nurse%'
ON CONFLICT DO NOTHING;

-- Insert test facilities
INSERT INTO public.facilities (name, facility_type, license_number, bed_capacity, city, country, email, phone)
VALUES 
  ('Sunshine Care Home', 'Residential Care', 'FCL-2024-001', 50, 'London', 'GB', 'info@sunshinecare.com', '+44-20-7946-0958'),
  ('Green Valley Nursing Home', 'Nursing Care', 'FCL-2024-002', 75, 'Manchester', 'GB', 'contact@greenvalley.com', '+44-161-496-0000'),
  ('Peaceful Meadows', 'Assisted Living', 'FCL-2024-003', 40, 'Birmingham', 'GB', 'hello@peacefulmeadows.com', '+44-121-496-0000')
ON CONFLICT DO NOTHING;

-- Insert test nurse tasks for existing nurses
INSERT INTO public.nurse_tasks (nurse_id, member_id, task_type, title, description, priority, status, due_date)
SELECT 
  ur.user_id,
  m.id,
  CASE (random() * 4)::int
    WHEN 0 THEN 'medication'
    WHEN 1 THEN 'vital_check'
    WHEN 2 THEN 'assessment'
    WHEN 3 THEN 'consultation'
    ELSE 'other'
  END,
  CASE (random() * 5)::int
    WHEN 0 THEN 'Morning medication round'
    WHEN 1 THEN 'Check vital signs'
    WHEN 2 THEN 'Weekly health assessment'
    WHEN 3 THEN 'Family consultation call'
    ELSE 'General care check'
  END,
  'Routine care task - please complete as scheduled',
  CASE (random() * 3)::int
    WHEN 0 THEN 'low'::task_priority
    WHEN 1 THEN 'medium'::task_priority
    ELSE 'high'::task_priority
  END,
  CASE (random() * 2)::int
    WHEN 0 THEN 'pending'::task_status
    ELSE 'in_progress'::task_status
  END,
  now() + (random() * 7 || ' days')::interval
FROM public.user_roles ur
CROSS JOIN LATERAL (
  SELECT m.id
  FROM public.members m
  LIMIT 1
) m
WHERE ur.role = 'nurse'
LIMIT 10
ON CONFLICT DO NOTHING;

-- Insert test alerts for members
INSERT INTO public.alerts (member_id, alert_type, title, description, priority, status)
SELECT 
  m.id,
  CASE (random() * 4)::int
    WHEN 0 THEN 'health'
    WHEN 1 THEN 'medication'
    WHEN 2 THEN 'fall_detection'
    ELSE 'vitals_abnormal'
  END,
  CASE (random() * 4)::int
    WHEN 0 THEN 'Blood pressure reading high'
    WHEN 1 THEN 'Medication missed'
    WHEN 2 THEN 'Fall detected'
    ELSE 'Heart rate abnormal'
  END,
  'Automated alert - please review and take appropriate action',
  CASE (random() * 3)::int
    WHEN 0 THEN 'low'::alert_priority
    WHEN 1 THEN 'medium'::alert_priority
    ELSE 'high'::alert_priority
  END,
  'new'::alert_status
FROM public.members m
LIMIT 5
ON CONFLICT DO NOTHING;

-- Insert test health metrics
INSERT INTO public.health_metrics (member_id, metric_type, metric_value, metric_unit, recorded_at)
SELECT 
  m.id,
  metric_type,
  CASE metric_type
    WHEN 'blood_pressure_systolic' THEN 110 + random() * 40
    WHEN 'blood_pressure_diastolic' THEN 70 + random() * 20
    WHEN 'heart_rate' THEN 60 + random() * 40
    WHEN 'temperature' THEN 36.0 + random() * 2
    WHEN 'weight' THEN 60 + random() * 40
    ELSE 95 + random() * 5
  END,
  CASE metric_type
    WHEN 'blood_pressure_systolic' THEN 'mmHg'
    WHEN 'blood_pressure_diastolic' THEN 'mmHg'
    WHEN 'heart_rate' THEN 'bpm'
    WHEN 'temperature' THEN '°C'
    WHEN 'weight' THEN 'kg'
    ELSE '%'
  END,
  now() - (random() * 24 || ' hours')::interval
FROM public.members m
CROSS JOIN (
  SELECT unnest(ARRAY['blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'temperature', 'weight', 'oxygen']) as metric_type
) metrics
LIMIT 30
ON CONFLICT DO NOTHING;

-- Insert test care messages
INSERT INTO public.care_messages (sender_id, recipient_id, member_id, message, is_read)
SELECT 
  sender.id,
  recipient.id,
  m.id,
  CASE (random() * 4)::int
    WHEN 0 THEN 'Patient doing well today, no concerns'
    WHEN 1 THEN 'Medication administered as scheduled'
    WHEN 2 THEN 'Family visit scheduled for tomorrow'
    ELSE 'Please review latest health metrics'
  END,
  random() > 0.5
FROM public.members m
CROSS JOIN LATERAL (
  SELECT id FROM auth.users ORDER BY random() LIMIT 1
) sender
CROSS JOIN LATERAL (
  SELECT id FROM auth.users WHERE id != sender.id ORDER BY random() LIMIT 1
) recipient
LIMIT 15
ON CONFLICT DO NOTHING;
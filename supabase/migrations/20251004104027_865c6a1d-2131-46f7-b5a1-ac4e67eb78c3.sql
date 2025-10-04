
-- Create a test nurse user via Supabase auth
-- Note: This creates a nurse that can be used for testing

DO $$
DECLARE
  test_nurse_id uuid;
  test_member_id uuid;
BEGIN
  -- Get the member ID for the test user
  SELECT id INTO test_member_id FROM members WHERE user_id = 'c65c83c8-5d92-41fc-b847-5f76957bd57c';
  
  -- For demo purposes, we'll create a mock nurse profile
  -- In production, this would be done through proper auth signup
  
  -- Insert a mock nurse into auth.users (using admin privileges)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-bbbb-cccc-dddd-111111111111',
    'authenticated',
    'authenticated',
    'nurse.sarah@careconneqt.com',
    crypt('TestNurse123!', gen_salt('bf')),
    now(),
    '{"first_name":"Sarah","last_name":"Johnson"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (id) DO NOTHING;
  
  test_nurse_id := 'aaaaaaaa-bbbb-cccc-dddd-111111111111';
  
  -- Create profile for nurse
  INSERT INTO profiles (id, email, first_name, last_name, phone, avatar_url)
  VALUES (
    test_nurse_id,
    'nurse.sarah@careconneqt.com',
    'Sarah',
    'Johnson',
    '+44 20 1234 5678',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  ) ON CONFLICT (id) DO NOTHING;
  
  -- Assign nurse role
  INSERT INTO user_roles (user_id, role)
  VALUES (test_nurse_id, 'nurse')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create nurse assignment
  INSERT INTO nurse_assignments (nurse_id, member_id, is_primary, notes)
  VALUES (
    test_nurse_id,
    test_member_id,
    true,
    'Sarah is your primary care nurse with 10+ years of experience in elderly care. She specializes in chronic condition management and is available Mon-Fri 9am-5pm.'
  ) ON CONFLICT DO NOTHING;
  
END $$;

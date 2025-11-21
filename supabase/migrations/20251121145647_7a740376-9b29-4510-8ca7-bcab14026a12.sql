-- Create test user profiles and roles
-- Note: Users must sign up through the UI first, this just ensures proper role assignment and data

-- Function to create test data (will be idempotent)
DO $$
DECLARE
  admin_user_id UUID;
  facility_admin_user_id UUID;
  nurse_user_id UUID;
  family_carer_user_id UUID;
  member_user_id UUID;
  test_facility_id UUID;
  test_member_id UUID;
BEGIN
  -- Check if admin profile exists, if so get the user_id
  SELECT id INTO admin_user_id FROM profiles WHERE email = 'admin@test.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Ensure admin role exists
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (admin_user_id, 'admin', admin_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  -- Check if facility admin profile exists
  SELECT id INTO facility_admin_user_id FROM profiles WHERE email = 'facility@test.com';
  
  IF facility_admin_user_id IS NOT NULL THEN
    -- Ensure facility_admin role exists
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (facility_admin_user_id, 'facility_admin', facility_admin_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create a test facility if it doesn't exist
    INSERT INTO facilities (name, facility_type, bed_capacity, license_number, subscription_status)
    VALUES ('Test Care Facility', 'Residential Care', 50, 'TEST-FAC-001', 'active')
    ON CONFLICT DO NOTHING
    RETURNING id INTO test_facility_id;

    -- Get facility ID if it already exists
    IF test_facility_id IS NULL THEN
      SELECT id INTO test_facility_id FROM facilities WHERE license_number = 'TEST-FAC-001';
    END IF;

    -- Link facility admin to facility
    IF test_facility_id IS NOT NULL THEN
      INSERT INTO facility_staff (facility_id, user_id, staff_role, is_facility_admin)
      VALUES (test_facility_id, facility_admin_user_id, 'Administrator', true)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Check if nurse profile exists
  SELECT id INTO nurse_user_id FROM profiles WHERE email = 'nurse@test.com';
  
  IF nurse_user_id IS NOT NULL THEN
    -- Ensure nurse role exists
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (nurse_user_id, 'nurse', nurse_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  -- Check if family carer profile exists
  SELECT id INTO family_carer_user_id FROM profiles WHERE email = 'family@test.com';
  
  IF family_carer_user_id IS NOT NULL THEN
    -- Ensure family_carer role exists
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (family_carer_user_id, 'family_carer', family_carer_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create family_carers record
    INSERT INTO family_carers (user_id, relationship_to_member, is_primary_contact, can_view_medical, can_receive_alerts)
    VALUES (family_carer_user_id, 'Son/Daughter', true, true, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Check if member profile exists
  SELECT id INTO member_user_id FROM profiles WHERE email = 'member@test.com';
  
  IF member_user_id IS NOT NULL THEN
    -- Ensure member role exists
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (member_user_id, 'member', member_user_id)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create members record
    INSERT INTO members (user_id, care_level, mobility_level, subscription_status)
    VALUES (member_user_id, 'Standard Care', 'Independent', 'active')
    ON CONFLICT DO NOTHING
    RETURNING id INTO test_member_id;

    -- Get member ID if it already exists
    IF test_member_id IS NULL THEN
      SELECT id INTO test_member_id FROM members WHERE user_id = member_user_id;
    END IF;

    -- Link nurse to member if both exist
    IF nurse_user_id IS NOT NULL AND test_member_id IS NOT NULL THEN
      INSERT INTO nurse_assignments (nurse_id, member_id, is_primary)
      VALUES (nurse_user_id, test_member_id, true)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Link family carer to member if both exist
    IF family_carer_user_id IS NOT NULL AND test_member_id IS NOT NULL THEN
      DECLARE
        carer_id UUID;
      BEGIN
        SELECT id INTO carer_id FROM family_carers WHERE user_id = family_carer_user_id;
        
        IF carer_id IS NOT NULL THEN
          INSERT INTO member_carers (member_id, carer_id, accepted_at)
          VALUES (test_member_id, carer_id, now())
          ON CONFLICT DO NOTHING;
        END IF;
      END;
    END IF;
  END IF;

END $$;

-- Create a helper comment
COMMENT ON TABLE user_roles IS 'Test accounts setup: admin@test.com (admin), facility@test.com (facility_admin), nurse@test.com (nurse), family@test.com (family_carer), member@test.com (member). All passwords: [Role]123! - Users must sign up through UI first.';
-- Update the test nurse profile with proper phone and avatar
UPDATE profiles 
SET 
  phone = '+44 20 1234 5678',
  avatar_url = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-111111111111';
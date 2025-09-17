-- Fix the specific profile cacod49083@merumart.com to have correct user_type
-- Execute this in Supabase SQL Editor

-- Update the specific profile to scolaire-privee
UPDATE profiles 
SET user_type = 'scolaire-privee',
    professional_type = 'scolaire-privee'
WHERE email = 'cacod49083@merumart.com';

-- Verify the update
SELECT 
  email,
  user_type,
  professional_type,
  admin_role,
  verification_status,
  is_verified,
  updated_at
FROM profiles 
WHERE email = 'cacod49083@merumart.com';

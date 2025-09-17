-- Debug the specific profile cacod49083@merumart.com
-- Execute this in Supabase SQL Editor

-- Check the specific profile data
SELECT 
  email,
  user_type,
  professional_type,
  admin_role,
  verification_status,
  is_verified,
  school_id,
  association_id,
  created_at,
  updated_at
FROM profiles 
WHERE email = 'cacod49083@merumart.com';

-- Check if there are any other profiles with similar email pattern
SELECT 
  email,
  user_type,
  professional_type,
  admin_role,
  verification_status,
  is_verified,
  created_at
FROM profiles 
WHERE email LIKE '%cacod%' OR email LIKE '%merumart%'
ORDER BY created_at DESC;

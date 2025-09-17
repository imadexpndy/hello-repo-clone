-- Debug your specific profile to see what's stored in the database
-- Execute this in Supabase SQL Editor

-- Check your specific profile data
SELECT 
  email,
  user_type,
  professional_type,
  admin_role,
  verification_status,
  is_verified,
  school_id,
  association_id,
  created_at
FROM profiles 
WHERE email LIKE '%raselstoreatt%' OR email LIKE '%privateschool%' OR email LIKE '%private%'
ORDER BY created_at DESC;

-- Check all recent profiles to see the pattern
SELECT 
  email,
  user_type,
  professional_type,
  admin_role,
  verification_status,
  is_verified,
  created_at
FROM profiles 
WHERE created_at > '2025-09-12'
ORDER BY created_at DESC;

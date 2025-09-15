-- Fix the specific user profile for raselstoreatt@gmail.com
-- This user registered as a private school but is showing as particulier

-- First, let's see the current state of this user
SELECT 
  email, 
  user_type, 
  professional_type, 
  admin_role, 
  school_id, 
  association_id,
  verification_status,
  is_verified
FROM profiles 
WHERE email = 'raselstoreatt@gmail.com';

-- Update the user to have correct user_type and professional_type
UPDATE profiles 
SET 
  user_type = 'teacher_private',
  professional_type = 'scolaire-privee',
  verification_status = 'approved',
  is_verified = true
WHERE email = 'raselstoreatt@gmail.com' 
  AND school_id IS NOT NULL;

-- Verify the update
SELECT 
  email, 
  user_type, 
  professional_type, 
  admin_role, 
  school_id, 
  verification_status,
  is_verified
FROM profiles 
WHERE email = 'raselstoreatt@gmail.com';

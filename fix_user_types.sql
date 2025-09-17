-- Fix user types mapping in profiles table
-- Execute this in Supabase SQL Editor

-- Update user types to match the expected format in AdminUsers component
UPDATE profiles 
SET user_type = CASE 
  WHEN user_type = 'teacher_private' THEN 'scolaire-privee'
  WHEN user_type = 'teacher_public' THEN 'scolaire-publique'
  WHEN user_type = 'b2c' THEN 'particulier'
  WHEN user_type = 'association' THEN 'association'
  WHEN user_type IS NULL OR user_type = '' THEN 'particulier'
  ELSE user_type
END;

-- Also update any profiles that might have been created with the wrong default
UPDATE profiles 
SET user_type = 'particulier'
WHERE user_type IS NULL OR user_type = '';

-- Check the results
SELECT user_type, COUNT(*) as count 
FROM profiles 
GROUP BY user_type 
ORDER BY count DESC;

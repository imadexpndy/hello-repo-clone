-- Fix user_type constraint to allow the correct display values
-- Execute this in Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Add new constraint with the correct values that AdminUsers expects
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('particulier', 'scolaire-privee', 'scolaire-publique', 'association'));

-- Now update the user types to the correct display values
UPDATE profiles 
SET user_type = CASE 
  WHEN user_type = 'teacher_private' THEN 'scolaire-privee'
  WHEN user_type = 'teacher_public' THEN 'scolaire-publique'
  WHEN user_type = 'b2c' THEN 'particulier'
  WHEN user_type = 'association' THEN 'association'
  WHEN user_type IS NULL OR user_type = '' THEN 'particulier'
  ELSE user_type
END;

-- Also update any remaining NULL values
UPDATE profiles 
SET user_type = 'particulier'
WHERE user_type IS NULL OR user_type = '';

-- Check the results
SELECT user_type, COUNT(*) as count 
FROM profiles 
GROUP BY user_type 
ORDER BY count DESC;

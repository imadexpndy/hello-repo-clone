-- Fix user_type constraint safely by updating data first
-- Execute this in Supabase SQL Editor

-- Step 1: Drop the existing constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Step 2: Update all existing data to use correct values BEFORE adding constraint
UPDATE profiles 
SET user_type = CASE 
  WHEN user_type = 'teacher_private' THEN 'scolaire-privee'
  WHEN user_type = 'teacher_public' THEN 'scolaire-publique'
  WHEN user_type = 'b2c' THEN 'particulier'
  WHEN user_type = 'association' THEN 'association'
  WHEN user_type IS NULL OR user_type = '' THEN 'particulier'
  ELSE user_type
END;

-- Step 3: Handle any remaining NULL values
UPDATE profiles 
SET user_type = 'particulier'
WHERE user_type IS NULL OR user_type = '';

-- Step 4: Check what values exist before adding constraint
SELECT DISTINCT user_type, COUNT(*) 
FROM profiles 
GROUP BY user_type 
ORDER BY user_type;

-- Step 5: Now add the constraint (only after data is clean)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('particulier', 'scolaire-privee', 'scolaire-publique', 'association'));

-- Step 6: Final verification
SELECT user_type, COUNT(*) as count 
FROM profiles 
GROUP BY user_type 
ORDER BY count DESC;

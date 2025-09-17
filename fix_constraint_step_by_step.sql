-- Fix user_type constraint step by step
-- Execute each section separately in Supabase SQL Editor

-- STEP 1: First, let's see what values currently exist
SELECT DISTINCT user_type, COUNT(*) as count
FROM profiles 
GROUP BY user_type 
ORDER BY user_type;

-- STEP 2: Drop the existing constraint (run this first)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- STEP 3: Clean up the data (run this after step 2)
UPDATE profiles 
SET user_type = 'particulier'
WHERE user_type IS NULL OR user_type = '' OR user_type NOT IN ('teacher_private', 'teacher_public', 'association', 'b2c', 'particulier');

-- STEP 4: Convert to display values (run this after step 3)
UPDATE profiles 
SET user_type = CASE 
  WHEN user_type = 'teacher_private' THEN 'scolaire-privee'
  WHEN user_type = 'teacher_public' THEN 'scolaire-publique'
  WHEN user_type = 'b2c' THEN 'particulier'
  WHEN user_type = 'association' THEN 'association'
  ELSE 'particulier'
END;

-- STEP 5: Verify data is clean (run this after step 4)
SELECT DISTINCT user_type, COUNT(*) as count
FROM profiles 
GROUP BY user_type 
ORDER BY user_type;

-- STEP 6: Add the new constraint (run this last, only if step 5 shows clean data)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('particulier', 'scolaire-privee', 'scolaire-publique', 'association'));

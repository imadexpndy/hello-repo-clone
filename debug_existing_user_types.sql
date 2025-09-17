-- Debug what user_type values currently exist in the database
-- Execute this in Supabase SQL Editor to see what's causing the constraint violation

-- Check all distinct user_type values currently in the table
SELECT DISTINCT user_type, COUNT(*) as count
FROM profiles 
GROUP BY user_type 
ORDER BY user_type;

-- Check for any unusual or unexpected values
SELECT user_type, email, created_at
FROM profiles 
WHERE user_type NOT IN ('particulier', 'teacher_private', 'teacher_public', 'association', 'b2c')
   OR user_type IS NULL
ORDER BY created_at DESC
LIMIT 10;

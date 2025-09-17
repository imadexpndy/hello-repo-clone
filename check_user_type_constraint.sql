-- Check the current user_type constraint and fix it
-- Execute this in Supabase SQL Editor

-- First, let's see what the current constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname LIKE '%user_type%';

-- Check what user_type enum values exist
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
  SELECT oid 
  FROM pg_type 
  WHERE typname = 'user_type'
);

-- Check current user_type values in the table
SELECT DISTINCT user_type, COUNT(*) 
FROM profiles 
WHERE user_type IS NOT NULL 
GROUP BY user_type;

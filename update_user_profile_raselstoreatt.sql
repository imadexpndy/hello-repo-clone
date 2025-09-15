-- Update the specific user profile for raselstoreatt@gmail.com
-- This user registered as a private school but is showing as particulier

-- First, check if the user_type and professional_type columns exist
-- If they don't exist, we need to add them first

-- Add the columns if they don't exist (this should be done via migration)
-- ALTER TABLE public.profiles 
-- ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('particulier', 'teacher_private', 'teacher_public', 'association'));
-- ALTER TABLE public.profiles 
-- ADD COLUMN IF NOT EXISTS professional_type TEXT CHECK (professional_type IN ('scolaire-privee', 'scolaire-publique', 'association'));

-- Update the specific user to have correct user_type and professional_type
UPDATE public.profiles 
SET 
  user_type = 'teacher_private',
  professional_type = 'scolaire-privee',
  verification_status = 'approved',
  is_verified = true
WHERE email = 'raselstoreatt@gmail.com';

-- Verify the update worked
SELECT 
  email, 
  user_type, 
  professional_type, 
  admin_role, 
  school_id, 
  verification_status,
  is_verified,
  created_at
FROM public.profiles 
WHERE email = 'raselstoreatt@gmail.com';

-- Add user_type column to profiles table to properly store user registration type
-- This fixes the issue where private school users appear as particulier

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('particulier', 'teacher_private', 'teacher_public', 'association'));

-- Add professional_type column to store the specific professional type
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS professional_type TEXT CHECK (professional_type IN ('scolaire-privee', 'scolaire-publique', 'association'));

-- Update existing profiles based on their admin_role and school/association associations
-- Private school users (those with school_id and admin_role indicating professional use)
UPDATE public.profiles 
SET user_type = 'teacher_private',
    professional_type = 'scolaire-privee'
WHERE school_id IS NOT NULL 
  AND (admin_role IS NOT NULL OR verification_status = 'approved');

-- Public school users (those with school_id but different verification pattern)
UPDATE public.profiles 
SET user_type = 'teacher_public',
    professional_type = 'scolaire-publique'
WHERE school_id IS NOT NULL 
  AND user_type IS NULL
  AND verification_status = 'pending';

-- Association users
UPDATE public.profiles 
SET user_type = 'association',
    professional_type = 'association'
WHERE association_id IS NOT NULL;√

-- Particulier users (everyone else)
UPDATE public.profiles 
SET user_type = 'particulier'
WHERE user_type IS NULL 
  AND school_id IS NULL 
  AND association_id IS NULL;

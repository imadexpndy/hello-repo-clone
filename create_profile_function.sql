-- Create a function to fetch profile with user_type columns
-- This bypasses TypeScript schema caching issues

CREATE OR REPLACE FUNCTION get_profile_with_user_type(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  admin_role TEXT,
  school_id UUID,
  association_id UUID,
  verification_status TEXT,
  is_verified BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  organization_id UUID,
  user_type TEXT,
  professional_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.whatsapp,
    p.admin_role,
    p.school_id,
    p.association_id,
    p.verification_status,
    p.is_verified,
    p.created_at,
    p.updated_at,
    p.organization_id,
    p.user_type,
    p.professional_type
  FROM public.profiles p
  WHERE p.user_id = p_user_id;
END;
$$;

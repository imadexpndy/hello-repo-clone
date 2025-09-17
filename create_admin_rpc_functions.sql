-- Create RPC functions to handle admin operations
-- Execute this in Supabase SQL Editor

-- Function to get admin roles
CREATE OR REPLACE FUNCTION get_admin_roles()
RETURNS TABLE (
  id uuid,
  name text,
  display_name text,
  permissions text[],
  is_system_role boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    name,
    display_name,
    permissions,
    is_system_role,
    created_at,
    updated_at
  FROM admin_roles
  ORDER BY name;
$$;

-- Function to get user permissions with roles
CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS TABLE (
  user_id uuid,
  role_id uuid,
  custom_permissions text[],
  role_name text,
  role_display_name text,
  role_permissions text[]
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    aup.user_id,
    aup.role_id,
    aup.custom_permissions,
    ar.name as role_name,
    ar.display_name as role_display_name,
    ar.permissions as role_permissions
  FROM admin_user_permissions aup
  LEFT JOIN admin_roles ar ON aup.role_id = ar.id;
$$;

-- Function to update user permissions
CREATE OR REPLACE FUNCTION update_user_permissions(
  p_user_id uuid,
  p_role_id uuid DEFAULT NULL,
  p_custom_permissions text[] DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Upsert user permissions
  INSERT INTO admin_user_permissions (user_id, role_id, custom_permissions)
  VALUES (p_user_id, p_role_id, p_custom_permissions)
  ON CONFLICT (user_id)
  DO UPDATE SET
    role_id = EXCLUDED.role_id,
    custom_permissions = EXCLUDED.custom_permissions,
    updated_at = NOW();

  -- Return success
  SELECT json_build_object('success', true) INTO result;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object('success', false, 'error', SQLERRM) INTO result;
    RETURN result;
END;
$$;

-- Function to create admin permissions entry
CREATE OR REPLACE FUNCTION create_admin_permissions(
  p_role_id uuid DEFAULT NULL,
  p_custom_permissions text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  role_id uuid,
  custom_permissions text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO admin_user_permissions (role_id, custom_permissions)
  VALUES (p_role_id, p_custom_permissions)
  RETURNING admin_user_permissions.id INTO new_id;

  RETURN QUERY
  SELECT 
    aup.id,
    aup.role_id,
    aup.custom_permissions
  FROM admin_user_permissions aup
  WHERE aup.id = new_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_admin_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_permissions(uuid, uuid, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_permissions(uuid, text[]) TO authenticated;

-- Fix profiles RLS policies to allow frontend access
-- Execute this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON profiles;
DROP POLICY IF EXISTS "Allow supabase_auth_admin full access" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON profiles;

-- Create new policies that allow proper access
CREATE POLICY "Enable read access for all users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Also fix admin_roles policies
DROP POLICY IF EXISTS "Authenticated users can read roles" ON admin_roles;
CREATE POLICY "Enable read access for admin roles" ON admin_roles
  FOR SELECT USING (true);

-- Fix admin_user_permissions policies  
DROP POLICY IF EXISTS "Users can read own permissions" ON admin_user_permissions;
CREATE POLICY "Enable read access for admin permissions" ON admin_user_permissions
  FOR SELECT USING (true);

-- Verify the fix
SELECT 'Profiles accessible:' as info, count(*) as count FROM profiles
UNION ALL
SELECT 'Admin roles accessible:' as info, count(*) as count FROM admin_roles;

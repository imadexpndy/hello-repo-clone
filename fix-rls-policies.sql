-- Fix RLS policies to allow admin_roles and profiles insertion
-- Execute this in Supabase SQL Editor

-- 1. Temporarily disable RLS on admin_roles to insert the predefined roles
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;

-- 2. Insert the predefined admin roles
INSERT INTO admin_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Super Administrateur', 'Accès complet', ARRAY['super_admin']::admin_permission[], true),
('admin_full', 'Administrateur Complet', 'Toutes fonctionnalités', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'bookings_read', 'bookings_write', 'users_read', 'users_write', 'organizations_read', 'organizations_write', 'communications_read', 'communications_write', 'audit_read', 'analytics_read', 'registrations_read', 'registrations_write', 'settings_read', 'settings_write']::admin_permission[], true),
('admin_spectacles', 'Gestionnaire Spectacles', 'Spectacles uniquement', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'analytics_read']::admin_permission[], true),
('admin_bookings', 'Gestionnaire Réservations', 'Réservations uniquement', ARRAY['bookings_read', 'bookings_write', 'organizations_read', 'organizations_write', 'analytics_read']::admin_permission[], true)
ON CONFLICT (name) DO NOTHING;

-- 3. Re-enable RLS on admin_roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 4. Fix profiles RLS policies to allow service role and auth admin to insert
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow auth trigger to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow service role to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create comprehensive RLS policies for profiles
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Allow service role full access" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow supabase_auth_admin full access" ON profiles
  FOR ALL TO supabase_auth_admin USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 5. Temporarily disable RLS on profiles to create missing profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 6. Execute the function to create profiles for existing auth users
SELECT public.create_missing_profiles();

-- 7. Re-enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. Verify the results
SELECT 'Admin Roles Created:' as info, count(*) as count FROM admin_roles
UNION ALL
SELECT 'Profiles Created:' as info, count(*) as count FROM profiles;

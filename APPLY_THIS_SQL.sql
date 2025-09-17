-- COPY AND PASTE THIS ENTIRE SQL INTO SUPABASE DASHBOARD SQL EDITOR
-- COMPLETE FIX: Profile creation + Admin system
-- Execute this entire script in Supabase SQL Editor

-- 1. Fix profile creation trigger first
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    admin_role,
    user_type,
    full_name,
    verification_status,
    is_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULL,
    'particulier',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'approved',
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add RLS policies for profile creation
DROP POLICY IF EXISTS "Allow auth trigger to insert profiles" ON public.profiles;
CREATE POLICY "Allow auth trigger to insert profiles"
ON public.profiles
FOR INSERT
TO supabase_auth_admin
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role to insert profiles" ON public.profiles;
CREATE POLICY "Allow service role to insert profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- 4. Create profiles for existing auth users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN 
    SELECT id, email, created_at, raw_user_meta_data
    FROM auth.users 
    WHERE id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL)
  LOOP
    INSERT INTO public.profiles (
      user_id, email, admin_role, user_type, full_name,
      verification_status, is_verified, created_at, updated_at
    ) VALUES (
      auth_user.id, auth_user.email, NULL, 'particulier',
      COALESCE(auth_user.raw_user_meta_data->>'full_name', auth_user.email),
      'approved', true, auth_user.created_at, NOW()
    );
  END LOOP;
  RAISE NOTICE 'Created profiles for existing auth users';
END;
$$;

-- 5. Execute the function to create missing profiles
SELECT public.create_missing_profiles();

-- 6. Now set up admin system
DROP TABLE IF EXISTS admin_user_permissions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TYPE IF EXISTS admin_permission CASCADE;

CREATE TYPE admin_permission AS ENUM (
  'spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write',
  'bookings_read', 'bookings_write', 'users_read', 'users_write',
  'organizations_read', 'organizations_write', 'communications_read', 
  'communications_write', 'audit_read', 'analytics_read',
  'registrations_read', 'registrations_write', 'settings_read', 
  'settings_write', 'super_admin'
);

CREATE TABLE admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions admin_permission[] NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  custom_permissions admin_permission[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 7. Insert admin roles
INSERT INTO admin_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Super Administrateur', 'Accès complet', ARRAY['super_admin']::admin_permission[], true),
('admin_full', 'Administrateur Complet', 'Toutes fonctionnalités', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'bookings_read', 'bookings_write', 'users_read', 'users_write', 'organizations_read', 'organizations_write', 'communications_read', 'communications_write', 'audit_read', 'analytics_read', 'registrations_read', 'registrations_write', 'settings_read', 'settings_write']::admin_permission[], true),
('admin_spectacles', 'Gestionnaire Spectacles', 'Spectacles uniquement', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'analytics_read']::admin_permission[], true),
('admin_bookings', 'Gestionnaire Réservations', 'Réservations uniquement', ARRAY['bookings_read', 'bookings_write', 'organizations_read', 'organizations_write', 'analytics_read']::admin_permission[], true);

-- 8. Enable RLS and create policies
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read roles" ON admin_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can read own permissions" ON admin_user_permissions FOR SELECT USING (user_id = auth.uid());

-- 9. Create indexes
CREATE INDEX idx_admin_user_permissions_user_id ON admin_user_permissions(user_id);
CREATE INDEX idx_admin_user_permissions_role_id ON admin_user_permissions(role_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_admin_roles_updated_at 
  BEFORE UPDATE ON admin_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_user_permissions_updated_at 
  BEFORE UPDATE ON admin_user_permissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

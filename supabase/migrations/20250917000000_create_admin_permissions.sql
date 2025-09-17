-- Create admin permissions system
-- This allows granular control over what admin users can access

-- Create enum for admin permissions
CREATE TYPE admin_permission AS ENUM (
  'spectacles_read',
  'spectacles_write',
  'sessions_read', 
  'sessions_write',
  'bookings_read',
  'bookings_write',
  'users_read',
  'users_write',
  'organizations_read',
  'organizations_write',
  'communications_read',
  'communications_write',
  'audit_read',
  'analytics_read',
  'registrations_read',
  'registrations_write',
  'settings_read',
  'settings_write',
  'super_admin'
);

-- Create admin_roles table to define role templates
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

-- Create admin_user_permissions table for custom permissions per user
CREATE TABLE admin_user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  custom_permissions admin_permission[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert predefined admin roles
INSERT INTO admin_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Super Administrateur', 'Accès complet à toutes les fonctionnalités', 
 ARRAY['super_admin']::admin_permission[], true),

('admin_full', 'Administrateur Complet', 'Accès à toutes les fonctionnalités sauf gestion des super admins',
 ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'bookings_read', 'bookings_write', 
       'users_read', 'users_write', 'organizations_read', 'organizations_write', 'communications_read', 'communications_write',
       'audit_read', 'analytics_read', 'registrations_read', 'registrations_write', 'settings_read', 'settings_write']::admin_permission[], true),

('admin_spectacles', 'Gestionnaire de Spectacles', 'Gestion des spectacles et sessions uniquement',
 ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'analytics_read']::admin_permission[], true),

('admin_bookings', 'Gestionnaire de Réservations', 'Gestion des réservations et organisations',
 ARRAY['bookings_read', 'bookings_write', 'organizations_read', 'organizations_write', 'analytics_read']::admin_permission[], true),

('admin_schools', 'Gestionnaire d\'Écoles', 'Gestion des inscriptions et organisations scolaires',
 ARRAY['registrations_read', 'registrations_write', 'organizations_read', 'organizations_write', 'users_read']::admin_permission[], true),

('admin_support', 'Support', 'Accès en lecture à la plupart des données pour le support client',
 ARRAY['spectacles_read', 'sessions_read', 'bookings_read', 'users_read', 'organizations_read', 'audit_read']::admin_permission[], true),

('admin_analytics', 'Analyste', 'Accès aux statistiques et données analytiques',
 ARRAY['spectacles_read', 'sessions_read', 'bookings_read', 'organizations_read', 'analytics_read', 'audit_read']::admin_permission[], true),

('admin_communications', 'Gestionnaire de Communications', 'Gestion des communications et notifications',
 ARRAY['communications_read', 'communications_write', 'users_read', 'organizations_read']::admin_permission[], true);

-- Create RLS policies
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user_permissions ENABLE ROW LEVEL SECURITY;

-- Super admins can see and manage all roles
CREATE POLICY "Super admins can manage all roles" ON admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_user_permissions aup
      WHERE aup.user_id = auth.uid()
      AND ('super_admin' = ANY(aup.custom_permissions) OR 
           EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.id = aup.role_id AND 'super_admin' = ANY(ar.permissions)))
    )
  );

-- All authenticated users can read role definitions (for UI purposes)
CREATE POLICY "Authenticated users can read roles" ON admin_roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Super admins can manage all user permissions
CREATE POLICY "Super admins can manage user permissions" ON admin_user_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_user_permissions aup
      WHERE aup.user_id = auth.uid()
      AND ('super_admin' = ANY(aup.custom_permissions) OR 
           EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.id = aup.role_id AND 'super_admin' = ANY(ar.permissions)))
    )
  );

-- Users can read their own permissions
CREATE POLICY "Users can read own permissions" ON admin_user_permissions
  FOR SELECT USING (user_id = auth.uid());

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION has_admin_permission(user_uuid UUID, permission_name admin_permission)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions admin_permission[];
  role_permissions admin_permission[];
BEGIN
  -- Get user's custom permissions and role permissions
  SELECT 
    COALESCE(aup.custom_permissions, '{}'),
    COALESCE(ar.permissions, '{}')
  INTO user_permissions, role_permissions
  FROM admin_user_permissions aup
  LEFT JOIN admin_roles ar ON ar.id = aup.role_id
  WHERE aup.user_id = user_uuid;
  
  -- Check if user has super_admin permission (grants everything)
  IF 'super_admin' = ANY(user_permissions) OR 'super_admin' = ANY(role_permissions) THEN
    RETURN true;
  END IF;
  
  -- Check if user has the specific permission
  RETURN permission_name = ANY(user_permissions) OR permission_name = ANY(role_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's all permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS admin_permission[] AS $$
DECLARE
  user_permissions admin_permission[];
  role_permissions admin_permission[];
  all_permissions admin_permission[];
BEGIN
  -- Get user's custom permissions and role permissions
  SELECT 
    COALESCE(aup.custom_permissions, '{}'),
    COALESCE(ar.permissions, '{}')
  INTO user_permissions, role_permissions
  FROM admin_user_permissions aup
  LEFT JOIN admin_roles ar ON ar.id = aup.role_id
  WHERE aup.user_id = user_uuid;
  
  -- Combine permissions (custom permissions override role permissions)
  all_permissions := user_permissions || role_permissions;
  
  RETURN all_permissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_admin_user_permissions_user_id ON admin_user_permissions(user_id);
CREATE INDEX idx_admin_user_permissions_role_id ON admin_user_permissions(role_id);

-- Add updated_at trigger for admin_roles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_roles_updated_at 
  BEFORE UPDATE ON admin_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_user_permissions_updated_at 
  BEFORE UPDATE ON admin_user_permissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

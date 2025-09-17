-- Execute this SQL in Supabase Dashboard > SQL Editor
-- Creates the missing admin tables for user management

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

-- Create admin_roles table
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

-- Create admin_user_permissions table
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
 ARRAY['bookings_read', 'bookings_write', 'organizations_read', 'organizations_write', 'analytics_read']::admin_permission[], true);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can read roles" ON admin_roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read own permissions" ON admin_user_permissions
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_admin_user_permissions_user_id ON admin_user_permissions(user_id);
CREATE INDEX idx_admin_user_permissions_role_id ON admin_user_permissions(role_id);

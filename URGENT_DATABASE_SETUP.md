# 🚨 URGENT: Database Setup Required

The AdminUsers page is failing because the admin tables don't exist in your Supabase database.

## Quick Fix (2 minutes):

### 1. Open Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Select project: `aioldzmwwhukzabrizkt`
- Click **SQL Editor** in sidebar

### 2. Copy & Run This SQL
```sql
-- Copy everything below and paste in SQL Editor, then click RUN

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
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  custom_permissions admin_permission[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

INSERT INTO admin_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Super Administrateur', 'Accès complet', ARRAY['super_admin']::admin_permission[], true),
('admin_full', 'Administrateur Complet', 'Toutes fonctionnalités', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'bookings_read', 'bookings_write', 'users_read', 'users_write', 'organizations_read', 'organizations_write', 'communications_read', 'communications_write', 'audit_read', 'analytics_read', 'registrations_read', 'registrations_write', 'settings_read', 'settings_write']::admin_permission[], true),
('admin_spectacles', 'Gestionnaire Spectacles', 'Spectacles uniquement', ARRAY['spectacles_read', 'spectacles_write', 'sessions_read', 'sessions_write', 'analytics_read']::admin_permission[], true),
('admin_bookings', 'Gestionnaire Réservations', 'Réservations uniquement', ARRAY['bookings_read', 'bookings_write', 'organizations_read', 'organizations_write', 'analytics_read']::admin_permission[], true);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read roles" ON admin_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can read own permissions" ON admin_user_permissions FOR SELECT USING (user_id = auth.uid());

CREATE INDEX idx_admin_user_permissions_user_id ON admin_user_permissions(user_id);
CREATE INDEX idx_admin_user_permissions_role_id ON admin_user_permissions(role_id);
```

### 3. Refresh Admin Page
After running the SQL, refresh `/admin/users` - the errors will disappear.

## What This Fixes:
- ❌ `Could not find the table 'public.admin_roles'`
- ❌ `Could not find a relationship between 'profiles' and 'admin_user_permissions'`
- ❌ `Erreur lors du chargement des utilisateurs`

## Result:
- ✅ Admin Users page loads correctly
- ✅ User management interface works
- ✅ Permission system functional
- ✅ Ready for user profile creation fix

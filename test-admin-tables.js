import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminTables() {
  console.log('🔍 Testing admin tables...');
  
  try {
    // Test admin_roles table
    console.log('Testing admin_roles table...');
    const { data: rolesData, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*')
      .limit(5);
    
    if (rolesError) {
      console.error('❌ admin_roles error:', rolesError);
    } else {
      console.log('✅ admin_roles found:', rolesData?.length || 0, 'roles');
      rolesData?.forEach(role => {
        console.log(`  - ${role.name}: ${role.display_name}`);
      });
    }
    
    // Test admin_user_permissions table
    console.log('\nTesting admin_user_permissions table...');
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('admin_user_permissions')
      .select('*')
      .limit(5);
    
    if (permissionsError) {
      console.error('❌ admin_user_permissions error:', permissionsError);
    } else {
      console.log('✅ admin_user_permissions found:', permissionsData?.length || 0, 'permissions');
    }
    
    // Test the exact query that AdminUsers component uses
    console.log('\nTesting AdminUsers component query...');
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select(`
        *,
        admin_user_permissions (
          id,
          role_id,
          custom_permissions,
          admin_roles (
            name,
            display_name,
            permissions
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('❌ AdminUsers query error:', usersError);
    } else {
      console.log('✅ AdminUsers query successful:', usersData?.length || 0, 'users');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminTables();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminUsersQuery() {
  console.log('🔍 Testing exact AdminUsers component query...\n');
  
  try {
    // Test the exact query from AdminUsers component
    console.log('1. Testing AdminUsers fetchUsers query...');
    const { data, error } = await supabase
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
    
    if (error) {
      console.error('❌ AdminUsers query error:', error);
      
      // Check if it's a relationship error
      if (error.code === 'PGRST200') {
        console.log('💡 Foreign key relationship issue detected');
        
        // Test individual tables
        console.log('\n2. Testing profiles table directly...');
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(5);
        
        if (profilesError) {
          console.error('❌ Profiles error:', profilesError);
        } else {
          console.log(`✅ Profiles accessible: ${profiles?.length || 0} found`);
          if (profiles && profiles.length > 0) {
            console.log('Sample profile:', profiles[0]);
          }
        }
        
        console.log('\n3. Testing admin_user_permissions table...');
        const { data: permissions, error: permError } = await supabase
          .from('admin_user_permissions')
          .select('*')
          .limit(5);
        
        if (permError) {
          console.error('❌ Admin permissions error:', permError);
        } else {
          console.log(`✅ Admin permissions accessible: ${permissions?.length || 0} found`);
        }
        
        console.log('\n4. Testing admin_roles table...');
        const { data: roles, error: rolesError } = await supabase
          .from('admin_roles')
          .select('*');
        
        if (rolesError) {
          console.error('❌ Admin roles error:', rolesError);
        } else {
          console.log(`✅ Admin roles accessible: ${roles?.length || 0} found`);
          if (roles && roles.length > 0) {
            roles.forEach(role => console.log(`  - ${role.name}: ${role.display_name}`));
          }
        }
      }
    } else {
      console.log(`✅ AdminUsers query successful: ${data?.length || 0} users found`);
      if (data && data.length > 0) {
        console.log('Sample user:', {
          email: data[0].email,
          user_type: data[0].user_type,
          has_admin_permissions: !!data[0].admin_user_permissions
        });
      }
    }
    
    // Test simplified query without joins
    console.log('\n5. Testing simplified profiles query...');
    const { data: simpleProfiles, error: simpleError } = await supabase
      .from('profiles')
      .select('user_id, email, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (simpleError) {
      console.error('❌ Simple profiles error:', simpleError);
    } else {
      console.log(`✅ Simple profiles query: ${simpleProfiles?.length || 0} users`);
      if (simpleProfiles && simpleProfiles.length > 0) {
        simpleProfiles.forEach(p => console.log(`  - ${p.email} (${p.user_type})`));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminUsersQuery();

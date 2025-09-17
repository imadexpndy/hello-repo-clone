import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseState() {
  console.log('🔍 Testing current database state...');
  
  try {
    // Test 1: Check if admin_roles table has data
    console.log('\n1. Testing admin_roles table...');
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*');
    
    if (rolesError) {
      console.error('❌ admin_roles error:', rolesError);
    } else {
      console.log(`✅ admin_roles found: ${roles?.length || 0} roles`);
      if (roles && roles.length > 0) {
        roles.forEach(role => console.log(`  - ${role.name}: ${role.display_name}`));
      }
    }
    
    // Test 2: Check profiles table
    console.log('\n2. Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ profiles error:', profilesError);
    } else {
      console.log(`✅ profiles found: ${profiles?.length || 0} profiles`);
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => console.log(`  - ${profile.email} (${profile.user_type})`));
      }
    }
    
    // Test 3: Try to create a test profile
    console.log('\n3. Testing profile creation...');
    const testProfile = {
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@admin.com',
      full_name: 'Test Admin',
      user_type: 'particulier',
      verification_status: 'approved',
      is_verified: true
    };
    
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select();
    
    if (insertError) {
      console.error('❌ Profile insertion failed:', insertError);
      console.log('💡 RLS policies may be blocking insertion');
    } else {
      console.log('✅ Test profile created:', newProfile);
    }
    
    // Test 4: Check AdminUsers query
    console.log('\n4. Testing AdminUsers component query...');
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
      console.error('❌ AdminUsers query failed:', usersError);
    } else {
      console.log(`✅ AdminUsers query successful: ${usersData?.length || 0} users`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseState();

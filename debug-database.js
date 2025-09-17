import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugDatabase() {
  console.log('🔍 Debugging database state after SQL execution...\n');
  
  try {
    // Check if admin_roles table exists and has the expected structure
    console.log('1. Testing admin_roles table structure...');
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*')
      .limit(1);
    
    if (rolesError) {
      console.error('❌ admin_roles table error:', rolesError);
      if (rolesError.code === 'PGRST116') {
        console.log('💡 admin_roles table does not exist - SQL may not have executed properly');
      }
    } else {
      console.log('✅ admin_roles table exists');
      
      // Try to count all roles
      const { count, error: countError } = await supabase
        .from('admin_roles')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('❌ Error counting roles:', countError);
      } else {
        console.log(`📊 Total admin roles: ${count}`);
      }
    }
    
    // Check if the enum type exists by trying to insert a test role
    console.log('\n2. Testing admin_permission enum...');
    const testRole = {
      name: 'test_role_debug',
      display_name: 'Test Role',
      permissions: ['users_read'],
      is_system_role: false
    };
    
    const { error: insertError } = await supabase
      .from('admin_roles')
      .insert(testRole);
    
    if (insertError) {
      console.error('❌ Cannot insert test role:', insertError);
      if (insertError.message.includes('enum')) {
        console.log('💡 admin_permission enum may not exist');
      }
    } else {
      console.log('✅ Successfully inserted test role - enum exists');
      
      // Clean up test role
      await supabase
        .from('admin_roles')
        .delete()
        .eq('name', 'test_role_debug');
    }
    
    // Check profiles table
    console.log('\n3. Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, email, user_type')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ profiles table error:', profilesError);
    } else {
      console.log(`✅ profiles table accessible, found ${profiles?.length || 0} profiles`);
      if (profiles && profiles.length > 0) {
        profiles.forEach(p => console.log(`  - ${p.email} (${p.user_type})`));
      }
    }
    
    // Check if handle_new_user function exists
    console.log('\n4. Testing handle_new_user function...');
    const { error: funcError } = await supabase.rpc('create_missing_profiles');
    
    if (funcError) {
      console.error('❌ create_missing_profiles function error:', funcError);
      if (funcError.code === 'PGRST202') {
        console.log('💡 create_missing_profiles function does not exist');
      }
    } else {
      console.log('✅ create_missing_profiles function executed successfully');
    }
    
    // Final check after running the function
    console.log('\n5. Final state check...');
    const { data: finalProfiles } = await supabase
      .from('profiles')
      .select('*');
    
    const { data: finalRoles } = await supabase
      .from('admin_roles')
      .select('*');
    
    console.log(`📊 Final count - Profiles: ${finalProfiles?.length || 0}, Admin roles: ${finalRoles?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDatabase();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileCreation() {
  console.log('🔍 Testing profile creation...');
  
  try {
    // Check how many profiles exist
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles in database`);
      
      if (profiles && profiles.length > 0) {
        console.log('📋 Existing profiles:');
        profiles.forEach(profile => {
          console.log(`  - ${profile.email} (${profile.user_type})`);
        });
      }
    }
    
    // Check auth users count (this might not work due to RLS)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (!authError && authUsers) {
      console.log(`📊 Auth users: ${authUsers.users?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProfileCreation();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserTypes() {
  console.log('🔍 Debugging user types...\n');

  try {
    // Check all profiles and their user_type
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, email, user_type, verification_status, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    console.log('📊 Current user profiles:');
    console.log('Total profiles:', profiles?.length || 0);
    console.log('');

    if (profiles && profiles.length > 0) {
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. Email: ${profile.email}`);
        console.log(`   User Type: ${profile.user_type || 'NULL'}`);
        console.log(`   Verification Status: ${profile.verification_status || 'NULL'}`);
        console.log(`   Is Verified: ${profile.is_verified}`);
        console.log(`   Created: ${profile.created_at}`);
        console.log('');
      });

      // Count by user type
      const typeCounts = profiles.reduce((acc, profile) => {
        const type = profile.user_type || 'NULL';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      console.log('📈 User type distribution:');
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }

    // Check auth users to see if there are users without profiles
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    console.log('\n👥 Auth users vs Profiles:');
    console.log(`Auth users: ${authUsers.users?.length || 0}`);
    console.log(`Profiles: ${profiles?.length || 0}`);

    if (authUsers.users && profiles) {
      const authUserIds = authUsers.users.map(u => u.id);
      const profileUserIds = profiles.map(p => p.user_id);
      
      const missingProfiles = authUserIds.filter(id => !profileUserIds.includes(id));
      if (missingProfiles.length > 0) {
        console.log(`⚠️  Users without profiles: ${missingProfiles.length}`);
        console.log('Missing profile user IDs:', missingProfiles);
      }
    }

  } catch (error) {
    console.error('❌ Error in debugUserTypes:', error);
  }
}

debugUserTypes();

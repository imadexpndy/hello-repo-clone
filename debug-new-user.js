import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugNewUser() {
  console.log('=== Debugging New User Issue ===');
  
  try {
    // 1. Check profiles table
    console.log('1. Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Profiles result:', { 
      count: profiles?.length || 0, 
      error: profilesError,
      profiles: profiles?.map(p => ({ 
        email: p.email, 
        created_at: p.created_at,
        admin_role: p.admin_role,
        user_type: p.user_type 
      }))
    });

    // 2. Check if handle_new_user function exists
    console.log('\n2. Testing handle_new_user function...');
    const { data: functionTest, error: functionError } = await supabase
      .rpc('get_current_user_id');
    
    console.log('Function test:', { functionTest, functionError });

    // 3. Check auth.users table (if accessible)
    console.log('\n3. Checking recent auth activity...');
    
    // 4. Test profile creation manually
    console.log('\n4. Testing manual profile creation...');
    const testUserId = '99999999-9999-9999-9999-999999999999';
    const { data: insertTest, error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: testUserId,
        email: 'test-manual@example.com',
        admin_role: null,
        user_type: 'particulier',
        full_name: 'Test User',
        verification_status: 'approved',
        is_verified: true
      })
      .select();

    console.log('Manual insert test:', { insertTest, insertError });

    // Clean up test
    if (!insertError) {
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', testUserId);
      console.log('Test profile cleaned up');
    }

  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugNewUser();

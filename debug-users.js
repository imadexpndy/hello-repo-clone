import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugUsers() {
  console.log('=== DEBUG: Testing database connection ===');
  
  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    console.log('Health check result:', { healthCheck, healthError });
    
    // Test 2: Try to get all profiles
    console.log('2. Fetching all profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    console.log('Profiles result:', { 
      profiles, 
      profilesError, 
      count: profiles?.length 
    });
    
    // Test 3: Check current user session
    console.log('3. Checking current user session...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', { 
      user: session?.session?.user?.email, 
      role: session?.session?.user?.user_metadata?.role,
      sessionError 
    });
    
    // Test 4: Try with service role if available
    console.log('4. Testing RLS policies...');
    const { data: rlsTest, error: rlsError } = await supabase
      .rpc('get_current_user_id');
    console.log('RLS test:', { rlsTest, rlsError });
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugUsers();

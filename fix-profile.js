import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixNewUserProfile() {
  console.log('=== Fixing New User Profile Creation Issue ===');
  
  try {
    // 1. Check current profiles
    console.log('1. Checking current profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    console.log(`Found ${profiles?.length || 0} profiles in database`);
    
    // 2. Try to create a test profile to see what happens
    console.log('\n2. Testing profile creation as authenticated user...');
    
    // First, let's try to sign up a test user to see the flow
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Creating test user: ${testEmail}`);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
    } else {
      console.log('Sign up successful:', {
        user_id: signUpData.user?.id,
        email: signUpData.user?.email,
        confirmed: signUpData.user?.email_confirmed_at ? 'Yes' : 'No'
      });
      
      // Wait a moment for the trigger to fire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if profile was created
      const { data: newProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testEmail);
      
      if (newProfiles && newProfiles.length > 0) {
        console.log('✅ Profile created automatically:', newProfiles[0]);
      } else {
        console.log('❌ Profile NOT created automatically');
        console.log('This confirms the handle_new_user trigger is not working');
        
        // Try to create profile manually while signed in
        if (signUpData.user) {
          console.log('Attempting manual profile creation...');
          
          const { data: manualProfile, error: manualError } = await supabase
            .from('profiles')
            .insert({
              user_id: signUpData.user.id,
              email: signUpData.user.email,
              admin_role: null,
              user_type: 'particulier',
              full_name: 'Test User',
              verification_status: 'approved',
              is_verified: true
            })
            .select();
          
          if (manualError) {
            console.error('Manual profile creation failed:', manualError.message);
          } else {
            console.log('✅ Manual profile creation successful:', manualProfile);
          }
        }
      }
    }
    
    // 3. Final check
    console.log('\n3. Final profiles check...');
    const { data: finalProfiles } = await supabase
      .from('profiles')
      .select('email, user_type, admin_role, created_at');
    
    console.log('All profiles:', finalProfiles);
    
  } catch (error) {
    console.error('Error in fixNewUserProfile:', error);
  }
}

fixNewUserProfile();

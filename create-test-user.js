import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log('🔄 Creating test user...');
  
  try {
    // Create a test user account
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });
    
    if (error) {
      console.error('❌ Error creating user:', error);
    } else {
      console.log('✅ Test user created:', data.user?.email);
      console.log('📧 Check email for confirmation link');
      
      // Wait a moment then check if profile was created
      setTimeout(async () => {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'test@example.com');
          
        if (profileError) {
          console.error('❌ Error checking profile:', profileError);
        } else if (profiles && profiles.length > 0) {
          console.log('✅ Profile created automatically!');
        } else {
          console.log('⚠️ No profile created - trigger may not be working');
        }
      }, 2000);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

createTestUser();

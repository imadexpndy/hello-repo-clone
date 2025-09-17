import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createAuthUsers() {
  console.log('=== Creating test users via auth system ===');
  
  const testUsers = [
    {
      email: 'admin@edjs.com',
      password: 'TestPassword123!',
      role: 'super_admin'
    },
    {
      email: 'teacher@school.com', 
      password: 'TestPassword123!',
      role: 'teacher_private'
    },
    {
      email: 'user@example.com',
      password: 'TestPassword123!',
      role: 'b2c_user'
    }
  ];

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            role: user.role
          }
        }
      });

      if (error) {
        console.error(`Error creating ${user.email}:`, error.message);
      } else {
        console.log(`Successfully created ${user.email}:`, data.user?.id);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Exception creating ${user.email}:`, error);
    }
  }

  // Check if profiles were created
  console.log('\n=== Checking profiles table ===');
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
    
    console.log('Profiles found:', profiles?.length || 0);
    if (profiles) {
      profiles.forEach(profile => {
        console.log(`- ${profile.email} (${profile.admin_role || 'no admin role'})`);
      });
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
  }
}

createAuthUsers();

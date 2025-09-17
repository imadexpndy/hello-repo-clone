import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aioldzmwwhukzabrizkt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODk4NTMsImV4cCI6MjA3MTM2NTg1M30.-49m-IWTu6Iz3keHYjUYQrI2pq12whVgVpah_cG8npA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createTestUsers() {
  console.log('=== Creating test users ===');
  
  const testUsers = [
    {
      user_id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@edjs.com',
      admin_role: 'super_admin',
      user_type: 'particulier',
      full_name: 'Super Admin',
      verification_status: 'approved',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: '22222222-2222-2222-2222-222222222222',
      email: 'teacher@school.com',
      admin_role: null, // Regular user, not admin
      user_type: 'teacher_private',
      professional_type: 'scolaire-privee',
      full_name: 'Marie Dupont',
      verification_status: 'approved',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: '33333333-3333-3333-3333-333333333333',
      email: 'user@example.com',
      admin_role: null, // Regular user, not admin
      user_type: 'particulier',
      full_name: 'Jean Martin',
      verification_status: 'approved',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: '44444444-4444-4444-4444-444444444444',
      email: 'spectacles.admin@edjs.com',
      admin_role: 'admin_spectacles',
      user_type: 'particulier',
      full_name: 'Admin Spectacles',
      verification_status: 'approved',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  try {
    // First, clear any existing test users
    console.log('Clearing existing test users...');
    await supabase
      .from('profiles')
      .delete()
      .in('email', testUsers.map(u => u.email));

    // Insert test users
    console.log('Inserting test users...');
    const { data, error } = await supabase
      .from('profiles')
      .insert(testUsers)
      .select();

    if (error) {
      console.error('Error creating test users:', error);
      return;
    }

    console.log('Successfully created test users:', data);
    
    // Verify the users were created
    const { data: allUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('*');
    
    console.log('Total users in database:', allUsers?.length);
    console.log('Users:', allUsers);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

createTestUsers();

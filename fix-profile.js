import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixProfile() {
  try {
    console.log('Updating profile role...')
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'teacher_private'
      })
      .eq('user_id', '66d69bb9-c018-4970-b22f-092c19d7a08c')
      .select()

    if (error) {
      console.error('Error updating profile:', error)
      return
    }

    console.log('Profile updated successfully:', data)
    
    // Verify the update
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, user_type, professional_type, role, admin_role, verification_status')
      .eq('user_id', '66d69bb9-c018-4970-b22f-092c19d7a08c')
      .single()

    if (fetchError) {
      console.error('Error fetching profile:', fetchError)
      return
    }

    console.log('Updated profile:', profile)
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

fixProfile()

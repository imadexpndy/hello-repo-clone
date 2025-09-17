import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  role: string;
  organization_type?: string;
  organization_name?: string;
  verification_status?: string;
}

/**
 * Get user profile by email
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return { ...data, role: data.admin_role || 'b2c_user' } as any;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ admin_role: newRole } as any)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    console.log(`Successfully updated user ${userId} role to ${newRole}`);
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
}

/**
 * Fix public school teacher role
 */
export async function fixPublicSchoolTeacherRole(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.error('User not found:', email);
      return false;
    }

    console.log('Current user profile:', user);

    // If user is a public school teacher but has wrong role
    if (user.organization_type === 'public_school' && user.role !== 'scolaire-publique') {
      const success = await updateUserRole(user.user_id, 'scolaire-publique');
      if (success) {
        console.log(`Fixed role for public school teacher: ${email}`);
        return true;
      }
    }

    // If user has admin role but shouldn't
    if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'admin_full') {
      if (user.organization_type === 'public_school') {
        const success = await updateUserRole(user.user_id, 'scolaire-publique');
        if (success) {
          console.log(`Corrected admin role to scolaire-publique for: ${email}`);
          return true;
        }
      } else if (user.organization_type === 'private_school') {
        const success = await updateUserRole(user.user_id, 'scolaire-privee');
        if (success) {
          console.log(`Corrected admin role to scolaire-privee for: ${email}`);
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error in fixPublicSchoolTeacherRole:', error);
    return false;
  }
}

/**
 * Clear admin bypass settings
 */
export function clearAdminBypass(): void {
  localStorage.removeItem('admin_bypass');
  sessionStorage.removeItem('adminAccess');
  sessionStorage.removeItem('adminTimestamp');
  console.log('Cleared admin bypass settings');
}

/**
 * Debug user role information
 */
export async function debugUserRole(email: string): Promise<void> {
  const user = await getUserByEmail(email);
  
  if (user) {
    console.log('=== USER ROLE DEBUG ===');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Organization Type:', user.organization_type);
    console.log('Organization Name:', user.organization_name);
    console.log('Verification Status:', user.verification_status);
    console.log('User ID:', user.user_id);
    console.log('======================');
  } else {
    console.log('User not found:', email);
  }
}

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const UserRoleFixer = () => {
  const { user, profile } = useAuth();

  useEffect(() => {
    const fixUserRole = async () => {
      // Skip role fixing if user came from EDJS (has return_url parameter)
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return_url');
      
      console.log('UserRoleFixer - Current URL:', window.location.href);
      console.log('UserRoleFixer - return_url parameter:', returnUrl);
      
      if (returnUrl) {
        console.log('Skipping role fixing - user came from EDJS');
        return;
      }
      
      // Clear any admin bypass for non-admin users
      const adminBypass = localStorage.getItem('admin_bypass');
      const adminUser = localStorage.getItem('admin_user');
      
      if (adminBypass === 'true' && user?.email !== 'aitmoulidimad@gmail.com') {
        console.log('Clearing admin bypass for non-admin user:', user?.email);
        localStorage.removeItem('admin_bypass');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('adminAccess');
        sessionStorage.removeItem('adminTimestamp');
        
        // Force page reload to clear any cached admin state
        window.location.reload();
        return;
      }

      // Fix specific user role if needed
      if (user?.email === 'expndyllc@gmail.com' && profile) {
        console.log('Checking role for expndyllc@gmail.com:', profile.role);
        
        // If user has wrong role, fix it based on admin_role field
        if ((profile as any).admin_role !== 'teacher_public') {
          console.log('Fixing admin_role for public school teacher');
          
          const { error } = await supabase
            .from('profiles')
            .update({ admin_role: 'teacher_public' })
            .eq('user_id', user.id);
            
          if (!error) {
            console.log('Role fixed successfully, reloading...');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            console.error('Failed to fix role:', error);
          }
        }
      }
    };

    if (user && profile) {
      fixUserRole();
    }
  }, [user, profile]);

  return null; // This component doesn't render anything
};

/**
 * Clear all user session data and admin bypass settings
 */
export function clearAllUserSession(): void {
  // Clear admin bypass
  localStorage.removeItem('admin_bypass');
  localStorage.removeItem('admin_user');
  sessionStorage.removeItem('adminAccess');
  sessionStorage.removeItem('adminTimestamp');
  
  // Clear Supabase auth
  localStorage.removeItem('sb-aioldzmwwhukzabrizkt-auth-token');
  sessionStorage.removeItem('sb-aioldzmwwhukzabrizkt-auth-token');
  
  // Clear any other auth-related items
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('auth') || key.includes('admin'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('Cleared all user session data');
}

/**
 * Force user to re-authenticate with correct role
 */
export function forceReauth(): void {
  clearAllUserSession();
  window.location.href = '/auth';
}

/**
 * Check if user has admin bypass active
 */
export function hasAdminBypass(): boolean {
  const adminBypass = localStorage.getItem('admin_bypass');
  const adminUser = localStorage.getItem('admin_user');
  
  if (adminBypass === 'true' && adminUser) {
    try {
      const adminData = JSON.parse(adminUser);
      return adminData.email === 'aitmoulidimad@gmail.com' && adminData.admin_role === 'admin_full';
    } catch (e) {
      return false;
    }
  }
  
  return false;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'scolaire-privee' | 'scolaire-publique' | 'association' | 'partner' | 'b2c_user';
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRole, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Check for admin bypass first - but only allow for actual admin users
  const adminBypass = localStorage.getItem('admin_bypass');
  const adminUser = localStorage.getItem('admin_user');
  
  // Only allow bypass if user is actually an admin
  if (adminBypass === 'true' && adminUser) {
    try {
      const adminData = JSON.parse(adminUser);
      if (adminData.email === 'aitmoulidimad@gmail.com' && adminData.admin_role === 'admin_full') {
        return <>{children}</>;
      }
    } catch (e) {
      // Invalid admin data, clear it
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('admin_user');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chargement du profil...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  // Check if user has required role - use user_type as primary, fallback to role
  const userRole = profile.user_type || profile.role;
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has one of the allowed roles - use user_type as primary, fallback to role
  if (allowedRoles && !allowedRoles.includes(userRole) && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
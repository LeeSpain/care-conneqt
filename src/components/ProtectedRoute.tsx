import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type AppRole = 'member' | 'family_carer' | 'nurse' | 'facility_admin' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requiredRole, requireOnboarding = false }: ProtectedRouteProps) => {
  const { user, profile, roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check sessionStorage for cached auth to make instant decision
    const cachedAuth = sessionStorage.getItem('auth_cached');
    
    if (!loading || cachedAuth) {
      // Only redirect if we're sure user is not authenticated
      if (!user && !cachedAuth) {
        navigate('/auth/login');
        return;
      }

      if (requiredRole && user) {
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role)) || roles.includes('admin');
        
        if (!hasRequiredRole && roles.length > 0) {
          // Redirect to appropriate dashboard based on user's actual role
          if (roles.includes('admin')) {
            navigate('/dashboard/admin');
          } else if (roles.includes('facility_admin')) {
            navigate('/dashboard/facility');
          } else if (roles.includes('nurse')) {
            navigate('/dashboard/nurse');
          } else if (roles.includes('family_carer')) {
            navigate('/dashboard/family');
          } else if (roles.includes('member')) {
            navigate('/dashboard/member');
          }
          return;
        }
      }

      if (requireOnboarding && profile && !profile.onboarding_completed) {
        navigate('/onboarding');
        return;
      }
    }
  }, [user?.id, profile?.id, roles.join(','), loading, requiredRole, requireOnboarding, navigate]);

  // Always render children immediately for progressive loading
  return <>{children}</>;
};

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
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // Only redirect if we're sure user is not authenticated
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    if (requiredRole && user) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = requiredRoles.some(role => roles.includes(role)) || roles.includes('admin');
      
      if (!hasRequiredRole && roles.length > 0) {
        // Redirect to appropriate dashboard based on user's actual role
        if (roles.includes('admin')) {
          navigate('/dashboard/admin', { replace: true });
        } else if (roles.includes('facility_admin')) {
          navigate('/dashboard/facility', { replace: true });
        } else if (roles.includes('nurse')) {
          navigate('/dashboard/nurse', { replace: true });
        } else if (roles.includes('family_carer')) {
          navigate('/dashboard/family', { replace: true });
        } else if (roles.includes('member')) {
          navigate('/dashboard/member', { replace: true });
        }
        return;
      }
    }

    if (requireOnboarding && profile && !profile.onboarding_completed) {
      navigate('/onboarding', { replace: true });
      return;
    }
  }, [loading, user, roles, profile?.onboarding_completed, requiredRole, requireOnboarding, navigate]);

  // Always render children immediately for progressive loading
  return <>{children}</>;
};

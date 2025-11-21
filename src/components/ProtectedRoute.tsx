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
    if (!loading) {
      if (!user) {
        navigate('/auth/login');
        return;
      }

      if (requiredRole) {
        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role)) || roles.includes('admin');
        
        if (!hasRequiredRole) {
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
          } else {
            navigate('/auth/login');
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

  // Show content immediately with skeleton - no blocking spinner
  if (loading) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

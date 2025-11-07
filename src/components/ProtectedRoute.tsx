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
          if (roles.includes('nurse')) {
            navigate('/dashboard');
          } else if (roles.includes('member')) {
            navigate('/dashboard');
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
  }, [user, profile, roles, loading, requiredRole, requireOnboarding, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

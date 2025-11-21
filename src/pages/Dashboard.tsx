import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { roles, loading, rolesLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered - loading:', loading, 'rolesLoaded:', rolesLoaded, 'roles:', roles);
    
    // Wait for both auth loading AND roles to be loaded before making routing decisions
    if (loading || !rolesLoaded) {
      console.log('[Dashboard] Waiting... loading:', loading, 'rolesLoaded:', rolesLoaded);
      return;
    }

    console.log('[Dashboard] Ready to route! Roles:', roles);
    
    // If still no roles after loading completes, default to member dashboard
    if (roles.length === 0) {
      console.log('[Dashboard] ERROR: No roles found after loading! Defaulting to member');
      navigate('/dashboard/member', { replace: true });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('devmode') === 'true';

    if (devMode) {
      navigate('/dashboard/family', { replace: true });
      return;
    }

    // Route to appropriate dashboard based on highest priority role
    if (roles.includes('admin')) {
      console.log('[Dashboard] Redirecting to ADMIN dashboard');
      navigate('/dashboard/admin', { replace: true });
    } else if (roles.includes('facility_admin')) {
      console.log('[Dashboard] Redirecting to FACILITY dashboard');
      navigate('/dashboard/facility', { replace: true });
    } else if (roles.includes('nurse')) {
      console.log('[Dashboard] Redirecting to NURSE dashboard');
      navigate('/dashboard/nurse', { replace: true });
    } else if (roles.includes('family_carer')) {
      console.log('[Dashboard] Redirecting to FAMILY dashboard');
      navigate('/dashboard/family', { replace: true });
    } else if (roles.includes('member')) {
      console.log('[Dashboard] Redirecting to MEMBER dashboard');
      navigate('/dashboard/member', { replace: true });
    }
  }, [roles, loading, rolesLoaded, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}

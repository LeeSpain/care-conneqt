import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { roles, loading, rolesLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for both auth loading AND roles to be loaded before making routing decisions
    if (loading || !rolesLoaded) {
      console.log('[Dashboard] Still loading... loading:', loading, 'rolesLoaded:', rolesLoaded);
      return;
    }

    console.log('[Dashboard] Routing user with roles:', roles);
    
    // If still no roles after loading completes, default to member dashboard
    if (roles.length === 0) {
      console.log('[Dashboard] No roles found, defaulting to member');
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

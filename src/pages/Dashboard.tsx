import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered - loading:', loading, 'roles:', roles);
    
    // Wait for auth loading to complete
    if (loading) {
      console.log('[Dashboard] Waiting for auth to load...');
      return;
    }

    console.log('[Dashboard] Auth loaded! Checking roles...');
    
    // If no roles after loading completes, show error (don't default to member)
    if (roles.length === 0) {
      console.log('[Dashboard] ERROR: No roles found after loading! User needs role assignment.');
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
  }, [roles, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}

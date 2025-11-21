import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { roles, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Dashboard] useEffect triggered - loading:', loading, 'roles:', roles);
    
    // Wait for auth loading to complete
    if (loading) {
      console.log('[Dashboard] Waiting for auth to load...');
      return;
    }

    // Ensure user exists
    if (!user) {
      console.log('[Dashboard] No user found - redirecting to login');
      navigate('/auth/login', { replace: true });
      return;
    }

    console.log('[Dashboard] Auth loaded! Checking roles...');
    
    // If no roles after loading completes, show error (don't default to member)
    if (roles.length === 0) {
      console.log('[Dashboard] ERROR: No roles found after loading!');
      return; // Let the UI below handle this
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
  }, [roles, loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Show error if no roles after loading
  if (!loading && roles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Access Issue</h2>
          <p className="text-muted-foreground mb-4">
            Your account doesn't have the necessary permissions. Please contact support.
          </p>
          <Button onClick={() => navigate('/auth/login')} variant="outline">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

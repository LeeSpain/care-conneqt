import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard: loading=', loading, 'roles=', roles);
    
    if (loading) return;

    // Wait for roles to load before navigating
    if (roles.length === 0) {
      console.warn('Waiting for roles to load...');
      return;
    }

    console.log('Navigating based on roles:', roles);

    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('devmode') === 'true';

    if (devMode) {
      navigate('/dashboard/family', { replace: true });
      return;
    }

    if (roles.includes('admin')) {
      console.log('Redirecting to admin dashboard');
      navigate('/dashboard/admin', { replace: true });
    } else if (roles.includes('facility_admin')) {
      navigate('/dashboard/facility', { replace: true });
    } else if (roles.includes('nurse')) {
      navigate('/dashboard/nurse', { replace: true });
    } else if (roles.includes('family_carer')) {
      navigate('/dashboard/family', { replace: true });
    } else if (roles.includes('member')) {
      navigate('/dashboard/member', { replace: true });
    } else {
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

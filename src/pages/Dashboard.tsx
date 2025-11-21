import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { roles, loading } = useAuth();
  const navigate = useNavigate();
  
  // Dev mode bypass for quick testing
  const urlParams = new URLSearchParams(window.location.search);
  const devMode = urlParams.get('devmode') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Dev mode bypass - default to Family Dashboard
  if (devMode) {
    navigate('/dashboard/family', { replace: true });
    return null;
  }

  // Admin has access to everything
  if (roles.includes('admin')) {
    navigate('/dashboard/admin', { replace: true });
    return null;
  }

  // Route to appropriate dashboard based on primary role
  if (roles.includes('facility_admin')) {
    navigate('/dashboard/facility', { replace: true });
    return null;
  }

  if (roles.includes('nurse')) {
    navigate('/dashboard/nurse', { replace: true });
    return null;
  }

  if (roles.includes('family_carer')) {
    navigate('/dashboard/family', { replace: true });
    return null;
  }

  if (roles.includes('member')) {
    navigate('/dashboard/member', { replace: true });
    return null;
  }

  navigate('/dashboard/member', { replace: true });
  return null;
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;
    
    // Redirect to role-specific settings (check admin first - highest priority)
    if (roles.includes('admin')) {
      navigate('/dashboard/admin/system-settings', { replace: true });
    } else if (roles.includes('facility_admin')) {
      navigate('/dashboard/facility/settings', { replace: true });
    } else if (roles.includes('nurse')) {
      navigate('/dashboard/nurse/settings', { replace: true });
    } else if (roles.includes('family_carer')) {
      navigate('/dashboard/family/settings', { replace: true });
    } else if (roles.includes('member')) {
      navigate('/dashboard/member/settings', { replace: true });
    }
  }, [roles, loading, navigate]);

  return null;
}

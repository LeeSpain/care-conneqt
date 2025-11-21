import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role-specific settings
    if (roles.includes('member')) {
      navigate('/dashboard/member/settings', { replace: true });
    } else if (roles.includes('nurse')) {
      navigate('/dashboard/nurse/settings', { replace: true });
    } else if (roles.includes('family_carer')) {
      navigate('/dashboard/family/settings', { replace: true });
    } else if (roles.includes('facility_admin')) {
      navigate('/dashboard/facility/settings', { replace: true });
    } else if (roles.includes('admin')) {
      navigate('/dashboard/admin/system-settings', { replace: true });
    }
  }, [roles, navigate]);

  return null;
}

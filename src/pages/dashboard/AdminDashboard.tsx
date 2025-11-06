import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Activity, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    facilities: 0,
    activeSubscriptions: 0,
    systemHealth: 'Good'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch facilities count
      const { count: facilitiesCount } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true });

      // Fetch active subscriptions
      const { count: subscriptionsCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'active');

      setStats({
        totalUsers: usersCount || 0,
        facilities: facilitiesCount || 0,
        activeSubscriptions: subscriptionsCount || 0,
        systemHealth: 'Good'
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout title={t('admin.title')}>
      <div className="space-y-6">
        {/* System Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.facilities')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.facilities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.activeSubscriptions')}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.systemHealth')}</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('quickStats.good')}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.controlPanel')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('admin.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

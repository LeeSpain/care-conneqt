import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, BedDouble, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function FacilityDashboard() {
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState({
    totalResidents: 0,
    bedOccupancy: 0,
    staffMembers: 0,
    activeAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch facility residents count
      const { count: residentsCount } = await supabase
        .from('facility_residents')
        .select('*', { count: 'exact', head: true })
        .is('discharge_date', null);

      // Fetch facility info for bed capacity
      const { data: facility } = await supabase
        .from('facilities')
        .select('bed_capacity')
        .single();

      // Fetch staff count
      const { count: staffCount } = await supabase
        .from('facility_staff')
        .select('*', { count: 'exact', head: true });

      // Fetch active alerts for residents
      const { data: residents } = await supabase
        .from('facility_residents')
        .select('member_id')
        .is('discharge_date', null);

      let alertsCount = 0;
      if (residents && residents.length > 0) {
        const memberIds = residents.map(r => r.member_id);
        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .in('member_id', memberIds)
          .eq('status', 'new');
        alertsCount = count || 0;
      }

      const bedCapacity = facility?.bed_capacity || 0;
      const occupancy = bedCapacity > 0 
        ? Math.round(((residentsCount || 0) / bedCapacity) * 100) 
        : 0;

      setStats({
        totalResidents: residentsCount || 0,
        bedOccupancy: occupancy,
        staffMembers: staffCount || 0,
        activeAlerts: alertsCount
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout title={t('facility.title')}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.totalResidents')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.totalResidents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.bedOccupancy')}</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : `${stats.bedOccupancy}%`}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.staffMembers')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.staffMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.activeAlerts')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : stats.activeAlerts}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('facility.welcome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('facility.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

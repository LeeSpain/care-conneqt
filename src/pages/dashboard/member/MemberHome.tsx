import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberDashboardLayout } from '@/components/MemberDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Heart, MessageSquare, Shield, Calendar, Package } from 'lucide-react';
import { formatDate } from '@/lib/intl';
import { useTranslation } from 'react-i18next';

export default function MemberHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    const fetchMemberData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      if (fetchInProgress.current) return;
      fetchInProgress.current = true;

      // Only set timeout when actually fetching
      timeoutId = setTimeout(() => {
        if (fetchInProgress.current) {
          setError(t('errors.somethingWrong'));
          setLoading(false);
          fetchInProgress.current = false;
        }
      }, 15000);

      try {
        const { data, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (memberError) throw memberError;

        setMember(data);
        
        if (data) {
          const { count, error: deviceError } = await supabase
            .from('member_devices')
            .select('*', { count: 'exact', head: true })
            .eq('member_id', data.id);
          
          if (deviceError) throw deviceError;
          setDeviceCount(count || 0);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError(t('errors.loadFailed'));
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchMemberData();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user?.id, t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (error) {
    return (
      <MemberDashboardLayout title={t('member.profile')}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('errors.refresh')}</Button>
          </CardContent>
        </Card>
      </MemberDashboardLayout>
    );
  }

  const firstName = profile?.first_name || 'there';
  const formattedDate = formatDate(currentDateTime, 'EEEE, MMMM d, yyyy', profile?.language || 'en');
  const formattedTime = formatDate(currentDateTime, 'h:mm a', profile?.language || 'en');

  return (
    <MemberDashboardLayout title={t('member.profile')}>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-2">{t('welcome')}, {loading ? '...' : firstName}</h2>
            <p className="text-muted-foreground">
              {formattedDate} {t('common.at')} {formattedTime}
            </p>
            <p className="text-muted-foreground mt-1">
              {t('member.healthSummary')}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('healthMonitoring.title')}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('quickStats.good')}</div>
              <p className="text-xs text-muted-foreground">{t('alerts.noAlerts')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('devices.title')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deviceCount}</div>
              <p className="text-xs text-muted-foreground">
                {deviceCount === 0 ? t('devices.manage') : t('status.active')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Guardian</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('status.active')}</div>
              <p className="text-xs text-muted-foreground">{t('common.ready')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('subscriptions.title')}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{member?.subscription_status || t('status.active')}</div>
              <p className="text-xs text-muted-foreground">
                {member?.subscription_tier || t('subscriptions.current')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('schedule.appointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{t('nurse.healthMonitoring.title')}</p>
                    <p className="text-sm text-muted-foreground">{t('common.tomorrow')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">{t('actions.viewDetails')}</Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/member/schedule')}>
                {t('actions.viewAll')} {t('schedule.appointments')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('common.notifications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{t('devices.title')} {t('status.completed')}</p>
                  <p className="text-sm text-muted-foreground">{t('devices.online')}</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t('common.hours')} {t('common.ago')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Heart className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{t('healthMonitoring.title')} {t('labels.lastUpdated')}</p>
                  <p className="text-sm text-muted-foreground">{t('common.ready')}</p>
                  <p className="text-xs text-muted-foreground mt-1">5 {t('common.hours')} {t('common.ago')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('devices.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceCount > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {deviceCount} {t('devices.online')}
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/member/devices')}>
                  {t('devices.manage')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">{t('errors.noData')}</p>
                <Button onClick={() => navigate('/dashboard/member/devices')}>
                  {t('actions.add')} {t('devices.title')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberDashboardLayout>
  );
}

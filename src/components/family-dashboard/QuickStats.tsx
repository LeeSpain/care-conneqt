import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Bell, Pill } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'alert';
}

const StatCard = ({ icon, label, value, status }: StatCardProps) => {
  const statusColors = {
    good: 'bg-secondary/10 text-secondary',
    warning: 'bg-coral/10 text-coral',
    alert: 'bg-destructive/10 text-destructive'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${statusColors[status]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickStatsProps {
  memberName: string;
}

export const QuickStats = ({ memberName }: QuickStatsProps) => {
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState({
    heartRate: '72',
    steps: '2,847',
    alerts: 0,
    medications: '3/3'
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!member) return;

      // Fetch latest health metrics
      const { data: healthMetrics } = await supabase
        .from('health_metrics')
        .select('metric_type, metric_value')
        .eq('member_id', member.id)
        .in('metric_type', ['heart_rate', 'steps'])
        .order('recorded_at', { ascending: false })
        .limit(2);

      // Fetch active alerts
      const { data: alerts } = await supabase
        .from('alerts')
        .select('id')
        .eq('member_id', member.id)
        .eq('status', 'new');

      if (healthMetrics) {
        const heartRate = healthMetrics.find(m => m.metric_type === 'heart_rate');
        const steps = healthMetrics.find(m => m.metric_type === 'steps');
        
        setStats(prev => ({
          ...prev,
          heartRate: heartRate ? heartRate.metric_value.toString() : prev.heartRate,
          steps: steps ? steps.metric_value.toString() : prev.steps,
          alerts: alerts?.length || 0
        }));
      }
    };

    fetchStats();

    // Set up realtime subscription for alerts
    const channel = supabase
      .channel('quick-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Heart className="h-5 w-5" />}
        label={t('quickStats.heartRate')}
        value={`${stats.heartRate} ${t('quickStats.bpm')}`}
        status="good"
      />
      <StatCard
        icon={<Activity className="h-5 w-5" />}
        label={t('quickStats.activityToday')}
        value={`${stats.steps} ${t('quickStats.steps')}`}
        status="good"
      />
      <StatCard
        icon={<Bell className="h-5 w-5" />}
        label={t('quickStats.activeAlerts')}
        value={stats.alerts.toString()}
        status={stats.alerts > 0 ? 'warning' : 'good'}
      />
      <StatCard
        icon={<Pill className="h-5 w-5" />}
        label={t('quickStats.medications')}
        value={stats.medications}
        status="good"
      />
    </div>
  );
};
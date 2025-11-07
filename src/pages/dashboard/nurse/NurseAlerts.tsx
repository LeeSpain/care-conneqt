import { useEffect, useState } from 'react';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface Alert {
  id: string;
  member_id: string;
  title: string;
  description: string;
  alert_type: string;
  priority: string;
  status: string;
  created_at: string;
  members: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function NurseAlerts() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    
    const channel = supabase
      .channel('nurse-alerts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => fetchAlerts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;

    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select('member_id')
      .eq('nurse_id', user.id);

    if (assignments && assignments.length > 0) {
      const memberIds = assignments.map(a => a.member_id);

      const { data } = await supabase
        .from('alerts')
        .select('*')
        .in('member_id', memberIds)
        .order('created_at', { ascending: false });

      if (data) {
        const alertsWithMembers = await Promise.all(
          data.map(async (alert: any) => {
            const { data: member } = await supabase
              .from('members')
              .select('profiles:user_id(first_name, last_name)')
              .eq('id', alert.member_id)
              .single();
            return { ...alert, members: member };
          })
        );
        setAlerts(alertsWithMembers as Alert[]);
      }
    }
    setLoading(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'in_progress' })
      .eq('id', alertId);

    if (error) {
      toast.error('Failed to acknowledge alert');
    } else {
      toast.success('Alert acknowledged');
      fetchAlerts();
    }
  };

  const resolveAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('alerts')
      .update({
        status: 'resolved',
        resolved_by: user!.id,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) {
      toast.error('Failed to resolve alert');
    } else {
      toast.success('Alert resolved');
      fetchAlerts();
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter !== 'all' && alert.priority !== filter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return colors[priority] || 'default';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'in_progress') return <Clock className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <NurseDashboardLayout title={t('alerts.title')}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Priority
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Critical
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High
            </Button>
            <Button
              variant={filter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('medium')}
            >
              Medium
            </Button>
            <Button
              variant={filter === 'low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low')}
            >
              Low
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All Status
            </Button>
            <Button
              variant={statusFilter === 'new' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('new')}
            >
              New
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_progress')}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('resolved')}
            >
              Resolved
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('alerts.allClear')}</h3>
                <p className="text-muted-foreground">{t('alerts.noAlerts')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(alert.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">{alert.title}</CardTitle>
                          <Badge variant={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.members?.profiles?.first_name} {alert.members?.profiles?.last_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(alert.created_at), 'PPp')}
                    </p>
                    <div className="flex gap-2">
                      {alert.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </NurseDashboardLayout>
  );
}

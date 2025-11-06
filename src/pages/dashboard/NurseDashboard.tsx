import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export default function NurseDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    assignedMembers: 0,
    activeAlerts: 0,
    tasksToday: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('nurse_assignments')
        .select(`
          *,
          members:member_id (
            *,
            profiles:user_id (first_name, last_name)
          )
        `)
        .eq('nurse_id', user.id);

      setAssignments(data || []);

      // Fetch stats
      const { data: tasksData } = await supabase
        .from('nurse_tasks')
        .select('status, due_date')
        .eq('nurse_id', user.id);

      if (data && data.length > 0) {
        const memberIds = data.map(a => a.member_id);
        const { count: alertsCount } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .in('member_id', memberIds)
          .eq('status', 'new');

        setStats({
          assignedMembers: data.length,
          activeAlerts: alertsCount || 0,
          tasksToday: tasksData?.filter(t => 
            t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()
          ).length || 0,
          completed: tasksData?.filter(t => t.status === 'completed').length || 0
        });
      }

      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel('nurse-dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nurse_tasks',
          filter: `nurse_id=eq.${user?.id}`
        },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <DashboardLayout title={t('nurse.title')}>
      <div className="space-y-6">
        {/* DEV: Test Credentials Panel */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('nurse.testCredentials')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-900 dark:text-blue-100">
            <p className="font-mono text-sm">Email: nurse@test.com</p>
            <p className="font-mono text-sm">Password: Nurse123!</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.assignedMembers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.activeAlerts')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.tasksToday')}</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasksToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.completed')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Members */}
        <Card>
          <CardHeader>
            <CardTitle>{t('nurse.myMembers')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {t('nurse.noMembers')}
              </p>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {assignment.members?.profiles?.first_name}{' '}
                        {assignment.members?.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.is_primary && '(Primary) '}
                        {t('nurse.assignedOn')} {format(new Date(assignment.assigned_at), 'PP')}
                      </p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

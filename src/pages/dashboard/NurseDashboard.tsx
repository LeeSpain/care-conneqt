import { useEffect, useState } from 'react';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, AlertTriangle, CheckCircle, MessageSquare, Activity, ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { InekeAssistant } from '@/components/nurse/InekeAssistant';

export default function NurseDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [priorityAlerts, setPriorityAlerts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    assignedMembers: 0,
    activeAlerts: 0,
    tasksToday: 0,
    completed: 0,
    pendingMessages: 0
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
        
        const { data: alertsData, count: alertsCount } = await supabase
          .from('alerts')
          .select('*, members:member_id(profiles:user_id(first_name, last_name))', { count: 'exact' })
          .in('member_id', memberIds)
          .eq('status', 'new')
          .order('created_at', { ascending: false })
          .limit(5);

        setPriorityAlerts(alertsData || []);

        const { count: messagesCount } = await supabase
          .from('care_messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        const { data: activityData } = await supabase
          .from('activity_logs')
          .select('*, members:member_id(profiles:user_id(first_name, last_name))')
          .in('member_id', memberIds)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentActivity(activityData || []);

        setStats({
          assignedMembers: data.length,
          activeAlerts: alertsCount || 0,
          tasksToday: tasksData?.filter(t => 
            t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()
          ).length || 0,
          completed: tasksData?.filter(t => t.status === 'completed').length || 0,
          pendingMessages: messagesCount || 0
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
    <NurseDashboardLayout title={t('nurse.title')}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/nurse/members')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.assignedMembers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedMembers}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/nurse/alerts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.activeAlerts')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/nurse/tasks')}>
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

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/nurse/messages')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingMessages}</div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Actions */}
        {priorityAlerts.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Priority Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5">
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.members?.profiles?.first_name} {alert.members?.profiles?.last_name}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/dashboard/nurse/alerts')}>
                    View
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.members?.profiles?.first_name} {activity.members?.profiles?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.created_at), 'PPp')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('nurse.myMembers')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/nurse/members')}>
                  View All
                </Button>
              </div>
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
                  {assignments.slice(0, 5).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/nurse/members/${assignment.member_id}`)}
                    >
                      <div>
                        <p className="font-medium">
                          {assignment.members?.profiles?.first_name}{' '}
                          {assignment.members?.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.is_primary && (
                            <Badge variant="secondary" className="mr-2">Primary</Badge>
                          )}
                          {t('nurse.assignedOn')} {format(new Date(assignment.assigned_at), 'PP')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <InekeAssistant />
    </NurseDashboardLayout>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NurseDashboardLayout } from "@/components/NurseDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, AlertCircle, MessageSquare, Activity, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDate } from '@/lib/intl';

export default function NurseHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedMembers: 0,
    pendingTasks: 0,
    activeAlerts: 0,
    unreadMessages: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchNurseData = async () => {
      if (!user) return;

      try {
        // Fetch assigned members count
        const { count: membersCount } = await supabase
          .from('nurse_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('nurse_id', user.id);

        // Fetch pending tasks count
        const { count: tasksCount } = await supabase
          .from('nurse_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('nurse_id', user.id)
          .eq('status', 'pending');

        // Fetch active alerts count
        const { count: alertsCount } = await supabase
          .from('alerts')
          .select('*, nurse_assignments!inner(nurse_id)', { count: 'exact', head: true })
          .neq('status', 'resolved')
          .eq('nurse_assignments.nurse_id', user.id);

        // Fetch unread messages count
        const { count: messagesCount } = await supabase
          .from('care_messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        // Fetch recent tasks
        const { data: tasksData } = await supabase
          .from('nurse_tasks')
          .select('*, members(id, user_id)')
          .eq('nurse_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          assignedMembers: membersCount || 0,
          pendingTasks: tasksCount || 0,
          activeAlerts: alertsCount || 0,
          unreadMessages: messagesCount || 0,
        });

        setRecentTasks(tasksData || []);
      } catch (error) {
        console.error('Error fetching nurse data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurseData();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <NurseDashboardLayout title="Nurse Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </NurseDashboardLayout>
    );
  }

  const firstName = profile?.first_name || 'Nurse';
  const formattedDate = formatDate(currentDateTime, 'EEEE, MMMM d, yyyy', profile?.language || 'en');
  const formattedTime = formatDate(currentDateTime, 'h:mm a', profile?.language || 'en');

  return (
    <NurseDashboardLayout title="Nurse Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {firstName}</h2>
            <p className="text-muted-foreground">
              {formattedDate} at {formattedTime}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                On Duty
              </Badge>
              <span className="text-sm text-muted-foreground">
                {stats.assignedMembers} member{stats.assignedMembers !== 1 ? 's' : ''} under your care
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/members")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assignedMembers}</div>
              <p className="text-xs text-muted-foreground">Active care assignments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/tasks")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingTasks === 0 ? 'All caught up!' : 'Tasks to complete'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/alerts")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeAlerts === 0 ? 'No alerts' : 'Require attention'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/messages")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      ) : task.priority === 'urgent' ? (
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                      ) : (
                        <Clock className="h-8 w-8 text-primary" />
                      )}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.task_type} • {task.priority} priority
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/dashboard/nurse/tasks')}
                >
                  View All Tasks
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No pending tasks</p>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/dashboard/nurse/members')}
              >
                <Users className="h-6 w-6" />
                <span>View Members</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/dashboard/nurse/health')}
              >
                <Activity className="h-6 w-6" />
                <span>Health Monitoring</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate('/dashboard/nurse/alerts')}
              >
                <AlertCircle className="h-6 w-6" />
                <span>Check Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </NurseDashboardLayout>
  );
}

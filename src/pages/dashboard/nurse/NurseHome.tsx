import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NurseDashboardLayout } from "@/components/NurseDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, AlertCircle, MessageSquare, Activity, Clock, CheckCircle2, AlertTriangle, RefreshCw, Bot } from "lucide-react";
import { formatDate } from '@/lib/intl';
import { useToast } from '@/hooks/use-toast';

export default function NurseHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    assignedMembers: 0,
    pendingTasks: 0,
    activeAlerts: 0,
    unreadMessages: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const fetchNurseData = async () => {
    if (!user) return;

    const startTime = performance.now();
    console.log('[NurseHome] Starting data fetch for user:', user.id);

    try {
      // Fetch stats in parallel with better error handling
      const statsPromises = [
        supabase
          .from('nurse_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('nurse_id', user.id),
        supabase
          .from('nurse_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('nurse_id', user.id)
          .eq('status', 'pending'),
        supabase
          .from('care_messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false)
      ];

      const [membersResult, tasksResult, messagesResult] = await Promise.all(statsPromises);

      // Log detailed error information
      if (membersResult.error) {
        console.error('[NurseHome] Members query error:', {
          message: membersResult.error.message,
          details: membersResult.error.details,
          hint: membersResult.error.hint,
          code: membersResult.error.code
        });
      }
      if (tasksResult.error) {
        console.error('[NurseHome] Tasks query error:', {
          message: tasksResult.error.message,
          details: tasksResult.error.details,
          hint: tasksResult.error.hint,
          code: tasksResult.error.code
        });
      }
      if (messagesResult.error) {
        console.error('[NurseHome] Messages query error:', {
          message: messagesResult.error.message,
          details: messagesResult.error.details,
          hint: messagesResult.error.hint,
          code: messagesResult.error.code
        });
      }

      // Get member IDs first for alerts query
      const { data: assignmentsData } = await supabase
        .from('nurse_assignments')
        .select('member_id')
        .eq('nurse_id', user.id);

      const memberIds = assignmentsData?.map(a => a.member_id) || [];

      // Fetch alerts count using simpler query
      let alertsCount = 0;
      if (memberIds.length > 0) {
        const { count, error: alertsError } = await supabase
          .from('alerts')
          .select('id', { count: 'exact', head: true })
          .in('member_id', memberIds)
          .neq('status', 'resolved');

        if (alertsError) {
          console.error('[NurseHome] Alerts query error:', {
            message: alertsError.message,
            details: alertsError.details,
            hint: alertsError.hint,
            code: alertsError.code
          });
        } else {
          alertsCount = count || 0;
        }
      }

      setStats({
        assignedMembers: membersResult.count || 0,
        pendingTasks: tasksResult.count || 0,
        activeAlerts: alertsCount,
        unreadMessages: messagesResult.count || 0,
      });

      setLoadingStats(false);

      // Fetch recent tasks separately
      const { data: tasksData, error: recentTasksError } = await supabase
        .from('nurse_tasks')
        .select('*, members(id, user_id)')
        .eq('nurse_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentTasksError) {
        console.error('[NurseHome] Recent tasks query error:', {
          message: recentTasksError.message,
          details: recentTasksError.details,
          hint: recentTasksError.hint,
          code: recentTasksError.code
        });
      } else {
        setRecentTasks(tasksData || []);
      }

      setLoadingTasks(false);

      const endTime = performance.now();
      console.log(`[NurseHome] Data fetch completed in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (err: any) {
      console.error('[NurseHome] Unexpected error:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
      toast({
        title: "Error loading dashboard",
        description: err.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingStats(false);
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('[NurseHome] Loading timeout reached');
        setError('Loading is taking longer than expected. Please try refreshing.');
        setLoading(false);
        setLoadingStats(false);
        setLoadingTasks(false);
      }
    }, 30000); // Increased to 30 seconds

    fetchNurseData();

    return () => clearTimeout(timeout);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingStats(true);
    setLoadingTasks(true);
    setError(null);
    fetchNurseData();
  };

  if (loading) {
    return (
      <NurseDashboardLayout title="Nurse Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </NurseDashboardLayout>
    );
  }

  if (error && !stats.assignedMembers) {
    return (
      <NurseDashboardLayout title="Nurse Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </NurseDashboardLayout>
    );
  }

  const firstName = profile?.first_name || 'Nurse';
  const formattedDate = formatDate(currentDateTime, 'EEEE, MMMM d, yyyy', profile?.language || 'en');
  const formattedTime = formatDate(currentDateTime, 'h:mm a', profile?.language || 'en');

  return (
    <NurseDashboardLayout title="Nurse Dashboard">
      <div className="space-y-6">
        {/* Welcome and Ineke Card Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
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
                </div>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loadingStats}>
                  <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ineke AI Agent Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ineke</h3>
                    <p className="text-xs text-muted-foreground">AI Nursing Assistant</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Get instant support with patient care, medication queries, and clinical guidance.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={() => navigate('/dashboard/ai-chat')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Ineke
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/members")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.assignedMembers}</div>
                  <p className="text-xs text-muted-foreground">Active care assignments</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/tasks")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingTasks === 0 ? 'All caught up!' : 'Tasks to complete'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/alerts")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeAlerts === 0 ? 'No alerts' : 'Require attention'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/nurse/messages")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTasks ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
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

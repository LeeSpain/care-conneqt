import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NurseDashboardLayout } from "@/components/NurseDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { Users, AlertCircle, MessageSquare, Activity, Clock, CheckCircle2, AlertTriangle, RefreshCw, Bot } from "lucide-react";
import { formatDate } from '@/lib/intl';
import { useToast } from '@/hooks/use-toast';
import inekeAvatar from "@/assets/ineke-avatar.png";
import { InekeAssistant } from '@/components/nurse/InekeAssistant';
import { useNurseData } from '@/hooks/useNurseStats';

export default function NurseHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError, error, refetch } = useNurseData(user?.id);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [inekeAssistantOpen, setInekeAssistantOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  const showSkeleton = isLoading;
  const stats = data?.stats || { assignedMembers: 0, pendingTasks: 0, activeAlerts: 0, unreadMessages: 0 };
  const recentTasks = data?.recentTasks || [];

  if (isError) {
    return (
      <NurseDashboardLayout title="Nurse Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || "Failed to load dashboard data"}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </NurseDashboardLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress': return <Activity className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <NurseDashboardLayout title="Nurse Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {profile?.first_name || 'Nurse'}
              </h2>
              <p className="text-muted-foreground">
                {formatDate(currentDateTime, 'EEEE, MMMM d, yyyy • HH:mm')}
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Card 
            className="relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 border-blue-500/20"
            onClick={() => setInekeAssistantOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center gap-3 pb-3 relative z-10">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                  <AvatarImage src={inekeAvatar} alt="Ineke" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20">IN</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  Ineke Assistant
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">Your AI nursing support companion</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground mb-3">
                Get instant help with care questions, task prioritization, and clinical guidance.
              </p>
              <Button 
                variant="outline" 
                className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setInekeAssistantOpen(true);
                }}
              >
                Start Conversation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.assignedMembers}</div>
                  <p className="text-xs text-muted-foreground">Under your care</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">To complete today</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">Requiring attention</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recent care tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {showSkeleton ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/dashboard/nurse/tasks')}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.task_type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          <span className="capitalize">{task.status.replace('_', ' ')}</span>
                        </span>
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground">
                          Due: {formatDate(new Date(task.due_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent tasks to display
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common nursing tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/members')}>
                View All Members
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/tasks')}>
                Manage Tasks
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/alerts')}>
                View Alerts
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/health')}>
                Health Monitoring
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming activities</CardDescription>
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No scheduled activities for today
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks Completed Today:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Alerts Resolved:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages Sent:</span>
                <span className="font-medium">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ineke Assistant - Floating & Popup */}
      <InekeAssistant 
        context={{
          tasks: recentTasks
        }}
        isOpen={inekeAssistantOpen}
        onOpenChange={setInekeAssistantOpen}
      />
    </NurseDashboardLayout>
  );
}
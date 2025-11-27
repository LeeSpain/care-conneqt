import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { supabase } from '@/integrations/supabase/client';

export default function NurseHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError, error, refetch } = useNurseData(user?.id);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [inekeAssistantOpen, setInekeAssistantOpen] = useState(false);

  // Real-time updates for tasks and alerts
  useEffect(() => {
    if (!user?.id) return;

    console.log('[NurseHome] Setting up real-time subscriptions for nurse:', user.id);

    const channel = supabase
      .channel('nurse-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nurse_tasks',
          filter: `nurse_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[NurseHome] Task update received:', payload);
          refetch();
          toast({
            title: t('nurse.home.update'),
            description: t('nurse.home.tasksUpdated'),
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        (payload) => {
          console.log('[NurseHome] Alert update received:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('[NurseHome] Subscription status:', status);
      });

    return () => {
      console.log('[NurseHome] Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Remove refetch and toast from dependencies - they're stable

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
            <p className="text-destructive mb-4">{error?.message || t('nurse.home.failedLoad')}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('nurse.home.refreshPage')}
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
                {t('nurse.home.welcomeBack')}, {profile?.first_name || 'Nurse'}
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
                  {t('nurse.home.inekeAssistant')}
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    {t('nurse.home.online')}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">{t('nurse.home.aiNursingSupport')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground mb-3">
                {t('nurse.home.instantHelp')}
              </p>
              <Button 
                variant="outline" 
                className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setInekeAssistantOpen(true);
                }}
              >
                {t('nurse.home.startConversation')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.home.assignedMembers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.assignedMembers}</div>
                  <p className="text-xs text-muted-foreground">{t('nurse.home.underYourCare')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.home.pendingTasks')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">{t('nurse.home.toCompleteToday')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.home.activeAlerts')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">{t('nurse.home.requiringAttention')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.home.messages')}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                  <p className="text-xs text-muted-foreground">{t('nurse.home.unreadMessages')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nurse.home.recentTasks')}</CardTitle>
            <CardDescription>{t('nurse.home.mostRecentTasks')}</CardDescription>
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
                          {t('nurse.home.dueDate')} {formatDate(new Date(task.due_date), 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {t('nurse.home.noRecentTasks')}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('nurse.home.quickActions')}</CardTitle>
              <CardDescription>{t('nurse.home.commonNursingTasks')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/members')}>
                {t('nurse.home.viewAllMembers')}
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/tasks')}>
                {t('nurse.home.manageTasks')}
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/alerts')}>
                {t('nurse.home.viewAlerts')}
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/nurse/health')}>
                {t('nurse.home.healthMonitoring')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('nurse.home.todaySchedule')}</CardTitle>
              <CardDescription>{t('nurse.home.upcomingActivities')}</CardDescription>
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t('nurse.home.noScheduledActivities')}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('nurse.home.quickStats')}</CardTitle>
              <CardDescription>{t('nurse.home.performanceOverview')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('nurse.home.tasksCompletedToday')}</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('nurse.home.alertsResolved')}</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('nurse.home.messagesSent')}</span>
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
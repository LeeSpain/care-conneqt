import { FamilyDashboardLayout } from "@/components/FamilyDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Users, AlertCircle, Calendar, MessageSquare, RefreshCw, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFamilyStats } from "@/hooks/useFamilyStats";
import { useTranslation } from 'react-i18next';
import { ClaraFamilyChat } from "@/components/ai-agents/ClaraFamilyChat";

export default function FamilyHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard');
  const { data: stats, isLoading, isError, error, refetch } = useFamilyStats(user?.id);

  const handleRefresh = () => {
    refetch();
  };

  const showSkeleton = isLoading;

  if (isError) {
    return (
      <FamilyDashboardLayout title={t('family.dashboard')}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || t('errors.loadFailed')}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('errors.refresh')}
            </Button>
          </CardContent>
        </Card>
      </FamilyDashboardLayout>
    );
  }

  return (
    <FamilyDashboardLayout title={t('family.dashboard')}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('family.welcome')}</h2>
            <p className="text-muted-foreground">
              {t('family.description')}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.assignedMembers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.connectedMembers || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('family.members')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.activeAlerts')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeAlerts || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('alerts.priority')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('schedule.appointments')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.upcomingAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('common.upcoming')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.messages.title')}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('nurse.messages.unread')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('nurse.memberDetail.quickActions')}</CardTitle>
              <CardDescription>{t('family.dashboard')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/family/members')}>
                <Users className="mr-2 h-4 w-4" />
                {t('actions.viewAll')} {t('family.members')}
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {t('schedule.appointments')}
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/care-team')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('careTeam.sendMessage')}
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {t('actions.viewAll')} {t('common.reports')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('member.recentActivity')}</CardTitle>
              <CardDescription>{t('common.loading')}</CardDescription>
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {t('common.noResults')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('careTeam.title')}</CardTitle>
            <CardDescription>{t('careTeam.contact')}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  {t('nurse.callMember.videoCall')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('schedule.appointments')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => navigate('/dashboard/care-team')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('careTeam.sendMessage')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('careTeam.sendMessage')}</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </div>
      
      <ClaraFamilyChat />
    </FamilyDashboardLayout>
  );
}

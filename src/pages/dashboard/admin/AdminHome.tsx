import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, Building2, Activity, UserCheck, RefreshCw, Calendar, 
  DollarSign, AlertTriangle, TrendingUp, Bot, ArrowRight, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useCEODashboard } from "@/hooks/useCEODashboard";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/intl";
import { Badge } from "@/components/ui/badge";

export default function AdminHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation('dashboard-admin');
  const { profile } = useAuth();
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();
  const { data: ceoStats, isLoading: ceoLoading, refetch: refetchCeo } = useCEODashboard();
  
  const firstName = profile?.first_name || 'Admin';
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, 'EEEE, MMMM d, yyyy', i18n.language);
  const formattedTime = formatDate(currentDate, 'h:mm a', i18n.language);
  const hour = currentDate.getHours();
  
  const getGreeting = () => {
    if (hour < 12) return t('home.greetings.morning');
    if (hour < 17) return t('home.greetings.afternoon');
    return t('home.greetings.evening');
  };

  const handleRefresh = () => {
    refetch();
    refetchCeo();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  if (isError) {
    return (
      <AdminDashboardLayout title={t('home.title')}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || t('toast.error.loadFailed', { error: '' })}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('home.refresh')}
            </Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={t('home.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4" />
              {formattedDate} • {formattedTime}
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {firstName}!
            </h2>
            <p className="text-muted-foreground mt-1">
              {t('home.subtitle')}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading || ceoLoading}>
            <RefreshCw className={`h-4 w-4 ${(isLoading || ceoLoading) ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* CEO Revenue & Alerts Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* MRR Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.ceo.mrr')}</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {ceoLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(ceoStats?.mrr || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    ARR: {formatCurrency(ceoStats?.arr || 0)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Critical Alerts Card */}
          <Card className={ceoStats?.criticalAlerts ? "border-destructive/50 bg-destructive/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.ceo.criticalAlerts')}</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${ceoStats?.criticalAlerts ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              {ceoLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className={`text-2xl font-bold ${ceoStats?.criticalAlerts ? 'text-destructive' : ''}`}>
                    {ceoStats?.criticalAlerts || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ceoStats?.pendingAlerts || 0} {t('home.ceo.pending')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Conversations Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.ceo.aiConversations')}</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {ceoLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{ceoStats?.todayConversations || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {ceoStats?.totalEscalations || 0} {t('home.ceo.escalations')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Satisfaction Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.ceo.satisfaction')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {ceoLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {ceoStats?.avgSatisfaction ? `${(ceoStats.avgSatisfaction * 20).toFixed(0)}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">{t('home.ceo.aiSatisfaction')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.stats.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('home.stats.registered')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.stats.activeMembers')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeMembers || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('home.stats.careRecipients')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.stats.totalNurses')}</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalNurses || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('home.stats.careProviders')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('home.stats.facilities')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalFacilities || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('home.stats.careFacilities')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity & Actions Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Leads */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('home.ceo.recentLeads')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/leads')}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {ceoLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : ceoStats?.recentLeads?.length ? (
                ceoStats.recentLeads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate max-w-[120px]">{lead.name}</span>
                      <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                    </div>
                    <span className="text-muted-foreground text-xs">{formatTimeAgo(lead.created_at)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('home.ceo.noRecentLeads')}</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('home.ceo.recentOrders')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/finance')}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {ceoLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : ceoStats?.recentOrders?.length ? (
                ceoStats.recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[140px]">{order.customer_name}</span>
                    <span className="text-primary font-medium">{formatCurrency(order.total)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('home.ceo.noRecentOrders')}</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Signups */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{t('home.ceo.recentSignups')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/users')}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {ceoLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              ) : ceoStats?.recentSignups?.length ? (
                ceoStats.recentSignups.slice(0, 4).map((signup) => (
                  <div key={signup.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[140px]">{signup.name}</span>
                    <span className="text-muted-foreground text-xs">{formatTimeAgo(signup.created_at)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('home.ceo.noRecentSignups')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & System Health */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('home.quickActions.title')}</CardTitle>
              <CardDescription>{t('home.quickActions.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/nurses')}
                className="justify-start"
              >
                {t('home.quickActions.addNurse')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/members')}
                className="justify-start"
              >
                {t('home.quickActions.addMember')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/commercial/facilities')}
                className="justify-start"
              >
                {t('home.quickActions.addFacility')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/announcements')}
                className="justify-start"
              >
                {t('home.quickActions.addAnnouncement')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('home.systemHealth.title')}</CardTitle>
              <CardDescription>{t('home.systemHealth.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">{t('home.systemHealth.operational')}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/system-health')}>
                  {t('home.systemHealth.viewDetails')}
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('home.systemHealth.integrations')}</span>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/dashboard/admin/integrations')}>
                  {t('home.systemHealth.configure')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

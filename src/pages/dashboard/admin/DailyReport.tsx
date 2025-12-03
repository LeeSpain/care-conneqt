import { useState } from "react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyReport } from "@/hooks/useDailyReport";
import { useTranslation } from "react-i18next";
import { format, subDays, isToday, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Printer,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Bot,
  DollarSign,
  Users,
  Ticket,
  Smartphone,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const DailyReport = () => {
  const { t } = useTranslation('dashboard-admin');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading, refetch, isFetching } = useDailyReport(selectedDate);

  const minDate = subDays(new Date(), 7);
  const maxDate = new Date();
  
  const canGoBack = startOfDay(selectedDate) > startOfDay(minDate);
  const canGoForward = startOfDay(selectedDate) < startOfDay(maxDate);

  const goToPreviousDay = () => {
    if (canGoBack) {
      setSelectedDate(subDays(selectedDate, 1));
    }
  };

  const goToNextDay = () => {
    if (canGoForward) {
      setSelectedDate(prev => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 1);
        return next;
      });
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout title={t('dailyReport.title', 'Daily Report')}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={t('dailyReport.title', 'Daily Report')}>
      <div className="space-y-6">
        {/* Header with Date Navigation */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-muted-foreground">{t('dailyReport.subtitle', 'Executive Overview')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                {t('dailyReport.print', 'Print')}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('dailyReport.export', 'Export PDF')}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                {t('dailyReport.refresh', 'Refresh')}
              </Button>
            </div>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 border">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPreviousDay}
              disabled={!canGoBack}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3 px-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="text-center min-w-[200px]">
                <p className="text-lg font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                {!isToday(selectedDate) && (
                  <p className="text-xs text-muted-foreground">
                    {t('dailyReport.historicalData', 'Historical data')}
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextDay}
              disabled={!canGoForward}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {!isToday(selectedDate) && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={goToToday}
                className="ml-2"
              >
                {t('dailyReport.today', 'Today')}
              </Button>
            )}
          </div>
        </div>

        {/* Revenue Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dailyReport.revenue.todayRevenue', "Today's Revenue")}</p>
                  <p className="text-2xl font-bold">{formatCurrency(data?.revenue.todayRevenue || 0)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dailyReport.revenue.mrr', 'MRR')}</p>
                  <p className="text-2xl font-bold">{formatCurrency(data?.revenue.mrr || 0)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dailyReport.revenue.arr', 'ARR')}</p>
                  <p className="text-2xl font-bold">{formatCurrency(data?.revenue.arr || 0)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={data?.revenue.mrrChange && data.revenue.mrrChange > 0 ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dailyReport.revenue.mrrChange', 'MRR Change')}</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {data?.revenue.mrrChange && data.revenue.mrrChange > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                    {data?.revenue.mrrChange?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {data?.alerts && data.alerts.critical > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t('dailyReport.alerts.title', 'Critical Alerts')}
                  <Badge variant="destructive">{data.alerts.critical}</Badge>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard/admin/alerts')}
                >
                  {t('dailyReport.alerts.viewAll', 'View All')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.alerts.items.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="flex-1 text-sm">{alert.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(alert.created_at), 'HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                {t('dailyReport.activity.title', 'Activity Summary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium"></th>
                      <th className="text-center py-2 font-medium">{t('dailyReport.activity.today', 'Today')}</th>
                      <th className="text-center py-2 font-medium">{t('dailyReport.activity.thisWeek', 'This Week')}</th>
                      <th className="text-center py-2 font-medium">{t('dailyReport.activity.thisMonth', 'This Month')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">{t('dailyReport.activity.leads', 'New Leads')}</td>
                      <td className="text-center font-semibold">{data?.activity.today.leads || 0}</td>
                      <td className="text-center">{data?.activity.week.leads || 0}</td>
                      <td className="text-center">{data?.activity.month.leads || 0}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">{t('dailyReport.activity.orders', 'Orders')}</td>
                      <td className="text-center font-semibold">{data?.activity.today.orders || 0}</td>
                      <td className="text-center">{data?.activity.week.orders || 0}</td>
                      <td className="text-center">{data?.activity.month.orders || 0}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">{t('dailyReport.activity.signups', 'Signups')}</td>
                      <td className="text-center font-semibold">{data?.activity.today.signups || 0}</td>
                      <td className="text-center">{data?.activity.week.signups || 0}</td>
                      <td className="text-center">{data?.activity.month.signups || 0}</td>
                    </tr>
                    <tr>
                      <td className="py-3">{t('dailyReport.activity.conversations', 'AI Conversations')}</td>
                      <td className="text-center font-semibold">{data?.activity.today.conversations || 0}</td>
                      <td className="text-center">{data?.activity.week.conversations || 0}</td>
                      <td className="text-center">{data?.activity.month.conversations || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-secondary" />
                {t('dailyReport.ai.title', 'AI Performance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{data?.ai.conversations || 0}</p>
                  <p className="text-xs text-muted-foreground">{t('dailyReport.ai.conversations', 'Conversations')}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <p className="text-2xl font-bold">{data?.ai.satisfaction?.toFixed(0) || 0}%</p>
                  <p className="text-xs text-muted-foreground">{t('dailyReport.ai.satisfaction', 'Satisfaction')}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-warning/10">
                  <p className="text-2xl font-bold">{data?.ai.escalations || 0}</p>
                  <p className="text-xs text-muted-foreground">{t('dailyReport.ai.escalations', 'Escalations')}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/dashboard/admin/ai-analytics')}
              >
                {t('dailyReport.quickActions.viewAI', 'View AI Analytics')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                {t('dailyReport.pipeline.title', 'Pipeline Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>New</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${data?.pipeline ? (data.pipeline.new / (data.pipeline.new + data.pipeline.contacted + data.pipeline.qualified + data.pipeline.proposal + data.pipeline.won || 1)) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{data?.pipeline.new || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Contacted</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${data?.pipeline ? (data.pipeline.contacted / (data.pipeline.new + data.pipeline.contacted + data.pipeline.qualified + data.pipeline.proposal + data.pipeline.won || 1)) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{data?.pipeline.contacted || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Qualified</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${data?.pipeline ? (data.pipeline.qualified / (data.pipeline.new + data.pipeline.contacted + data.pipeline.qualified + data.pipeline.proposal + data.pipeline.won || 1)) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{data?.pipeline.qualified || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Proposal</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${data?.pipeline ? (data.pipeline.proposal / (data.pipeline.new + data.pipeline.contacted + data.pipeline.qualified + data.pipeline.proposal + data.pipeline.won || 1)) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{data?.pipeline.proposal || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Won</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success rounded-full" 
                        style={{ width: `${data?.pipeline ? (data.pipeline.won / (data.pipeline.new + data.pipeline.contacted + data.pipeline.qualified + data.pipeline.proposal + data.pipeline.won || 1)) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{data?.pipeline.won || 0}</span>
                  </div>
                </div>
                <div className="pt-3 border-t mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('dailyReport.pipeline.conversion', 'Conversion Rate')}</span>
                    <span className="font-bold text-lg">{data?.pipeline.conversionRate?.toFixed(1) || 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                {t('dailyReport.operations.title', 'Operational Health')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>{t('dailyReport.operations.systemStatus', 'System Status')}</span>
                  </div>
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                    Operational
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{t('dailyReport.operations.activeNurses', 'Active Nurses')}</span>
                    </div>
                    <span className="font-semibold">{data?.operations.activeNurses || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{t('dailyReport.operations.openTickets', 'Open Tickets')}</span>
                    </div>
                    <span className="font-semibold">{data?.operations.openTickets || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{t('dailyReport.operations.deviceAlerts', 'Device Alerts')}</span>
                    </div>
                    <span className="font-semibold">{data?.operations.deviceAlerts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{t('dailyReport.operations.pendingTasks', 'Pending Tasks')}</span>
                    </div>
                    <span className="font-semibold">{data?.operations.pendingTasks || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                {t('dailyReport.finance.title', 'Financial Summary')}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/admin/finance')}
              >
                {t('dailyReport.quickActions.viewFinance', 'Finance Dashboard')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{formatCurrency(data?.finance.outstandingInvoices || 0)}</p>
                <p className="text-sm text-muted-foreground">{t('dailyReport.finance.outstanding', 'Outstanding Invoices')}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{data?.finance.pendingPayments || 0}</p>
                <p className="text-sm text-muted-foreground">{t('dailyReport.finance.pending', 'Pending Payments')}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{data?.finance.activeSubscriptions || 0}</p>
                <p className="text-sm text-muted-foreground">{t('dailyReport.finance.subscriptions', 'Active Subscriptions')}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{data?.finance.recentTransactions?.length || 0}</p>
                <p className="text-sm text-muted-foreground">{t('dailyReport.finance.recentTransactions', 'Recent Transactions')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('dailyReport.quickActions.title', 'Quick Actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate('/dashboard/admin/alerts')}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">{t('dailyReport.quickActions.viewAlerts', 'View All Alerts')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate('/dashboard/admin/leads')}
              >
                <Target className="h-5 w-5" />
                <span className="text-sm">{t('dailyReport.quickActions.viewLeads', 'View All Leads')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate('/dashboard/admin/finance')}
              >
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">{t('dailyReport.quickActions.viewFinance', 'Finance Dashboard')}</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2"
                onClick={() => navigate('/dashboard/admin/ai-analytics')}
              >
                <Bot className="h-5 w-5" />
                <span className="text-sm">{t('dailyReport.quickActions.viewAI', 'AI Analytics')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default DailyReport;

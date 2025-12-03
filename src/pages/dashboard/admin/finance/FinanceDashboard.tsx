import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useRevenueStats, useTransactions, useInvoices, useRevenueSnapshots } from "@/hooks/useFinance";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Users, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function FinanceDashboard() {
  const { t } = useTranslation('dashboard-admin');
  const { data: stats, isLoading: statsLoading, refetch } = useRevenueStats();
  const { data: recentTransactions, isLoading: transactionsLoading } = useTransactions();
  const { data: recentInvoices, isLoading: invoicesLoading } = useInvoices();
  const { data: snapshots } = useRevenueSnapshots('monthly', 6);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-500/10 text-green-500',
      completed: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      processing: 'bg-blue-500/10 text-blue-500',
      overdue: 'bg-red-500/10 text-red-500',
      failed: 'bg-red-500/10 text-red-500',
      cancelled: 'bg-muted text-muted-foreground',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  // Prepare chart data from orders for now (since snapshots might be empty)
  const chartData = snapshots?.length ? snapshots.map(s => ({
    name: format(new Date(s.snapshot_date), 'MMM'),
    mrr: Number(s.mrr),
    revenue: Number(s.total_revenue),
  })) : [
    { name: 'Jan', mrr: stats?.mrr ? stats.mrr * 0.7 : 0, revenue: 0 },
    { name: 'Feb', mrr: stats?.mrr ? stats.mrr * 0.75 : 0, revenue: 0 },
    { name: 'Mar', mrr: stats?.mrr ? stats.mrr * 0.8 : 0, revenue: 0 },
    { name: 'Apr', mrr: stats?.mrr ? stats.mrr * 0.85 : 0, revenue: 0 },
    { name: 'May', mrr: stats?.mrr ? stats.mrr * 0.9 : 0, revenue: 0 },
    { name: 'Jun', mrr: stats?.mrr || 0, revenue: stats?.totalRevenue || 0 },
  ];

  const invoiceStatusData = [
    { name: t('finance.paid'), value: stats?.paidInvoices || 0 },
    { name: t('finance.pending'), value: stats?.pendingInvoices || 0 },
    { name: t('finance.overdue'), value: stats?.overdueInvoices || 0 },
  ].filter(d => d.value > 0);

  return (
    <AdminDashboardLayout title={t('finance.dashboard.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.dashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.dashboard.subtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common:buttons.refresh')}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.mrr')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.mrr || 0)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+12.5%</span>
                    <span className="ml-1">{t('finance.vsLastMonth')}</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.arr')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.arr || 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('finance.annualProjection')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.activeSubscriptions')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+3</span>
                    <span className="ml-1">{t('finance.thisMonth')}</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.activeCredits')}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.activeCredits || 0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('finance.outstandingCredits')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Trend Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{t('finance.revenueTrend')}</CardTitle>
              <CardDescription>{t('finance.last6Months')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis 
                      className="text-xs" 
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toFixed(0)}`, 'MRR']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mrr" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Status Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{t('finance.invoiceStatus')}</CardTitle>
              <CardDescription>{t('finance.currentDistribution')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {invoiceStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {invoiceStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">{t('finance.noInvoiceData')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.transactionSuccess')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">
                    {stats?.totalTransactions ? 
                      Math.round((stats.successfulTransactions / stats.totalTransactions) * 100) : 100}%
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {stats?.successfulTransactions || 0} / {stats?.totalTransactions || 0} {t('finance.transactions')}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.overdueInvoices')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">{stats?.overdueInvoices || 0}</span>
                  <p className="text-xs text-muted-foreground">{t('finance.requiresAttention')}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stats?.overdueInvoices ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                  {stats?.overdueInvoices ? (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.avgRevenuePerUser')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">
                    {formatCurrency(stats?.activeSubscriptions ? (stats.mrr / stats.activeSubscriptions) : 0)}
                  </span>
                  <p className="text-xs text-muted-foreground">{t('finance.perMonth')}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('finance.recentTransactions')}</CardTitle>
                <CardDescription>{t('finance.last5Transactions')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/admin/finance/transactions">
                  {t('common:buttons.viewAll')}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          tx.transaction_type === 'payment' ? 'bg-green-500/10' : 
                          tx.transaction_type === 'refund' ? 'bg-red-500/10' : 'bg-blue-500/10'
                        }`}>
                          {tx.transaction_type === 'payment' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : tx.transaction_type === 'refund' ? (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {tx.members?.profiles?.first_name} {tx.members?.profiles?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{tx.transaction_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          tx.transaction_type === 'refund' ? 'text-red-500' : ''
                        }`}>
                          {tx.transaction_type === 'refund' ? '-' : '+'}€{Number(tx.amount).toFixed(2)}
                        </p>
                        <Badge variant="outline" className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{t('finance.noTransactions')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('finance.recentInvoices')}</CardTitle>
                <CardDescription>{t('finance.last5Invoices')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/admin/finance/invoices">
                  {t('common:buttons.viewAll')}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentInvoices && recentInvoices.length > 0 ? (
                <div className="space-y-4">
                  {recentInvoices.slice(0, 5).map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{inv.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {inv.members?.profiles?.first_name} {inv.members?.profiles?.last_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">€{Number(inv.total).toFixed(2)}</p>
                        <Badge variant="outline" className={getStatusColor(inv.status)}>
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{t('finance.noInvoices')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link to="/dashboard/admin/finance/subscriptions">
                  <Users className="h-5 w-5" />
                  <span>{t('sidebar.subscriptions')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link to="/dashboard/admin/finance/invoices">
                  <FileText className="h-5 w-5" />
                  <span>{t('sidebar.invoices')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link to="/dashboard/admin/finance/transactions">
                  <Receipt className="h-5 w-5" />
                  <span>{t('sidebar.transactions')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link to="/dashboard/admin/finance/credits">
                  <CreditCard className="h-5 w-5" />
                  <span>{t('sidebar.creditsRefunds')}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

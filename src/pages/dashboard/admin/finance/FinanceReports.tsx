import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useRevenueStats, useRevenueSnapshots } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function FinanceReports() {
  const { t } = useTranslation('dashboard-admin');
  const [reportPeriod, setReportPeriod] = useState('6months');
  const { data: stats, isLoading: statsLoading } = useRevenueStats();
  const { data: snapshots } = useRevenueSnapshots('monthly', 12);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock data for charts (replace with real data when available)
  const mrrGrowthData = snapshots?.length ? snapshots.map(s => ({
    month: format(new Date(s.snapshot_date), 'MMM'),
    mrr: Number(s.mrr),
    newMrr: Number(s.new_mrr),
    churnedMrr: Number(s.churned_mrr),
  })) : Array.from({ length: 6 }, (_, i) => ({
    month: format(subMonths(new Date(), 5 - i), 'MMM'),
    mrr: (stats?.mrr || 0) * (0.7 + i * 0.06),
    newMrr: (stats?.mrr || 0) * 0.1,
    churnedMrr: (stats?.mrr || 0) * 0.02,
  }));

  const revenueByProductData = [
    { name: t('finance.reports.subscriptions'), value: 65 },
    { name: t('finance.reports.devices'), value: 25 },
    { name: t('finance.reports.services'), value: 10 },
  ];

  const subscriptionGrowthData = Array.from({ length: 6 }, (_, i) => ({
    month: format(subMonths(new Date(), 5 - i), 'MMM'),
    new: Math.floor(Math.random() * 10) + 5,
    churned: Math.floor(Math.random() * 3),
    net: 0,
  })).map(d => ({ ...d, net: d.new - d.churned }));

  const paymentMethodData = [
    { name: t('finance.reports.card'), value: 70 },
    { name: t('finance.reports.bankTransfer'), value: 20 },
    { name: t('finance.reports.other'), value: 10 },
  ];

  const handleExport = (reportType: string) => {
    // TODO: Implement actual export logic
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <AdminDashboardLayout title={t('finance.reports.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.reports.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.reports.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">{t('finance.reports.lastMonth')}</SelectItem>
                <SelectItem value="3months">{t('finance.reports.last3Months')}</SelectItem>
                <SelectItem value="6months">{t('finance.reports.last6Months')}</SelectItem>
                <SelectItem value="12months">{t('finance.reports.last12Months')}</SelectItem>
                <SelectItem value="ytd">{t('finance.reports.yearToDate')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.reports.totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">+18.2%</span>
                    <span className="ml-1">{t('finance.reports.vsPrevious')}</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.reports.mrrGrowth')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+12.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('finance.reports.monthOverMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.reports.churnRate')}</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">-0.5%</span>
                <span className="ml-1">{t('finance.reports.improvement')}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.reports.ltv')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€1,840</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('finance.reports.avgLifetimeValue')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('finance.reports.revenue')}
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('finance.reports.subscriptions')}
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              {t('finance.reports.breakdown')}
            </TabsTrigger>
          </TabsList>

          {/* Revenue Report */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('finance.reports.mrrTrend')}</CardTitle>
                  <CardDescription>{t('finance.reports.monthlyRecurringRevenue')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport('mrr')}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('finance.reports.exportCSV')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mrrGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `€${v}`} />
                      <Tooltip 
                        formatter={(value: number) => [`€${value.toFixed(0)}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="mrr" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        name={t('finance.reports.mrr')}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('finance.reports.newVsChurned')}</CardTitle>
                  <CardDescription>{t('finance.reports.mrrMovement')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mrrGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `€${v}`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="newMrr" fill="hsl(var(--primary))" name={t('finance.reports.newMrr')} />
                        <Bar dataKey="churnedMrr" fill="hsl(var(--destructive))" name={t('finance.reports.churnedMrr')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('finance.reports.revenueByProduct')}</CardTitle>
                  <CardDescription>{t('finance.reports.productMix')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueByProductData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {revenueByProductData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscriptions Report */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('finance.reports.subscriptionGrowth')}</CardTitle>
                  <CardDescription>{t('finance.reports.netSubscriberChange')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport('subscriptions')}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('finance.reports.exportCSV')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="new" fill="hsl(var(--primary))" name={t('finance.reports.newSubscribers')} />
                      <Bar dataKey="churned" fill="hsl(var(--destructive))" name={t('finance.reports.churned')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('finance.reports.avgSubscriptionLength')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14.2 {t('finance.reports.months')}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('finance.reports.beforeChurn')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('finance.reports.expansionRate')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">8.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('finance.reports.upgradesAddons')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('finance.reports.contractionRate')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">1.2%</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('finance.reports.downgrades')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Breakdown Report */}
          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('finance.reports.paymentMethods')}</CardTitle>
                  <CardDescription>{t('finance.reports.howCustomersPay')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentMethodData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('finance.reports.availableReports')}</CardTitle>
                  <CardDescription>{t('finance.reports.downloadReports')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: t('finance.reports.revenueReport'), icon: DollarSign },
                      { name: t('finance.reports.subscriptionReport'), icon: Users },
                      { name: t('finance.reports.transactionLog'), icon: FileText },
                      { name: t('finance.reports.taxReport'), icon: BarChart3 },
                    ].map((report) => (
                      <div 
                        key={report.name}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <report.icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

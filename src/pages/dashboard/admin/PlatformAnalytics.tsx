import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Activity, AlertCircle, Heart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

export default function PlatformAnalytics() {
  const { t } = useTranslation('dashboard-admin');

  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const [users, members, nurses, facilities, devices, alerts] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("members").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "nurse"),
        supabase.from("facilities").select("*", { count: "exact", head: true }),
        supabase.from("member_devices").select("*", { count: "exact", head: true }),
        supabase.from("alerts").select("*", { count: "exact", head: true }).eq("status", "new")
      ]);

      return {
        totalUsers: users.count || 0,
        totalMembers: members.count || 0,
        totalNurses: nurses.count || 0,
        totalFacilities: facilities.count || 0,
        totalDevices: devices.count || 0,
        activeAlerts: alerts.count || 0
      };
    }
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription-breakdown"],
    queryFn: async () => {
      const { data } = await supabase
        .from("members")
        .select("subscription_status");

      const breakdown = data?.reduce((acc: any, member) => {
        const status = member.subscription_status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(breakdown || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));
    }
  });

  const { data: deviceBreakdown } = useQuery({
    queryKey: ["device-breakdown"],
    queryFn: async () => {
      const { data } = await supabase
        .from("member_devices")
        .select("device_type");

      const breakdown = data?.reduce((acc: any, device) => {
        const type = device.device_type || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(breakdown || {}).map(([name, value]) => ({
        name: name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        value
      }));
    }
  });

  const growthData = [
    { month: "Jan", users: 120, members: 80 },
    { month: "Feb", users: 145, members: 95 },
    { month: "Mar", users: 178, members: 118 },
    { month: "Apr", users: 210, members: 142 },
    { month: "May", users: 245, members: 168 },
    { month: "Jun", users: 280, members: 195 }
  ];

  return (
    <AdminDashboardLayout title={t('platformAnalytics.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('platformAnalytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('platformAnalytics.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12.5%</span> {t('platformAnalytics.fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.careRecipients')}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+8.3%</span> {t('platformAnalytics.fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.nursingStaff')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalNurses || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('platformAnalytics.activeCareProviders')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.facilities')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFacilities || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('platformAnalytics.careFacilities')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.connectedDevices')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDevices || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('platformAnalytics.activeMonitoringDevices')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('platformAnalytics.activeAlerts')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeAlerts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('platformAnalytics.requiringAttention')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="growth" className="space-y-4">
          <TabsList>
            <TabsTrigger value="growth">{t('platformAnalytics.tabs.growthTrends')}</TabsTrigger>
            <TabsTrigger value="subscriptions">{t('platformAnalytics.tabs.subscriptions')}</TabsTrigger>
            <TabsTrigger value="devices">{t('platformAnalytics.tabs.devices')}</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('platformAnalytics.userGrowth')}</CardTitle>
                <CardDescription>{t('platformAnalytics.usersAndRecipientsOverTime')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} name={t('platformAnalytics.totalUsers')} />
                    <Line type="monotone" dataKey="members" stroke="hsl(var(--secondary))" strokeWidth={2} name={t('platformAnalytics.careRecipients')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('platformAnalytics.subscriptionBreakdown')}</CardTitle>
                <CardDescription>{t('platformAnalytics.distributionOfTiers')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subscriptionData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('platformAnalytics.deviceDistribution')}</CardTitle>
                <CardDescription>{t('platformAnalytics.typesOfDevices')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name={t('platformAnalytics.devices')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

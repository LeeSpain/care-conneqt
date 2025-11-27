import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, DollarSign, Users } from "lucide-react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";

export default function ClaraAnalytics() {
  const { t } = useTranslation('dashboard-admin');
  const { data: analytics } = useQuery({
    queryKey: ['clara-sales-analytics'],
    queryFn: async () => {
      const [conversationsRes, ordersRes] = await Promise.all([
        supabase
          .from('ai_agent_conversations')
          .select('*')
          .eq('agent_id', (await supabase.from('ai_agents').select('id').eq('name', 'Clara').single()).data?.id),
        supabase
          .from('orders')
          .select('*')
      ]);

      return {
        totalConversations: conversationsRes.data?.length || 0,
        totalOrders: ordersRes.data?.length || 0,
        conversionRate: conversationsRes.data?.length 
          ? ((ordersRes.data?.length || 0) / conversationsRes.data.length * 100).toFixed(1)
          : '0',
        avgOrderValue: ordersRes.data?.length
          ? (ordersRes.data.reduce((sum, o) => sum + (parseFloat(o.total_monthly?.toString() || '0')), 0) / ordersRes.data.length).toFixed(2)
          : '0'
      };
    }
  });

  return (
    <AdminDashboardLayout title={t('claraAnalytics.title')}>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('claraAnalytics.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('claraAnalytics.subtitle')}
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('claraAnalytics.totalConversations')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalConversations || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('claraAnalytics.ordersGenerated')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('claraAnalytics.conversionRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.conversionRate || 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('claraAnalytics.avgOrderValue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{analytics?.avgOrderValue || 0}/mo</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('claraAnalytics.comingSoon')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('claraAnalytics.comingSoonDesc')}
          </p>
        </CardContent>
      </Card>
    </div>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquare, TrendingUp, ThumbsUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

export default function AIAnalytics() {
  const { t } = useTranslation('dashboard-admin');

  const { data: agents } = useQuery({
    queryKey: ["ai-agents-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agents")
        .select("*");

      if (error) throw error;
      return data;
    }
  });

  const { data: conversationStats } = useQuery({
    queryKey: ["ai-conversation-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agent_conversations")
        .select("*");

      if (error) throw error;

      const totalConversations = data.length;
      const escalated = data.filter(c => c.was_escalated).length;
      const avgSatisfaction = data
        .filter(c => c.satisfaction_rating !== null)
        .reduce((sum, c) => sum + (c.satisfaction_rating || 0), 0) / 
        (data.filter(c => c.satisfaction_rating !== null).length || 1);

      return {
        totalConversations,
        escalated,
        escalationRate: totalConversations > 0 ? (escalated / totalConversations * 100).toFixed(1) : 0,
        avgSatisfaction: avgSatisfaction.toFixed(1),
        satisfactionCount: data.filter(c => c.satisfaction_rating !== null).length
      };
    }
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["ai-analytics-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agent_analytics")
        .select("*")
        .order("date", { ascending: true })
        .limit(30);

      if (error) throw error;
      return data;
    }
  });

  const agentPerformance = agents?.map(agent => {
    const agentAnalytics = analyticsData?.filter(a => a.agent_id === agent.id) || [];
    const totalConversations = agentAnalytics.reduce((sum, a) => sum + (a.total_conversations || 0), 0);
    const totalEscalations = agentAnalytics.reduce((sum, a) => sum + (a.escalations || 0), 0);

    return {
      name: agent.display_name,
      conversations: totalConversations,
      escalations: totalEscalations,
    };
  });

  const timeSeriesData = analyticsData?.slice(-7).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    conversations: d.total_conversations || 0,
    satisfaction: d.average_satisfaction || 0
  })) || [];

  return (
    <AdminDashboardLayout title={t('aiAnalytics.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('aiAnalytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('aiAnalytics.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('aiAnalytics.totalConversations')}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.totalConversations || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{t('aiAnalytics.allTime')}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('aiAnalytics.avgSatisfaction')}</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.avgSatisfaction || 0} / 5</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('aiAnalytics.fromRatings', { count: conversationStats?.satisfactionCount || 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('aiAnalytics.escalationRate')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.escalationRate || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('aiAnalytics.escalated', { count: conversationStats?.escalated || 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('aiAnalytics.activeAgents')}</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents?.filter(a => a.status === 'active').length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('aiAnalytics.ofTotal', { count: agents?.length || 0 })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('aiAnalytics.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="agents">{t('aiAnalytics.tabs.byAgent')}</TabsTrigger>
            <TabsTrigger value="trends">{t('aiAnalytics.tabs.trends')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('aiAnalytics.recentActivity')}</CardTitle>
                  <CardDescription>{t('aiAnalytics.last7Days')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" name={t('aiAnalytics.conversations')} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('aiAnalytics.satisfactionTrends')}</CardTitle>
                  <CardDescription>{t('aiAnalytics.avgRatingsOverTime')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--secondary))" name={t('aiAnalytics.satisfaction')} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiAnalytics.agentPerformance')}</CardTitle>
                <CardDescription>{t('aiAnalytics.conversationVolumeByAgent')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversations" fill="hsl(var(--primary))" name={t('aiAnalytics.conversations')} />
                    <Bar dataKey="escalations" fill="hsl(var(--destructive))" name={t('aiAnalytics.escalations')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents?.map(agent => (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      {agent.display_name}
                    </CardTitle>
                    <CardDescription>{agent.agent_type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('aiAnalytics.status')}:</span>
                        <span className={agent.status === 'active' ? 'text-green-600' : 'text-muted-foreground'}>
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiAnalytics.longTermTrends')}</CardTitle>
                <CardDescription>{t('aiAnalytics.historicalData')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('aiAnalytics.extendedAnalysisComingSoon')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bot, MessageSquare, TrendingUp, Clock, ThumbsUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AIAnalytics() {
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

  // Group analytics by agent
  const agentPerformance = agents?.map(agent => {
    const agentAnalytics = analyticsData?.filter(a => a.agent_id === agent.id) || [];
    const totalConversations = agentAnalytics.reduce((sum, a) => sum + (a.total_conversations || 0), 0);
    const totalEscalations = agentAnalytics.reduce((sum, a) => sum + (a.escalations || 0), 0);
    const avgResponseTime = agentAnalytics.reduce((sum, a) => sum + (a.average_response_time || 0), 0) / (agentAnalytics.length || 1);

    return {
      name: agent.display_name,
      conversations: totalConversations,
      escalations: totalEscalations,
      avgResponseTime: avgResponseTime.toFixed(2)
    };
  });

  // Prepare time series data
  const timeSeriesData = analyticsData?.slice(-7).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    conversations: d.total_conversations || 0,
    satisfaction: d.average_satisfaction || 0
  })) || [];

  return (
    <AdminDashboardLayout title="AI Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Agent Analytics</h2>
          <p className="text-muted-foreground">
            Performance metrics and insights for AI assistants
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.totalConversations || 0}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">All time</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.avgSatisfaction || 0} / 5</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {conversationStats?.satisfactionCount || 0} ratings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversationStats?.escalationRate || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {conversationStats?.escalated || 0} escalated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents?.filter(a => a.status === 'active').length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of {agents?.length || 0} total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">By Agent</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" name="Conversations" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Trends</CardTitle>
                  <CardDescription>Average ratings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--secondary))" name="Satisfaction" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Conversation volume by AI agent</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversations" fill="hsl(var(--primary))" name="Conversations" />
                    <Bar dataKey="escalations" fill="hsl(var(--destructive))" name="Escalations" />
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
                        <span className="text-muted-foreground">Status:</span>
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
                <CardTitle>Long-term Trends</CardTitle>
                <CardDescription>Historical performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Extended trend analysis coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

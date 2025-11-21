import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Analytics {
  date: string;
  total_conversations: number;
  successful_resolutions: number;
  escalations: number;
  average_satisfaction: number;
}

interface AgentAnalyticsProps {
  agentId: string;
}

export const AgentAnalytics = ({ agentId }: AgentAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [agentId]);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_analytics')
        .select('*')
        .eq('agent_id', agentId)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const totals = analytics.reduce(
    (acc, day) => ({
      conversations: acc.conversations + day.total_conversations,
      resolutions: acc.resolutions + day.successful_resolutions,
      escalations: acc.escalations + day.escalations,
      avgSatisfaction: acc.avgSatisfaction + (day.average_satisfaction || 0)
    }),
    { conversations: 0, resolutions: 0, escalations: 0, avgSatisfaction: 0 }
  );

  const avgSatisfaction = analytics.length > 0
    ? totals.avgSatisfaction / analytics.filter(a => a.average_satisfaction).length
    : 0;

  const successRate = totals.conversations > 0
    ? ((totals.resolutions / totals.conversations) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Analytics & Performance</h3>
        <p className="text-muted-foreground">Last 30 days performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.conversations}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totals.resolutions} successful resolutions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.escalations}</div>
            <p className="text-xs text-muted-foreground">
              Required human intervention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.slice(0, 10).map((day) => (
              <div key={day.date} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.total_conversations} conversations
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    ✓ {day.successful_resolutions}
                  </span>
                  <span className="text-amber-600">
                    ↑ {day.escalations}
                  </span>
                  {day.average_satisfaction > 0 && (
                    <span className="text-blue-600">
                      ★ {day.average_satisfaction.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

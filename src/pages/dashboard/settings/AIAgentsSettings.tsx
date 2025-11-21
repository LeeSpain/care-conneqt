import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, TrendingUp, MessageSquare, Users, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  display_name: string;
  agent_type: string;
  description: string;
  status: string;
  avatar_url: string | null;
}

interface AgentStats {
  conversations_today: number;
  satisfaction_rate: number;
  status: string;
}

export default function AIAgentsSettings() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Record<string, AgentStats>>({});
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    fetchAgents();
    
    return () => {
      fetchInProgress.current = false;
    };
  }, []);

  const fetchAgents = async () => {
    if (fetchInProgress.current) {
      console.log('[AIAgentsSettings] Fetch already in progress, skipping');
      return;
    }
    
    fetchInProgress.current = true;
    
    try {
      const { data: agentsData, error: agentsError } = await supabase
        .from('ai_agents')
        .select('*')
        .order('name');

      if (agentsError) throw agentsError;

      setAgents(agentsData || []);

      // Fetch today's stats
      const today = new Date().toISOString().split('T')[0];
      const { data: analyticsData } = await supabase
        .from('ai_agent_analytics')
        .select('*')
        .eq('date', today);

      const statsMap: Record<string, AgentStats> = {};
      agentsData?.forEach(agent => {
        const agentAnalytics = analyticsData?.find(a => a.agent_id === agent.id);
        statsMap[agent.id] = {
          conversations_today: agentAnalytics?.total_conversations || 0,
          satisfaction_rate: agentAnalytics?.average_satisfaction || 0,
          status: agent.status,
        };
      });
      setStats(statsMap);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load AI agents');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ status: newStatus })
        .eq('id', agentId);

      if (error) throw error;

      toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Failed to update agent status');
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="AI Agents">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const clara = agents.find(a => a.name === 'clara');
  const ineke = agents.find(a => a.name === 'ineke');

  return (
    <AdminDashboardLayout title="AI Agents">
      <div className="space-y-6">
        {/* Overview */}
        <div>
          <h2 className="text-3xl font-bold mb-2">AI Agents Management</h2>
          <p className="text-muted-foreground">
            Configure and monitor your AI assistants Clara (Customer Service) and Ineke (Nurse Support)
          </p>
        </div>

        {/* Clara Card */}
        {clara && (
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {clara.display_name}
                      <Badge variant={clara.status === 'active' ? 'default' : 'secondary'}>
                        {clara.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {clara.description}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toggleAgentStatus(clara.id, clara.status)}
                >
                  {clara.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats[clara.id]?.conversations_today || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversations Today</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats[clara.id]?.satisfaction_rate.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    <Users className="h-6 w-6 mx-auto" />
                  </div>
                  <div className="text-sm text-muted-foreground">Public Facing</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/dashboard/admin/ai-agents/clara">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Clara
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/dashboard/admin/ai-agents/clara/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ineke Card */}
        {ineke && (
          <Card className="border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <HeartPulse className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {ineke.display_name}
                      <Badge variant={ineke.status === 'active' ? 'default' : 'secondary'}>
                        {ineke.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ineke.description}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toggleAgentStatus(ineke.id, ineke.status)}
                >
                  {ineke.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats[ineke.id]?.conversations_today || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversations Today</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats[ineke.id]?.satisfaction_rate.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    <Bot className="h-6 w-6 mx-auto" />
                  </div>
                  <div className="text-sm text-muted-foreground">Nurse Only</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/dashboard/admin/ai-agents/ineke">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Ineke
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/dashboard/admin/ai-agents/ineke/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              About AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Clara</strong> is your customer-facing AI that helps visitors understand your services, 
              answers questions about pricing and packages, and guides them toward booking demos or consultations.
            </p>
            <p>
              <strong>Ineke</strong> is designed specifically for nurses, providing quick access to member data, 
              care protocols, device information, and helping prioritize tasks and alerts efficiently.
            </p>
            <p className="text-xs pt-2">
              Both agents are powered by advanced AI and can be fully customized through their configuration pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

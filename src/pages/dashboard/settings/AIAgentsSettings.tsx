import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, TrendingUp, MessageSquare, Users, HeartPulse, Building2, Brain, LucideIcon } from 'lucide-react';
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

interface AgentConfig {
  icon: LucideIcon;
  iconColor: string;
  bgGradient: string;
  borderHover: string;
  category: string;
  settingsPath: string;
}

const agentConfigs: Record<string, AgentConfig> = {
  'clara': {
    icon: MessageSquare,
    iconColor: 'text-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderHover: 'hover:border-purple-500/50',
    category: 'Sales & Support',
    settingsPath: '/dashboard/admin/ai-agents/clara',
  },
  'clara-member': {
    icon: Users,
    iconColor: 'text-violet-500',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    borderHover: 'hover:border-violet-500/50',
    category: 'Member Support',
    settingsPath: '/dashboard/admin/ai-agents/clara-member',
  },
  'clara-family': {
    icon: Users,
    iconColor: 'text-fuchsia-500',
    bgGradient: 'from-fuchsia-500/20 to-pink-500/20',
    borderHover: 'hover:border-fuchsia-500/50',
    category: 'Family Support',
    settingsPath: '/dashboard/admin/ai-agents/clara-family',
  },
  'ineke': {
    icon: HeartPulse,
    iconColor: 'text-emerald-500',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    borderHover: 'hover:border-emerald-500/50',
    category: 'Clinical Support',
    settingsPath: '/dashboard/admin/ai-agents/ineke',
  },
  'isabella': {
    icon: Building2,
    iconColor: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderHover: 'hover:border-blue-500/50',
    category: 'Facility Management',
    settingsPath: '/dashboard/admin/ai-agents/isabella',
  },
  'lee-the-brain': {
    icon: Brain,
    iconColor: 'text-amber-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    borderHover: 'hover:border-amber-500/50',
    category: 'Super Admin',
    settingsPath: '/dashboard/admin/ai-agents/lee',
  },
};

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
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      const { data: agentsData, error: agentsError } = await supabase
        .from('ai_agents')
        .select('*')
        .order('name');

      if (agentsError) throw agentsError;
      setAgents(agentsData || []);

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

  const renderAgentCard = (agent: Agent) => {
    const config = agentConfigs[agent.name];
    if (!config) return null;

    const Icon = config.icon;
    const agentStats = stats[agent.id];

    return (
      <Card key={agent.id} className={`border-2 transition-all ${config.borderHover}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${config.bgGradient}`}>
                <Icon className={`h-8 w-8 ${config.iconColor}`} />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {agent.display_name}
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {agent.description}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => toggleAgentStatus(agent.id, agent.status)}
            >
              {agent.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {agentStats?.conversations_today || 0}
              </div>
              <div className="text-sm text-muted-foreground">Conversations Today</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {(agentStats?.satisfaction_rate || 0).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <div className={`text-2xl font-bold ${config.iconColor}`}>
                <Icon className="h-6 w-6 mx-auto" />
              </div>
              <div className="text-sm text-muted-foreground">{config.category}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link to={config.settingsPath}>
                <Settings className="h-4 w-4 mr-2" />
                Configure {agent.display_name}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to={`${config.settingsPath}/analytics`}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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

  // Group agents by category
  const salesAgents = agents.filter(a => a.name === 'clara');
  const memberAgents = agents.filter(a => ['clara-member', 'clara-family'].includes(a.name));
  const clinicalAgents = agents.filter(a => a.name === 'ineke');
  const managementAgents = agents.filter(a => ['isabella', 'lee-the-brain'].includes(a.name));

  return (
    <AdminDashboardLayout title="AI Agents">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">AI Agents Management</h2>
            <p className="text-muted-foreground">
              Configure and monitor all AI assistants across the platform
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {agents.filter(a => a.status === 'active').length} Active Agents
          </Badge>
        </div>

        {/* Sales & Support Section */}
        {salesAgents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
              <h3 className="text-xl font-semibold">Sales & Support</h3>
              <Badge variant="secondary" className="text-xs">Public Facing</Badge>
            </div>
            <div className="space-y-4">
              {salesAgents.map(renderAgentCard)}
            </div>
          </section>
        )}

        {/* Member & Family Support Section */}
        {memberAgents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              <h3 className="text-xl font-semibold">Member & Family Support</h3>
              <Badge variant="secondary" className="text-xs">Personal Companions</Badge>
            </div>
            <div className="space-y-4">
              {memberAgents.map(renderAgentCard)}
            </div>
          </section>
        )}

        {/* Clinical Support Section */}
        {clinicalAgents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
              <h3 className="text-xl font-semibold">Clinical Support</h3>
              <Badge variant="secondary" className="text-xs">Nurse Dashboard</Badge>
            </div>
            <div className="space-y-4">
              {clinicalAgents.map(renderAgentCard)}
            </div>
          </section>
        )}

        {/* Management & Admin Section */}
        {managementAgents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-amber-500" />
              <h3 className="text-xl font-semibold">Management & Admin</h3>
              <Badge variant="secondary" className="text-xs">Admin Tools</Badge>
            </div>
            <div className="space-y-4">
              {managementAgents.map(renderAgentCard)}
            </div>
          </section>
        )}

        {/* Help Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              About AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 mt-0.5">
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">Clara (Sales)</div>
                <div className="text-xs text-muted-foreground">Customer-facing AI for website visitors</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/20 mt-0.5">
                <Users className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <div className="font-medium">Clara (Member)</div>
                <div className="text-xs text-muted-foreground">Personal companion with medical handoff</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-fuchsia-500/20 mt-0.5">
                <Users className="h-4 w-4 text-fuchsia-500" />
              </div>
              <div>
                <div className="font-medium">Clara (Family)</div>
                <div className="text-xs text-muted-foreground">Support for family carers</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 mt-0.5">
                <HeartPulse className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <div className="font-medium">Ineke</div>
                <div className="text-xs text-muted-foreground">Nurse support AI with clinical expertise</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 mt-0.5">
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="font-medium">Isabella</div>
                <div className="text-xs text-muted-foreground">Facility & company management</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 mt-0.5">
                <Brain className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <div className="font-medium">LEE The Brain</div>
                <div className="text-xs text-muted-foreground">Master AI with full system access</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, TrendingUp, MessageSquare, Users, HeartPulse, Building2, Brain, Plus, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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
}

interface AgentConfig {
  icon: LucideIcon;
  iconColor: string;
  bgGradient: string;
  borderHover: string;
  section: 'sales' | 'companion' | 'clinical' | 'management';
  settingsPath: string;
}

const agentConfigs: Record<string, AgentConfig> = {
  'clara': {
    icon: MessageSquare,
    iconColor: 'text-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderHover: 'hover:border-purple-500/40',
    section: 'sales',
    settingsPath: '/dashboard/admin/ai-agents/clara',
  },
  'clara-member': {
    icon: Users,
    iconColor: 'text-violet-500',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    borderHover: 'hover:border-violet-500/40',
    section: 'companion',
    settingsPath: '/dashboard/admin/ai-agents/clara-member',
  },
  'clara-family': {
    icon: Users,
    iconColor: 'text-fuchsia-500',
    bgGradient: 'from-fuchsia-500/20 to-pink-500/20',
    borderHover: 'hover:border-fuchsia-500/40',
    section: 'companion',
    settingsPath: '/dashboard/admin/ai-agents/clara-family',
  },
  'ineke': {
    icon: HeartPulse,
    iconColor: 'text-emerald-500',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    borderHover: 'hover:border-emerald-500/40',
    section: 'clinical',
    settingsPath: '/dashboard/admin/ai-agents/ineke',
  },
  'isabella': {
    icon: Building2,
    iconColor: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    borderHover: 'hover:border-blue-500/40',
    section: 'management',
    settingsPath: '/dashboard/admin/ai-agents/isabella',
  },
  'lee-the-brain': {
    icon: Brain,
    iconColor: 'text-white',
    bgGradient: 'bg-secondary',
    borderHover: 'hover:border-secondary/60',
    section: 'management',
    settingsPath: '/dashboard/admin/ai-agents/lee',
  },
};

export default function AIAgentsSettings() {
  const { t } = useTranslation('dashboard-admin');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Record<string, AgentStats>>({});
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  const sections = {
    sales: { title: t('aiAgents.sections.sales'), badge: t('aiAgents.sections.salesBadge'), gradient: 'from-purple-500 to-pink-500' },
    companion: { title: t('aiAgents.sections.companion'), badge: t('aiAgents.sections.companionBadge'), gradient: 'from-violet-500 to-fuchsia-500' },
    clinical: { title: t('aiAgents.sections.clinical'), badge: t('aiAgents.sections.clinicalBadge'), gradient: 'from-emerald-500 to-teal-500' },
    management: { title: t('aiAgents.sections.management'), badge: t('aiAgents.sections.managementBadge'), gradient: 'from-blue-500 to-amber-500' },
  };

  useEffect(() => {
    fetchAgents();
    return () => { fetchInProgress.current = false; };
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
        };
      });
      setStats(statsMap);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error(t('aiAgents.failedToLoad'));
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
      toast.success(newStatus === 'active' ? t('aiAgents.agentActivated') : t('aiAgents.agentDeactivated'));
      fetchAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error(t('aiAgents.failedToUpdate'));
    }
  };

  const AgentCard = ({ agent }: { agent: Agent }) => {
    const config = agentConfigs[agent.name];
    if (!config) return null;

    const Icon = config.icon;
    const agentStats = stats[agent.id];

    return (
      <Card className={`border transition-all ${config.borderHover} overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-lg shrink-0 ${config.bgGradient.startsWith('from-') ? `bg-gradient-to-br ${config.bgGradient}` : config.bgGradient}`}>
              <Icon className={`h-4 w-4 ${config.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{agent.display_name}</h3>
                <Badge 
                  variant={agent.status === 'active' ? 'default' : 'secondary'}
                  className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                >
                  {agent.status}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem]">
            {agent.description}
          </p>

          <div className="flex items-center gap-4 text-xs mb-3 py-2 px-3 rounded-md bg-muted/50">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{agentStats?.conversations_today || 0}</span>
              <span className="text-muted-foreground">{t('aiAgents.today')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{(agentStats?.satisfaction_rate || 0).toFixed(1)}</span>
              <span className="text-muted-foreground">{t('aiAgents.rating')}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild size="sm" className="h-8 text-xs flex-1">
              <Link to={config.settingsPath}>
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                {t('aiAgents.configure')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs flex-1">
              <Link to={`${config.settingsPath}/analytics`}>
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                {t('aiAgents.analytics')}
              </Link>
            </Button>
            <Button 
              variant={agent.status === 'active' ? 'ghost' : 'secondary'}
              size="sm" 
              className="h-8 text-xs px-3 shrink-0"
              onClick={() => toggleAgentStatus(agent.id, agent.status)}
            >
              {agent.status === 'active' ? t('aiAgents.disable') : t('aiAgents.enable')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const Section = ({ sectionKey, agents: sectionAgents }: { sectionKey: keyof typeof sections; agents: Agent[] }) => {
    if (sectionAgents.length === 0) return null;
    const section = sections[sectionKey];

    return (
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-6 w-1 rounded-full bg-gradient-to-b ${section.gradient}`} />
          <h3 className="font-semibold">{section.title}</h3>
          <Badge variant="secondary" className="text-[10px]">{section.badge}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sectionAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <AdminDashboardLayout title={t('aiAgents.title')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const groupedAgents = {
    sales: agents.filter(a => agentConfigs[a.name]?.section === 'sales'),
    companion: agents.filter(a => agentConfigs[a.name]?.section === 'companion'),
    clinical: agents.filter(a => agentConfigs[a.name]?.section === 'clinical'),
    management: agents.filter(a => agentConfigs[a.name]?.section === 'management'),
  };

  return (
    <AdminDashboardLayout title={t('aiAgents.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('aiAgents.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('aiAgents.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {agents.filter(a => a.status === 'active').length} {t('aiAgents.active')}
            </Badge>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              <Plus className="h-3 w-3 mr-1" />
              {t('aiAgents.addAgent')}
            </Button>
          </div>
        </div>

        <Section sectionKey="sales" agents={groupedAgents.sales} />
        <Section sectionKey="companion" agents={groupedAgents.companion} />
        <Section sectionKey="clinical" agents={groupedAgents.clinical} />
        <Section sectionKey="management" agents={groupedAgents.management} />

        <Card className="bg-muted/30">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4" />
              {t('aiAgents.agentReference')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              {Object.entries(agentConfigs).map(([name, config]) => {
                const agent = agents.find(a => a.name === name);
                const Icon = config.icon;
                return (
                  <div key={name} className="flex items-center gap-2 p-2 rounded bg-background/50">
                    <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
                    <span className="font-medium">{agent?.display_name || name}</span>
                    <span className="text-muted-foreground ml-auto">{sections[config.section].badge}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
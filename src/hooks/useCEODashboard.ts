import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CEODashboardStats {
  // Revenue
  mrr: number;
  arr: number;
  mrrChange: number;
  // Alerts
  criticalAlerts: number;
  pendingAlerts: number;
  // Recent Activity
  recentLeads: Array<{ id: string; name: string; source: string; created_at: string }>;
  recentOrders: Array<{ id: string; customer_name: string; total: number; created_at: string }>;
  recentSignups: Array<{ id: string; name: string; email: string; created_at: string }>;
  // AI Activity
  todayConversations: number;
  avgSatisfaction: number;
  totalEscalations: number;
}

export function useCEODashboard() {
  return useQuery({
    queryKey: ['ceo-dashboard'],
    queryFn: async (): Promise<CEODashboardStats> => {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch active subscriptions for MRR
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('monthly_amount')
        .eq('status', 'active');

      // Fetch orders for additional MRR
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_monthly, payment_status, customer_name, created_at')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch critical alerts
      const { count: alertCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['new', 'acknowledged'])
        .eq('priority', 'critical');

      // Fetch pending alerts
      const { count: pendingCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['new', 'acknowledged']);

      // Fetch recent leads (leads table has 'name' column, not first_name/last_name)
      const { data: leads } = await supabase
        .from('leads')
        .select('id, name, source_page, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent signups
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch AI analytics for today
      const { data: aiAnalytics } = await supabase
        .from('ai_agent_analytics')
        .select('total_conversations, average_satisfaction, escalations')
        .gte('date', today);

      // Calculate MRR
      const subscriptionMrr = subscriptions?.reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;
      const ordersMrr = orders?.reduce((sum, o) => sum + Number(o.total_monthly || 0), 0) || 0;
      const mrr = subscriptionMrr + ordersMrr;

      // Calculate AI stats
      const todayConversations = aiAnalytics?.reduce((sum, a) => sum + (a.total_conversations || 0), 0) || 0;
      const totalSatisfaction = aiAnalytics?.reduce((sum, a) => sum + (a.average_satisfaction || 0), 0) || 0;
      const avgSatisfaction = aiAnalytics?.length ? totalSatisfaction / aiAnalytics.length : 0;
      const totalEscalations = aiAnalytics?.reduce((sum, a) => sum + (a.escalations || 0), 0) || 0;

      return {
        mrr,
        arr: mrr * 12,
        mrrChange: 0,
        criticalAlerts: alertCount || 0,
        pendingAlerts: pendingCount || 0,
        recentLeads: leads?.map(l => ({
          id: l.id,
          name: l.name || 'Unknown',
          source: l.source_page || 'direct',
          created_at: l.created_at
        })) || [],
        recentOrders: orders?.map(o => ({
          id: o.id,
          customer_name: o.customer_name || 'Unknown',
          total: Number(o.total_monthly || 0),
          created_at: o.created_at
        })) || [],
        recentSignups: profiles?.map(p => ({
          id: p.id,
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
          email: p.email || '',
          created_at: p.created_at || ''
        })) || [],
        todayConversations,
        avgSatisfaction,
        totalEscalations
      };
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

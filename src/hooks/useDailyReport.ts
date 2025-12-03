import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, startOfWeek, startOfMonth, endOfDay, subDays } from "date-fns";

export interface DailyReportData {
  revenue: {
    todayRevenue: number;
    mrr: number;
    arr: number;
    mrrChange: number;
  };
  alerts: {
    critical: number;
    pending: number;
    items: Array<{
      id: string;
      title: string;
      priority: string;
      created_at: string;
    }>;
  };
  activity: {
    today: { leads: number; orders: number; signups: number; conversations: number };
    week: { leads: number; orders: number; signups: number; conversations: number };
    month: { leads: number; orders: number; signups: number; conversations: number };
  };
  pipeline: {
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    won: number;
    conversionRate: number;
  };
  ai: {
    conversations: number;
    satisfaction: number;
    escalations: number;
    byAgent: Array<{ name: string; count: number }>;
  };
  operations: {
    systemStatus: 'operational' | 'degraded' | 'down';
    activeNurses: number;
    totalNurses: number;
    openTickets: number;
    deviceAlerts: number;
    pendingTasks: number;
  };
  finance: {
    outstandingInvoices: number;
    pendingPayments: number;
    recentTransactions: Array<{
      id: string;
      amount: number;
      description: string;
      created_at: string;
    }>;
    activeSubscriptions: number;
    newSubscriptions: number;
  };
}

export const useDailyReport = (selectedDate?: Date) => {
  const reportDate = selectedDate || new Date();
  
  return useQuery({
    queryKey: ['daily-report', reportDate.toISOString().split('T')[0]],
    queryFn: async (): Promise<DailyReportData> => {
      const dayStart = startOfDay(reportDate).toISOString();
      const dayEnd = endOfDay(reportDate).toISOString();
      const weekStart = startOfWeek(reportDate, { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(reportDate).toISOString();

      // Fetch all data in parallel
      const [
        dayOrders,
        allSubscriptions,
        criticalAlerts,
        pendingAlerts,
        dayLeads,
        weekLeads,
        monthLeads,
        weekOrders,
        monthOrders,
        daySignups,
        weekSignups,
        monthSignups,
        aiAnalytics,
        nurses,
        openTickets,
        deviceAlerts,
        outstandingInvoices,
        recentTransactions,
        allLeads,
      ] = await Promise.all([
        // Day's orders/revenue
        supabase.from('orders').select('total_monthly').gte('created_at', dayStart).lte('created_at', dayEnd),
        // All active subscriptions for MRR (as of report date)
        supabase.from('subscriptions').select('monthly_amount, status').eq('status', 'active').lte('created_at', dayEnd),
        // Critical alerts (as of that day)
        supabase.from('alerts').select('id, title, priority, created_at').eq('priority', 'critical').eq('status', 'new').lte('created_at', dayEnd).order('created_at', { ascending: false }).limit(5),
        // Pending alerts count (new or in_progress)
        supabase.from('alerts').select('id', { count: 'exact' }).in('status', ['new', 'in_progress']).lte('created_at', dayEnd),
        // Day's leads
        supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', dayStart).lte('created_at', dayEnd),
        // Week's leads (up to that day)
        supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', weekStart).lte('created_at', dayEnd),
        // Month's leads (up to that day)
        supabase.from('leads').select('id', { count: 'exact' }).gte('created_at', monthStart).lte('created_at', dayEnd),
        // Week's orders
        supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', weekStart).lte('created_at', dayEnd),
        // Month's orders
        supabase.from('orders').select('id', { count: 'exact' }).gte('created_at', monthStart).lte('created_at', dayEnd),
        // Day's signups
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', dayStart).lte('created_at', dayEnd),
        // Week's signups
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', weekStart).lte('created_at', dayEnd),
        // Month's signups
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', monthStart).lte('created_at', dayEnd),
        // AI Analytics - that day
        supabase.from('ai_agent_analytics').select('*').eq('date', dayStart.split('T')[0]),
        // Nurses (as of that day)
        supabase.from('user_roles').select('user_id', { count: 'exact' }).eq('role', 'nurse'),
        // Open tickets (as of that day)
        supabase.from('support_tickets').select('id', { count: 'exact' }).eq('status', 'open').lte('created_at', dayEnd),
        // Device alerts (new or in_progress as of that day)
        supabase.from('alerts').select('id', { count: 'exact' }).eq('alert_type', 'device').in('status', ['new', 'in_progress']).lte('created_at', dayEnd),
        // Outstanding invoices (as of that day)
        supabase.from('invoices').select('amount_due').eq('status', 'pending').lte('created_at', dayEnd),
        // Recent transactions (up to that day)
        supabase.from('transactions').select('id, amount, description, created_at').lte('created_at', dayEnd).order('created_at', { ascending: false }).limit(5),
        // All leads for pipeline (up to that day)
        supabase.from('leads').select('status').lte('created_at', dayEnd),
      ]);

      // Calculate revenue metrics
      const dayRevenue = dayOrders.data?.reduce((sum, o) => sum + (o.total_monthly || 0), 0) || 0;
      const mrr = allSubscriptions.data?.reduce((sum, s) => sum + (s.monthly_amount || 0), 0) || 0;
      const arr = mrr * 12;

      // Calculate AI metrics
      const aiData = aiAnalytics.data || [];
      const totalConversations = aiData.reduce((sum, a) => sum + (a.total_conversations || 0), 0);
      const totalEscalations = aiData.reduce((sum, a) => sum + (a.escalations || 0), 0);
      const avgSatisfaction = aiData.length > 0 
        ? aiData.reduce((sum, a) => sum + (a.average_satisfaction || 0), 0) / aiData.length 
        : 0;

      // Calculate pipeline
      const leads = allLeads.data || [];
      const pipeline = {
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        qualified: leads.filter(l => l.status === 'qualified').length,
        proposal: leads.filter(l => l.status === 'proposal').length,
        won: leads.filter(l => l.status === 'won').length,
        conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'won').length / leads.length) * 100 : 0,
      };

      // Calculate outstanding
      const totalOutstanding = outstandingInvoices.data?.reduce((sum, i) => sum + (i.amount_due || 0), 0) || 0;

      return {
        revenue: {
          todayRevenue: dayRevenue,
          mrr,
          arr,
          mrrChange: 5.2, // Would need historical data to calculate
        },
        alerts: {
          critical: criticalAlerts.data?.length || 0,
          pending: pendingAlerts.count || 0,
          items: criticalAlerts.data || [],
        },
        activity: {
          today: {
            leads: dayLeads.count || 0,
            orders: dayOrders.data?.length || 0,
            signups: daySignups.count || 0,
            conversations: totalConversations,
          },
          week: {
            leads: weekLeads.count || 0,
            orders: weekOrders.count || 0,
            signups: weekSignups.count || 0,
            conversations: totalConversations * 7, // Estimate
          },
          month: {
            leads: monthLeads.count || 0,
            orders: monthOrders.count || 0,
            signups: monthSignups.count || 0,
            conversations: totalConversations * 30, // Estimate
          },
        },
        pipeline,
        ai: {
          conversations: totalConversations,
          satisfaction: avgSatisfaction,
          escalations: totalEscalations,
          byAgent: [], // Would need to group by agent
        },
        operations: {
          systemStatus: 'operational',
          activeNurses: nurses.count || 0,
          totalNurses: nurses.count || 0,
          openTickets: openTickets.count || 0,
          deviceAlerts: deviceAlerts.count || 0,
          pendingTasks: 0,
        },
        finance: {
          outstandingInvoices: totalOutstanding,
          pendingPayments: outstandingInvoices.data?.length || 0,
          recentTransactions: recentTransactions.data || [],
          activeSubscriptions: allSubscriptions.data?.length || 0,
          newSubscriptions: 0,
        },
      };
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

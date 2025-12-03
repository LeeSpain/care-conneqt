import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CustomerType = 'member' | 'facility' | 'care_company' | 'insurance_company';

export interface RevenueStats {
  mrr: number;
  arr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalCredits: number;
  activeCredits: number;
  // By customer type
  memberMrr: number;
  facilityMrr: number;
  companyMrr: number;
  insuranceMrr: number;
}

export function useRevenueStats() {
  return useQuery({
    queryKey: ['finance-revenue-stats'],
    queryFn: async (): Promise<RevenueStats> => {
      // Fetch subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('monthly_amount, status, customer_type')
        .eq('status', 'active');

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total, status');

      // Fetch transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, status, transaction_type');

      // Fetch credits
      const { data: credits } = await supabase
        .from('credits')
        .select('amount, remaining_amount, status');

      // Also get revenue from orders (existing data)
      const { data: orders } = await supabase
        .from('orders')
        .select('total_monthly, payment_status')
        .eq('payment_status', 'completed');

      const activeSubscriptionsMrr = subscriptions?.reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;
      const ordersMrr = orders?.reduce((sum, o) => sum + Number(o.total_monthly || 0), 0) || 0;
      const mrr = activeSubscriptionsMrr + ordersMrr;

      // Calculate MRR by customer type
      const memberMrr = subscriptions?.filter(s => s.customer_type === 'member' || !s.customer_type)
        .reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;
      const facilityMrr = subscriptions?.filter(s => s.customer_type === 'facility')
        .reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;
      const companyMrr = subscriptions?.filter(s => s.customer_type === 'care_company')
        .reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;
      const insuranceMrr = subscriptions?.filter(s => s.customer_type === 'insurance_company')
        .reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0) || 0;

      return {
        mrr,
        arr: mrr * 12,
        totalRevenue: invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total || 0), 0) || ordersMrr,
        activeSubscriptions: (subscriptions?.length || 0) + (orders?.length || 0),
        totalInvoices: invoices?.length || 0,
        paidInvoices: invoices?.filter(i => i.status === 'paid').length || 0,
        pendingInvoices: invoices?.filter(i => i.status === 'pending').length || 0,
        overdueInvoices: invoices?.filter(i => i.status === 'overdue').length || 0,
        totalTransactions: transactions?.length || 0,
        successfulTransactions: transactions?.filter(t => t.status === 'completed').length || 0,
        failedTransactions: transactions?.filter(t => t.status === 'failed').length || 0,
        totalCredits: credits?.reduce((sum, c) => sum + Number(c.amount || 0), 0) || 0,
        activeCredits: credits?.filter(c => c.status === 'active').reduce((sum, c) => sum + Number(c.remaining_amount || 0), 0) || 0,
        memberMrr: memberMrr + ordersMrr,
        facilityMrr,
        companyMrr,
        insuranceMrr,
      };
    }
  });
}

export function useSubscriptions(filters?: { status?: string; customerType?: CustomerType }) {
  return useQuery({
    queryKey: ['finance-subscriptions', filters],
    queryFn: async () => {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          members (
            id,
            profiles (first_name, last_name, email)
          ),
          facilities (id, name, email),
          care_companies (id, name, email),
          insurance_companies (id, name, email),
          pricing_plans (slug),
          subscription_items (*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerType) {
        query = query.eq('customer_type', filters.customerType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

export function useInvoices(filters?: { status?: string; customerType?: CustomerType }) {
  return useQuery({
    queryKey: ['finance-invoices', filters],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          members (
            id,
            profiles (first_name, last_name, email)
          ),
          facilities (id, name, email),
          care_companies (id, name, email),
          insurance_companies (id, name, email),
          invoice_items (*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerType) {
        query = query.eq('customer_type', filters.customerType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

export function useTransactions(filters?: { type?: string; status?: string; customerType?: CustomerType }) {
  return useQuery({
    queryKey: ['finance-transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          members (
            id,
            profiles (first_name, last_name, email)
          ),
          facilities (id, name, email),
          care_companies (id, name, email),
          insurance_companies (id, name, email),
          invoices (invoice_number)
        `)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('transaction_type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerType) {
        query = query.eq('customer_type', filters.customerType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

export function useCredits(filters?: { status?: string; customerType?: CustomerType }) {
  return useQuery({
    queryKey: ['finance-credits', filters],
    queryFn: async () => {
      let query = supabase
        .from('credits')
        .select(`
          *,
          members (
            id,
            profiles (first_name, last_name, email)
          ),
          facilities (id, name, email),
          care_companies (id, name, email),
          insurance_companies (id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.customerType) {
        query = query.eq('customer_type', filters.customerType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

export function useRevenueSnapshots(periodType: 'daily' | 'monthly' = 'monthly', limit: number = 12) {
  return useQuery({
    queryKey: ['finance-revenue-snapshots', periodType, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_snapshots')
        .select('*')
        .eq('period_type', periodType)
        .order('snapshot_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.reverse() || [];
    }
  });
}

// Helper function to get customer display name
export function getCustomerName(record: any): string {
  const customerType = record.customer_type || 'member';
  
  switch (customerType) {
    case 'facility':
      return record.facilities?.name || 'Unknown Facility';
    case 'care_company':
      return record.care_companies?.name || 'Unknown Company';
    case 'insurance_company':
      return record.insurance_companies?.name || 'Unknown Insurance';
    default:
      const profile = record.members?.profiles;
      if (profile) {
        return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Member';
      }
      return 'Unknown Member';
  }
}

export function getCustomerEmail(record: any): string {
  const customerType = record.customer_type || 'member';
  
  switch (customerType) {
    case 'facility':
      return record.facilities?.email || '';
    case 'care_company':
      return record.care_companies?.email || '';
    case 'insurance_company':
      return record.insurance_companies?.email || '';
    default:
      return record.members?.profiles?.email || '';
  }
}

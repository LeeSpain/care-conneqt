import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];
type LeadActivity = Database['public']['Tables']['lead_activities']['Row'];
type LeadActivityInsert = Database['public']['Tables']['lead_activities']['Insert'];

export type { Lead, LeadInsert, LeadUpdate, LeadActivity, LeadActivityInsert };

export interface LeadFilters {
  search?: string;
  status?: string;
  lead_type?: string;
  source_page?: string;
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
}

export interface LeadStats {
  total_leads: number;
  new_today: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  by_source: Record<string, number>;
  conversion_rate: number;
}

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.lead_type) {
        query = query.eq('lead_type', filters.lead_type);
      }

      if (filters?.source_page) {
        query = query.eq('source_page', filters.source_page);
      }

      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Lead[];
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const [leadResult, activitiesResult] = await Promise.all([
        supabase.from('leads').select('*').eq('id', id).single(),
        supabase
          .from('lead_activities')
          .select('*')
          .eq('lead_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (leadResult.error) throw leadResult.error;
      if (activitiesResult.error) throw activitiesResult.error;

      return {
        lead: leadResult.data as Lead,
        activities: activitiesResult.data as LeadActivity[],
      };
    },
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status, lead_type, source_page, created_at, converted_at');

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const newToday = leads.filter(l => l.created_at?.startsWith(today)).length;

      const byStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byType = leads.reduce((acc, lead) => {
        const type = lead.lead_type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const bySource = leads.reduce((acc, lead) => {
        const source = lead.source_page || 'unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const converted = leads.filter(l => l.converted_at).length;
      const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0;

      return {
        total_leads: leads.length,
        new_today: newToday,
        by_status: byStatus,
        by_type: byType,
        by_source: bySource,
        conversion_rate: conversionRate,
      } as LeadStats;
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: LeadInsert) => {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead created successfully');
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: LeadUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead updated successfully');
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      toast.success('Lead deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    },
  });
}

export function useAddLeadActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: LeadActivityInsert) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const activityWithUser: LeadActivityInsert = {
        ...activity,
        created_by: userData.user?.id || null,
      };
      
      const { data, error } = await supabase
        .from('lead_activities')
        .insert(activityWithUser)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.lead_id) {
        queryClient.invalidateQueries({ queryKey: ['lead', variables.lead_id] });
      }
      toast.success('Activity added successfully');
    },
    onError: (error) => {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    },
  });
}

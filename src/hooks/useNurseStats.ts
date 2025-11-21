import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NurseStats {
  assignedMembers: number;
  pendingTasks: number;
  activeAlerts: number;
  unreadMessages: number;
}

interface NurseTask {
  id: string;
  title: string;
  task_type: string;
  priority: string;
  status: string;
  due_date: string | null;
  member_id: string;
  created_at: string;
}

interface NurseData {
  stats: NurseStats;
  recentTasks: NurseTask[];
}

async function fetchNurseData(userId: string): Promise<NurseData> {
  // Fetch stats in parallel
  const statsPromises = [
    supabase
      .from('nurse_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('nurse_id', userId),
    supabase
      .from('nurse_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('nurse_id', userId)
      .eq('status', 'pending'),
    supabase
      .from('care_messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false)
  ];

  const [membersResult, tasksResult, messagesResult] = await Promise.all(statsPromises);

  if (membersResult.error) throw membersResult.error;
  if (tasksResult.error) throw tasksResult.error;
  if (messagesResult.error) throw messagesResult.error;

  // Get member IDs for alerts query
  const { data: assignmentsData } = await supabase
    .from('nurse_assignments')
    .select('member_id')
    .eq('nurse_id', userId);

  const memberIds = assignmentsData?.map(a => a.member_id) || [];

  // Fetch alerts count
  let alertsCount = 0;
  if (memberIds.length > 0) {
    const { count } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .in('member_id', memberIds)
      .eq('status', 'new');
    alertsCount = count || 0;
  }

  // Fetch recent tasks
  const { data: tasksData } = await supabase
    .from('nurse_tasks')
    .select('*')
    .eq('nurse_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    stats: {
      assignedMembers: membersResult.count || 0,
      pendingTasks: tasksResult.count || 0,
      activeAlerts: alertsCount,
      unreadMessages: messagesResult.count || 0,
    },
    recentTasks: tasksData || [],
  };
}

export function useNurseData(userId: string | undefined) {
  return useQuery({
    queryKey: ['nurse-data', userId],
    queryFn: () => fetchNurseData(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds for responsive updates
    gcTime: 2 * 60 * 1000, // 2 minutes cache retention
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 60 * 1000, // Auto-refetch every minute
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1s between retries
  });
}

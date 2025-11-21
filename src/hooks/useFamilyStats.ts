import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FamilyStats {
  connectedMembers: number;
  activeAlerts: number;
  upcomingAppointments: number;
  unreadMessages: number;
}

async function fetchFamilyStats(userId: string): Promise<FamilyStats> {
  const { data: carerData, error: carerError } = await supabase
    .from("family_carers")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (carerError) throw carerError;
  if (!carerData) throw new Error("No family carer profile found");

  // Fetch member IDs
  const { data: memberCarerData, error: memberCarerError } = await supabase
    .from("member_carers")
    .select("member_id")
    .eq("carer_id", carerData.id);

  if (memberCarerError) throw memberCarerError;

  const memberIds = memberCarerData?.map(mc => mc.member_id) || [];

  // Fetch stats in parallel
  const [membersResult, messagesResult] = await Promise.all([
    Promise.resolve({ count: memberIds.length }),
    supabase
      .from("care_messages")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("is_read", false),
  ]);

  if (messagesResult.error) throw messagesResult.error;

  // Get alerts for member IDs
  let alertsCount = 0;
  if (memberIds.length > 0) {
    const { count } = await supabase
      .from("alerts")
      .select("id", { count: "exact", head: true })
      .in("member_id", memberIds)
      .eq("status", "new");
    alertsCount = count || 0;
  }

  return {
    connectedMembers: membersResult.count,
    activeAlerts: alertsCount,
    upcomingAppointments: 0, // Placeholder
    unreadMessages: messagesResult.count || 0,
  };
}

export function useFamilyStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['family-stats', userId],
    queryFn: () => fetchFamilyStats(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

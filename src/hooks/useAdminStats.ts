import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  totalFacilities: number;
  activeMembers: number;
  totalNurses: number;
}

async function fetchAdminStats(): Promise<AdminStats> {
  const [usersResult, facilitiesResult, membersResult, nursesResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("facilities").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "nurse"),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (facilitiesResult.error) throw facilitiesResult.error;
  if (membersResult.error) throw membersResult.error;
  if (nursesResult.error) throw nursesResult.error;

  return {
    totalUsers: usersResult.count || 0,
    totalFacilities: facilitiesResult.count || 0,
    activeMembers: membersResult.count || 0,
    totalNurses: nursesResult.count || 0,
  };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

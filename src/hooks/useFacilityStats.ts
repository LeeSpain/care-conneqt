import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FacilityStats {
  totalResidents: number;
  occupancyRate: number;
  staffCount: number;
  activeAlerts: number;
  facilityInfo: any;
}

async function fetchFacilityStats(userId: string): Promise<FacilityStats> {
  // Get facility staff record to find facility ID
  const { data: staffData, error: staffError } = await supabase
    .from("facility_staff")
    .select("facility_id, facilities(*)")
    .eq("user_id", userId)
    .maybeSingle();

  if (staffError) throw staffError;
  if (!staffData) throw new Error("No facility staff profile found");

  const facilityId = staffData.facility_id;
  
  // Fetch stats in parallel
  const [residentsResult, staffResult, alertsResult] = await Promise.all([
    supabase
      .from("facility_residents")
      .select("id", { count: "exact", head: true })
      .eq("facility_id", facilityId)
      .is("discharge_date", null),
    supabase
      .from("facility_staff")
      .select("id", { count: "exact", head: true })
      .eq("facility_id", facilityId),
    supabase
      .from("facility_residents")
      .select("member_id")
      .eq("facility_id", facilityId)
      .is("discharge_date", null)
  ]);

  if (residentsResult.error) throw residentsResult.error;
  if (staffResult.error) throw staffResult.error;
  if (alertsResult.error) throw alertsResult.error;

  // Get alerts count for resident members
  const memberIds = alertsResult.data?.map(r => r.member_id) || [];
  let alertsCount = 0;
  
  if (memberIds.length > 0) {
    const { count } = await supabase
      .from("alerts")
      .select("id", { count: "exact", head: true })
      .in("member_id", memberIds)
      .eq("status", "new");
    alertsCount = count || 0;
  }

  const totalBeds = staffData.facilities?.bed_capacity || 0;
  const occupiedBeds = residentsResult.count || 0;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return {
    totalResidents: residentsResult.count || 0,
    occupancyRate,
    staffCount: staffResult.count || 0,
    activeAlerts: alertsCount,
    facilityInfo: staffData.facilities,
  };
}

export function useFacilityStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['facility-stats', userId],
    queryFn: () => fetchFacilityStats(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

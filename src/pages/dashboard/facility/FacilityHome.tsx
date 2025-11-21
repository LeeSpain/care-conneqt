import { useEffect, useState } from "react";
import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Bed, UserCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function FacilityHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalResidents: 0,
    occupancyRate: 0,
    staffCount: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityInfo, setFacilityInfo] = useState<any>(null);

  const fetchFacilityData = async () => {
    const startTime = performance.now();
    console.log('[FacilityHome] Starting data fetch for user:', user?.id);

    try {
      // Get facility staff record to find facility ID
      const { data: staffData, error: staffError } = await supabase
        .from("facility_staff")
        .select("facility_id, facilities(*)")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (staffError) {
        console.error("[FacilityHome] Staff query error:", {
          message: staffError.message,
          details: staffError.details,
          hint: staffError.hint,
          code: staffError.code
        });
        throw staffError;
      }

      if (!staffData) {
        console.log("[FacilityHome] No facility staff record found for user");
        setError("No facility staff profile found. Please contact support.");
        setLoading(false);
        setLoadingStats(false);
        return;
      }

      setFacilityInfo(staffData.facilities);
      const facilityId = staffData.facility_id;
      
      // Fetch stats in parallel with simpler queries
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

      if (residentsResult.error) {
        console.error("[FacilityHome] Residents query error:", residentsResult.error);
        throw residentsResult.error;
      }
      if (staffResult.error) {
        console.error("[FacilityHome] Staff query error:", staffResult.error);
        throw staffResult.error;
      }
      if (alertsResult.error) {
        console.error("[FacilityHome] Alerts query error:", alertsResult.error);
        throw alertsResult.error;
      }

      // Get alerts count for resident members
      const memberIds = alertsResult.data?.map(r => r.member_id) || [];
      let alertsCount = 0;
      
      if (memberIds.length > 0) {
        const { count, error: alertCountError } = await supabase
          .from("alerts")
          .select("id", { count: "exact", head: true })
          .in("member_id", memberIds)
          .eq("status", "new");

        if (alertCountError) {
          console.error("[FacilityHome] Alert count error:", alertCountError);
        } else {
          alertsCount = count || 0;
        }
      }

      const totalBeds = staffData.facilities?.bed_capacity || 0;
      const occupiedBeds = residentsResult.count || 0;
      const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

      setStats({
        totalResidents: residentsResult.count || 0,
        occupancyRate,
        staffCount: staffResult.count || 0,
        activeAlerts: alertsCount,
      });

      const endTime = performance.now();
      console.log(`[FacilityHome] Data fetch completed in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (err: any) {
      console.error("[FacilityHome] Unexpected error:", err);
      setError(err.message || "Failed to load facility dashboard. Please try again.");
      toast({
        title: "Error loading dashboard",
        description: err.message || "Failed to load facility dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('[FacilityHome] Loading timeout reached');
          setError('Loading is taking longer than expected. Please try refreshing.');
          setLoading(false);
          setLoadingStats(false);
        }
      }, 30000); // Increased to 30 seconds

      fetchFacilityData();

      return () => clearTimeout(timeout);
    }
  }, [user]);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingStats(true);
    setError(null);
    fetchFacilityData();
  };

  if (loading && !loadingStats) {
    return (
      <FacilityDashboardLayout title="Facility Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </FacilityDashboardLayout>
    );
  }

  if (error && !facilityInfo) {
    return (
      <FacilityDashboardLayout title="Facility Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </FacilityDashboardLayout>
    );
  }

  return (
    <FacilityDashboardLayout title="Facility Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome to {facilityInfo?.name || "Facility"} Dashboard
            </h2>
            <p className="text-muted-foreground">
              Facility management and oversight dashboard
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loadingStats}>
            <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalResidents}</div>
                  <p className="text-xs text-muted-foreground">Current occupancy</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">Of {facilityInfo?.bed_capacity || 0} beds</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.staffCount}</div>
                  <p className="text-xs text-muted-foreground">Active staff</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">Requiring attention</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common facility management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/facility/residents')}>
                Add New Resident
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/facility/staff')}>
                Manage Staff
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/facility/reports')}>
                View Reports
              </Button>
              <Button variant="outline" className="justify-start">
                Schedule Management
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facility Information</CardTitle>
              <CardDescription>Current facility details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Facility Type:</span>
                <span className="text-sm font-medium">{facilityInfo?.facility_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">License:</span>
                <span className="text-sm font-medium">{facilityInfo?.license_number || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subscription:</span>
                <span className="text-sm font-medium capitalize">{facilityInfo?.subscription_status || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FacilityDashboardLayout>
  );
}

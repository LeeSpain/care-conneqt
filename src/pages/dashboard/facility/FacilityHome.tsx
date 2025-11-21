import { useEffect, useState } from "react";
import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Bed, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FacilityHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResidents: 0,
    occupancyRate: 0,
    staffCount: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityInfo, setFacilityInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        if (loading) {
          setError('Loading is taking longer than expected. Please refresh the page.');
          setLoading(false);
        }
      }, 10000);

      fetchFacilityData();

      return () => clearTimeout(timeout);
    }
  }, [user]);

  const fetchFacilityData = async () => {
    try {
      // Get facility staff record to find facility ID
      const { data: staffData, error: staffError } = await supabase
        .from("facility_staff")
        .select("facility_id, facilities(*)")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (staffError) throw staffError;

      if (staffData) {
        setFacilityInfo(staffData.facilities);
        
        const facilityId = staffData.facility_id;
        
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
            .from("alerts")
            .select("id, members!inner(id), facility_residents!inner(facility_id)", { count: "exact", head: true })
            .eq("status", "new")
            .eq("facility_residents.facility_id", facilityId),
        ]);

        if (residentsResult.error) throw residentsResult.error;
        if (staffResult.error) throw staffResult.error;
        if (alertsResult.error) throw alertsResult.error;

        const totalBeds = staffData.facilities?.bed_capacity || 0;
        const occupiedBeds = residentsResult.count || 0;
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

        setStats({
          totalResidents: residentsResult.count || 0,
          occupancyRate,
          staffCount: staffResult.count || 0,
          activeAlerts: alertsResult.count || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching facility data:", err);
      setError("Failed to load facility dashboard. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FacilityDashboardLayout title="Facility Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </FacilityDashboardLayout>
    );
  }

  if (error) {
    return (
      <FacilityDashboardLayout title="Facility Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardContent>
        </Card>
      </FacilityDashboardLayout>
    );
  }

  return (
    <FacilityDashboardLayout title="Facility Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to {facilityInfo?.name || "Facility"} Dashboard
          </h2>
          <p className="text-muted-foreground">
            Facility management and oversight dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.totalResidents}</div>
              <p className="text-xs text-muted-foreground">Current occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : `${stats.occupancyRate}%`}</div>
              <p className="text-xs text-muted-foreground">Of {facilityInfo?.bed_capacity || 0} beds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.staffCount}</div>
              <p className="text-xs text-muted-foreground">Active staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
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
              <Button variant="outline" className="justify-start">
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

import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Users, Bed, UserCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFacilityStats } from "@/hooks/useFacilityStats";

export default function FacilityHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading, isError, error, refetch } = useFacilityStats(user?.id);

  const handleRefresh = () => {
    refetch();
  };

  if (isError) {
    return (
      <FacilityDashboardLayout title="Facility Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || "Failed to load facility dashboard"}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </FacilityDashboardLayout>
    );
  }

  const stats = {
    totalResidents: data?.totalResidents || 0,
    occupancyRate: data?.occupancyRate || 0,
    staffCount: data?.staffCount || 0,
    activeAlerts: data?.activeAlerts || 0,
  };
  const facilityInfo = data?.facilityInfo;

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
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
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
              {isLoading ? (
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
              {isLoading ? (
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
              {isLoading ? (
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

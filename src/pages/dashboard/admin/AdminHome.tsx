import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Activity, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();

  const handleRefresh = () => {
    refetch();
  };

  if (isError) {
    return (
      <AdminDashboardLayout title="Admin Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || "Failed to load dashboard data"}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome, Admin</h2>
            <p className="text-muted-foreground">
              System overview and management dashboard
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">All registered users</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeMembers || 0}</div>
                  <p className="text-xs text-muted-foreground">Care recipients</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalNurses || 0}</div>
                  <p className="text-xs text-muted-foreground">Care professionals</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalFacilities || 0}</div>
                  <p className="text-xs text-muted-foreground">Care facilities</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/nurses')}
                className="justify-start"
              >
                Add Nurse
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/members')}
                className="justify-start"
              >
                Add Member
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/facilities')}
                className="justify-start"
              >
                Add Facility
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/announcements')}
                className="justify-start"
              >
                New Announcement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">All services running normally</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

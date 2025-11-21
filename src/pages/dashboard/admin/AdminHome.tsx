import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Activity, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFacilities: 0,
    activeMembers: 0,
    totalNurses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const startTime = performance.now();
    console.log('[AdminHome] Starting data fetch');

    try {
      const [usersResult, facilitiesResult, membersResult, nursesResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("facilities").select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "nurse"),
      ]);

      if (usersResult.error) {
        console.error("[AdminHome] Users query error:", usersResult.error);
      }
      if (facilitiesResult.error) {
        console.error("[AdminHome] Facilities query error:", facilitiesResult.error);
      }
      if (membersResult.error) {
        console.error("[AdminHome] Members query error:", membersResult.error);
      }
      if (nursesResult.error) {
        console.error("[AdminHome] Nurses query error:", nursesResult.error);
      }

      setStats({
        totalUsers: usersResult.count || 0,
        totalFacilities: facilitiesResult.count || 0,
        activeMembers: membersResult.count || 0,
        totalNurses: nursesResult.count || 0,
      });

      const endTime = performance.now();
      console.log(`[AdminHome] Data fetch completed in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (err: any) {
      console.error("[AdminHome] Unexpected error:", err);
      setError(err.message || "Failed to load dashboard data. Please try again.");
      toast({
        title: "Error loading dashboard",
        description: err.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('[AdminHome] Loading timeout reached');
        setError('Loading is taking longer than expected. Please try refreshing.');
        setLoading(false);
        setLoadingStats(false);
      }
    }, 30000); // Increased to 30 seconds

    fetchStats();

    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingStats(true);
    setError(null);
    fetchStats();
  };

  if (loading && !loadingStats) {
    return (
      <AdminDashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error && stats.totalUsers === 0) {
    return (
      <AdminDashboardLayout title="Admin Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
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
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loadingStats}>
            <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
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
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeMembers}</div>
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
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalNurses}</div>
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
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalFacilities}</div>
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

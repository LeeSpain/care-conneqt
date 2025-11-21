import { useEffect, useState } from "react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Activity, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFacilities: 0,
    activeMembers: 0,
    totalNurses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Loading is taking longer than expected. Please refresh the page.');
        setLoading(false);
      }
    }, 10000);

    fetchStats();

    return () => clearTimeout(timeout);
  }, []);

  const fetchStats = async () => {
    try {
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

      setStats({
        totalUsers: usersResult.count || 0,
        totalFacilities: facilitiesResult.count || 0,
        activeMembers: membersResult.count || 0,
        totalNurses: nursesResult.count || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout title="Admin Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, Admin</h2>
          <p className="text-muted-foreground">
            System overview and management dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.activeMembers}</div>
              <p className="text-xs text-muted-foreground">Care recipients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.totalNurses}</div>
              <p className="text-xs text-muted-foreground">Care professionals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.totalFacilities}</div>
              <p className="text-xs text-muted-foreground">Care facilities</p>
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
              <button 
                onClick={() => window.location.href = '/dashboard/admin/nurses'} 
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors text-left"
              >
                Add Nurse
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/admin/members'} 
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors text-left"
              >
                Add Member
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/admin/facilities'} 
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors text-left"
              >
                Add Facility
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/admin/announcements'} 
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors text-left"
              >
                New Announcement
              </button>
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

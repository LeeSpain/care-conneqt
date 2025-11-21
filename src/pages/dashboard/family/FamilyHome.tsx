import { useEffect, useState } from "react";
import { FamilyDashboardLayout } from "@/components/FamilyDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, AlertCircle, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FamilyHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    connectedMembers: 0,
    activeAlerts: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        if (loading) {
          setError('Loading is taking longer than expected. Please refresh the page.');
          setLoading(false);
        }
      }, 10000);

      fetchStats();

      return () => clearTimeout(timeout);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data: carerData, error: carerError } = await supabase
        .from("family_carers")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (carerError) {
        console.error("Error fetching carer data:", carerError);
        throw carerError;
      }

      if (!carerData) {
        console.log("No family carer record found for user");
        setError("No family carer profile found. Please contact support.");
        setLoading(false);
        return;
      }

      const [membersResult, alertsResult, messagesResult] = await Promise.all([
        supabase
          .from("member_carers")
          .select("id", { count: "exact", head: true })
          .eq("carer_id", carerData.id),
        supabase
          .from("alerts")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("care_messages")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", user?.id)
          .eq("is_read", false),
      ]);

      if (membersResult.error) {
        console.error("Members query error:", membersResult.error);
        throw membersResult.error;
      }
      if (alertsResult.error) {
        console.error("Alerts query error:", alertsResult.error);
        throw alertsResult.error;
      }
      if (messagesResult.error) {
        console.error("Messages query error:", messagesResult.error);
        throw messagesResult.error;
      }

      setStats({
        connectedMembers: membersResult.count || 0,
        activeAlerts: alertsResult.count || 0,
        upcomingAppointments: 0,
        unreadMessages: messagesResult.count || 0,
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
      <FamilyDashboardLayout title="Family Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </FamilyDashboardLayout>
    );
  }

  if (error) {
    return (
      <FamilyDashboardLayout title="Family Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardContent>
        </Card>
      </FamilyDashboardLayout>
    );
  }

  return (
    <FamilyDashboardLayout title="Family Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Your Family Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and support your loved ones' care journey
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.connectedMembers}</div>
              <p className="text-xs text-muted-foreground">Family members under care</p>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "-" : stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common family carer tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/family/members')}>
                View Family Members
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/care-team')}>
                Contact Care Team
              </Button>
              <Button variant="outline" className="justify-start">
                View Health Reports
              </Button>
              <Button variant="outline" className="justify-start">
                Schedule Video Call
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your family members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FamilyDashboardLayout>
  );
}

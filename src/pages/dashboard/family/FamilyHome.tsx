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

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [carerId] = await Promise.all([
        supabase
          .from("family_carers")
          .select("id")
          .eq("user_id", user?.id)
          .single()
      ]);

      if (carerId.data) {
        const [membersResult, alertsResult, messagesResult] = await Promise.all([
          supabase
            .from("member_carers")
            .select("id", { count: "exact", head: true })
            .eq("carer_id", carerId.data.id),
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

        setStats({
          connectedMembers: membersResult.count || 0,
          activeAlerts: alertsResult.count || 0,
          upcomingAppointments: 0,
          unreadMessages: messagesResult.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

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

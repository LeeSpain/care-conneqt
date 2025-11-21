import { useEffect, useState, useRef } from "react";
import { FamilyDashboardLayout } from "@/components/FamilyDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, AlertCircle, Calendar, MessageSquare, RefreshCw, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function FamilyHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    connectedMembers: 0,
    activeAlerts: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);

  const fetchStats = async () => {
    if (!user || fetchInProgress.current) return;

    fetchInProgress.current = true;
    setLoadingStats(true);

    const startTime = performance.now();
    console.log('[FamilyHome] Starting data fetch for user:', user?.id);

    try {
      const { data: carerData, error: carerError } = await supabase
        .from("family_carers")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (carerError) {
        console.error("[FamilyHome] Carer query error:", {
          message: carerError.message,
          details: carerError.details,
          hint: carerError.hint,
          code: carerError.code
        });
        throw carerError;
      }

      if (!carerData) {
        console.log("[FamilyHome] No family carer record found for user");
        setError("No family carer profile found. Please contact support.");
        setLoading(false);
        setLoadingStats(false);
        return;
      }

      // Fetch member IDs first
      const { data: memberCarerData, error: memberCarerError } = await supabase
        .from("member_carers")
        .select("member_id")
        .eq("carer_id", carerData.id);

      if (memberCarerError) {
        console.error("[FamilyHome] Member carer query error:", memberCarerError);
        throw memberCarerError;
      }

      const memberIds = memberCarerData?.map(mc => mc.member_id) || [];

      // Fetch stats in parallel with simpler queries
      const [membersResult, messagesResult] = await Promise.all([
        Promise.resolve({ count: memberIds.length }),
        supabase
          .from("care_messages")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", user?.id)
          .eq("is_read", false),
      ]);

      if (messagesResult.error) {
        console.error("[FamilyHome] Messages query error:", messagesResult.error);
      }

      // Get alerts for member IDs
      let alertsCount = 0;
      if (memberIds.length > 0) {
        const { count, error: alertsError } = await supabase
          .from("alerts")
          .select("id", { count: "exact", head: true })
          .in("member_id", memberIds)
          .eq("status", "new");

        if (alertsError) {
          console.error("[FamilyHome] Alerts query error:", alertsError);
        } else {
          alertsCount = count || 0;
        }
      }

      setStats({
        connectedMembers: membersResult.count || 0,
        activeAlerts: alertsCount,
        upcomingAppointments: 0,
        unreadMessages: messagesResult.count || 0,
      });

      const endTime = performance.now();
      console.log(`[FamilyHome] Data fetch completed in ${(endTime - startTime).toFixed(2)}ms`);

    } catch (err: any) {
      console.error("[FamilyHome] Unexpected error:", err);
      setError(err.message || "Failed to load dashboard data. Please try again.");
      toast({
        title: "Error loading dashboard",
        description: err.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingStats(false);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    if (user) {
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('[FamilyHome] Loading timeout reached');
          setError('Loading is taking longer than expected. Please try refreshing.');
          setLoading(false);
          setLoadingStats(false);
        }
      }, 30000); // Increased to 30 seconds

      fetchStats();

      return () => clearTimeout(timeout);
    }
  }, [user?.id]);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingStats(true);
    setError(null);
    fetchStats();
  };

  // Show skeleton immediately - no blocking
  const showSkeleton = loading || loadingStats;

  if (error && stats.connectedMembers === 0) {
    return (
      <FamilyDashboardLayout title="Family Dashboard">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </FamilyDashboardLayout>
    );
  }

  return (
    <FamilyDashboardLayout title="Family Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome to Your Family Dashboard</h2>
            <p className="text-muted-foreground">
              Monitor and support your loved ones' care journey
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={showSkeleton}>
            <RefreshCw className={`h-4 w-4 ${showSkeleton ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.connectedMembers}</div>
                  <p className="text-xs text-muted-foreground">Family members under care</p>
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
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">Requiring attention</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {showSkeleton ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </>
              )}
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
                <Users className="mr-2 h-4 w-4" />
                View Family Members
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/care-team')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Care Team
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="justify-start" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    View Health Reports
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon - Health reports and analytics</p>
                </TooltipContent>
              </Tooltip>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/family/schedule')}>
                <Video className="mr-2 h-4 w-4" />
                Schedule Video Call
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/dashboard/family/ai-chat')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Talk to AI Guardian
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

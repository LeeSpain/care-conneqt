import { MemberDashboardLayout } from "@/components/MemberDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MemberHome() {
  const navigate = useNavigate();

  return (
    <MemberDashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-muted-foreground">
            Your personal care dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/member/schedule")}
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Care Team</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/member/care-team")}
              >
                View Team
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/member/devices")}
              >
                View Devices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Guardian</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/ai-chat")}
              >
                Chat Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your care and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the navigation menu to access your schedule, care team, devices, family connections, and subscription management.
            </p>
          </CardContent>
        </Card>
      </div>
    </MemberDashboardLayout>
  );
}

import { NurseDashboardLayout } from "@/components/NurseDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, MessageSquare, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NurseHome() {
  const navigate = useNavigate();

  return (
    <NurseDashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your care assignments and tasks
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/nurse/members")}
              >
                View Members
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/nurse/alerts")}
              >
                View Alerts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/nurse/messages")}
              >
                View Messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/dashboard/nurse/health")}
              >
                Monitor Health
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your care responsibilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the navigation menu to access member details, tasks, alerts, messages, and health monitoring tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </NurseDashboardLayout>
  );
}

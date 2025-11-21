import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

export default function FacilityReports() {
  return (
    <FacilityDashboardLayout title="Reports">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View facility performance metrics and generate reports
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="staff">Staff Performance</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Staff Attendance</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">+1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Incident Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2%</div>
                  <p className="text-xs text-muted-foreground">-0.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7/5</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Key performance indicators over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart visualization coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Analytics</CardTitle>
                <CardDescription>Detailed occupancy metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Occupancy reports and analytics will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Staff metrics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Staff performance data will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Reports</CardTitle>
                <CardDescription>Track and analyze facility incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Incident reports and analysis will be displayed here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FacilityDashboardLayout>
  );
}

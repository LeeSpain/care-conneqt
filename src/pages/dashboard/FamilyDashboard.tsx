import { DashboardLayout } from '@/components/DashboardLayout';
import { MemberProfile } from '@/components/family-dashboard/MemberProfile';
import { QuickStats } from '@/components/family-dashboard/QuickStats';
import { HealthMonitoring } from '@/components/family-dashboard/HealthMonitoring';
import { AlertsCenter } from '@/components/family-dashboard/AlertsCenter';
import { DeviceStatus } from '@/components/family-dashboard/DeviceStatus';
import { CareTeamPanel } from '@/components/family-dashboard/CareTeamPanel';
import { ActivityTimeline } from '@/components/family-dashboard/ActivityTimeline';
import { MedicationTracker } from '@/components/family-dashboard/MedicationTracker';
import { HealthReports } from '@/components/family-dashboard/HealthReports';
import { VideoCallScheduler } from '@/components/family-dashboard/VideoCallScheduler';
import { ServiceAccess } from '@/components/family-dashboard/ServiceAccess';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FamilyDashboard() {
  const memberName = "Margaret Thompson";

  return (
    <DashboardLayout title="Family Dashboard">
      <div className="space-y-6">
        {/* Member Profile Header */}
        <MemberProfile memberName={memberName} />

        {/* Quick Stats Overview */}
        <QuickStats memberName={memberName} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="care">Care Team</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <AlertsCenter />
                <MedicationTracker />
              </div>
              <div className="space-y-6">
                <DeviceStatus />
                <ActivityTimeline />
              </div>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <HealthMonitoring />
            <div className="grid gap-6 lg:grid-cols-2">
              <MedicationTracker />
              <HealthReports />
            </div>
          </TabsContent>

          {/* Care Team Tab */}
          <TabsContent value="care" className="space-y-6">
            <CareTeamPanel />
            <div className="grid gap-6 lg:grid-cols-2">
              <VideoCallScheduler />
              <AlertsCenter />
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ActivityTimeline />
              <DeviceStatus />
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <ServiceAccess />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
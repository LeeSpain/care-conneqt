import { useAuth } from '@/hooks/useAuth';
import { MemberDashboardLayout } from '@/components/MemberDashboardLayout';
import { FamilyDashboardLayout } from '@/components/FamilyDashboardLayout';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { FacilityDashboardLayout } from '@/components/FacilityDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, User } from 'lucide-react';

export default function SchedulePage() {
  const { roles } = useAuth();

  const Layout = roles.includes('family_carer') 
    ? FamilyDashboardLayout
    : roles.includes('nurse')
    ? NurseDashboardLayout
    : roles.includes('facility_admin')
    ? FacilityDashboardLayout
    : MemberDashboardLayout;

  return (
    <Layout title="Schedule & Appointments">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Book a video call with your assigned nurse
              </p>
              <Button className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Video Check-in</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <User className="h-4 w-4" />
                        Nurse Sarah Johnson
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        Tomorrow, Oct 5
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        10:00 AM - 10:30 AM
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button size="sm">Join Call</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg opacity-60">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Monthly Check-up</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <User className="h-4 w-4" />
                        Nurse Sarah Johnson
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        Oct 15, 2025
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        2:00 PM - 2:30 PM
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg opacity-60">
                <div className="p-2 bg-muted rounded-lg">
                  <Video className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Weekly Check-in</p>
                  <p className="text-sm text-muted-foreground">Nurse Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Sep 28, 2025 at 10:00 AM</p>
                  <p className="text-xs text-green-600 mt-2">Completed</p>
                </div>
                <Button variant="ghost" size="sm">View Notes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Heart, MessageSquare, Shield, Calendar, Package } from 'lucide-react';

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setMember(data);
      
      if (data) {
        const { count } = await supabase
          .from('member_devices')
          .select('*', { count: 'exact', head: true })
          .eq('member_id', data.id);
        
        setDeviceCount(count || 0);
      }
      
      setLoading(false);
    };

    fetchMemberData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="My Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              Your Care Conneqt team is here to support you 24/7
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>
              <p className="text-xs text-muted-foreground">No alerts today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deviceCount}</div>
              <p className="text-xs text-muted-foreground">
                {deviceCount === 0 ? 'Configure devices' : 'Active devices'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Guardian</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Ready to chat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{member?.subscription_status || 'Active'}</div>
              <p className="text-xs text-muted-foreground">
                {member?.subscription_tier || 'Base Membership'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Video Check-in with Nurse Sarah</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard/schedule')}>
                View All Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Device Sync Complete</p>
                  <p className="text-sm text-muted-foreground">All your devices are connected and monitoring</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Heart className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Health Metrics Updated</p>
                  <p className="text-sm text-muted-foreground">Your daily health report is ready</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Devices Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceCount > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have {deviceCount} device{deviceCount !== 1 ? 's' : ''} actively monitoring your health
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/devices')}>
                  Manage Devices
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No devices connected yet</p>
                <Button onClick={() => navigate('/dashboard/devices')}>
                  Add Your First Device
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

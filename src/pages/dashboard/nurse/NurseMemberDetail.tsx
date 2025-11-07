import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Phone, MessageSquare, ArrowLeft, Heart, Activity, AlertTriangle, Pill, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export default function NurseMemberDetail() {
  const { memberId } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberData();
  }, [memberId, user]);

  const fetchMemberData = async () => {
    if (!user || !memberId) return;

    // Fetch member details
    const { data: memberData } = await supabase
      .from('members')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('id', memberId)
      .single();

    setMember(memberData);

    // Fetch alerts
    const { data: alertsData } = await supabase
      .from('alerts')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .limit(10);

    setAlerts(alertsData || []);

    // Fetch devices
    const { data: devicesData } = await supabase
      .from('member_devices')
      .select('*')
      .eq('member_id', memberId);

    setDevices(devicesData || []);

    // Fetch vitals
    const { data: vitalsData } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('member_id', memberId)
      .order('recorded_at', { ascending: false })
      .limit(20);

    setVitals(vitalsData || []);

    setLoading(false);
  };

  if (loading) {
    return (
      <NurseDashboardLayout title="Loading...">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </NurseDashboardLayout>
    );
  }

  if (!member) {
    return (
      <NurseDashboardLayout title="Not Found">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Member not found</p>
          </CardContent>
        </Card>
      </NurseDashboardLayout>
    );
  }

  return (
    <NurseDashboardLayout title={`${member.profiles?.first_name} ${member.profiles?.last_name}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/nurse/members')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{member.profiles?.first_name} {member.profiles?.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{member.date_of_birth ? format(new Date(member.date_of_birth), 'PP') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{member.profiles?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{member.profiles?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Care Level</p>
                <p className="font-medium">{member.care_level || 'Standard'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="font-medium">{member.emergency_contact_name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">
              <Activity className="h-4 w-4 mr-2" />
              Vitals
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Pill className="h-4 w-4 mr-2" />
              Medical Info
            </TabsTrigger>
            <TabsTrigger value="devices">
              <Heart className="h-4 w-4 mr-2" />
              Devices ({devices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                {vitals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No vitals recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {vitals.map((vital) => (
                      <div key={vital.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{vital.metric_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(vital.recorded_at), 'PPp')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{vital.metric_value}</p>
                          <p className="text-sm text-muted-foreground">{vital.metric_unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No alerts</p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <Badge variant={alert.priority === 'critical' ? 'destructive' : 'default'}>
                        {alert.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(alert.created_at), 'PPp')}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                {member.medical_conditions && member.medical_conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.medical_conditions.map((condition: string, idx: number) => (
                      <Badge key={idx} variant="outline">{condition}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No medical conditions recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {member.medications && member.medications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.medications.map((med: string, idx: number) => (
                      <Badge key={idx} variant="outline">{med}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No medications recorded</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                {member.allergies && member.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.allergies.map((allergy: string, idx: number) => (
                      <Badge key={idx} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No allergies recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            {devices.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No devices connected</p>
                </CardContent>
              </Card>
            ) : (
              devices.map((device) => (
                <Card key={device.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{device.device_name}</p>
                        <p className="text-sm text-muted-foreground">{device.device_type}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={device.device_status === 'active' ? 'default' : 'secondary'}>
                          {device.device_status}
                        </Badge>
                        {device.battery_level && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Battery: {device.battery_level}%
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </NurseDashboardLayout>
  );
}

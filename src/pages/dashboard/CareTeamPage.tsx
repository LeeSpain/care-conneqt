import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, Video, Calendar, MessageSquare, Stethoscope, Heart } from 'lucide-react';
import { CareTeamMessaging } from '@/components/CareTeamMessaging';

export default function CareTeamPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [primaryNurse, setPrimaryNurse] = useState<any>(null);
  const [memberId, setMemberId] = useState<string>('');

  useEffect(() => {
    const fetchCareTeam = async () => {
      if (!user) return;

      // Get member ID
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (member) {
        setMemberId(member.id);
        
        // Get assigned nurse
        const { data: assignment } = await supabase
          .from('nurse_assignments')
          .select(`
            *,
            profiles:nurse_id (
              first_name,
              last_name,
              email,
              phone,
              avatar_url
            )
          `)
          .eq('member_id', member.id)
          .eq('is_primary', true)
          .single();

        if (assignment) {
          setPrimaryNurse(assignment);
        }
      }

      setLoading(false);
    };

    fetchCareTeam();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Care Team">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Care Team">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Care Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Meet the dedicated healthcare professionals supporting your wellbeing
            </p>
          </CardContent>
        </Card>

        {/* Primary Nurse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Primary Nurse
            </CardTitle>
          </CardHeader>
          <CardContent>
            {primaryNurse ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info & Contact</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={primaryNurse.profiles?.avatar_url} />
                      <AvatarFallback>
                        {primaryNurse.profiles?.first_name?.[0]}
                        {primaryNurse.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {primaryNurse.profiles?.first_name} {primaryNurse.profiles?.last_name}
                          </h3>
                          <Badge variant="secondary" className="mt-1">Primary Care Nurse</Badge>
                          <div className="mt-3 space-y-2">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {primaryNurse.profiles?.email}
                            </p>
                            {primaryNurse.profiles?.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {primaryNurse.profiles.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {primaryNurse.notes && (
                        <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                          {primaryNurse.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="gap-2">
                      <Video className="h-4 w-4" />
                      Video Call
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="messages">
                  <CareTeamMessaging
                    nurseId={primaryNurse.nurse_id}
                    nurseName={`${primaryNurse.profiles?.first_name} ${primaryNurse.profiles?.last_name}`}
                    nurseAvatar={primaryNurse.profiles?.avatar_url}
                    memberId={memberId}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No primary nurse assigned yet</p>
                <p className="text-sm text-muted-foreground">
                  A nurse will be assigned to you within 24 hours of activation
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Healthcare Professionals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Healthcare Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Based on your subscription tier, you have access to specialized healthcare professionals
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">General Practitioner</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Monthly consultations included
                      </p>
                      <Button variant="link" className="px-0 mt-2">
                        Request Consultation
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg opacity-60">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Specialist Referrals</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upgrade plan to access
                      </p>
                      <Button variant="link" className="px-0 mt-2">
                        View Upgrade Options
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div>
                  <p className="font-medium">24/7 Emergency Line</p>
                  <p className="text-sm text-muted-foreground">Available anytime</p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Non-Emergency Support</p>
                  <p className="text-sm text-muted-foreground">9 AM - 9 PM</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

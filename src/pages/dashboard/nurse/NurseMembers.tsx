import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Activity, Phone, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface Member {
  id: string;
  profiles: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  date_of_birth: string;
  care_level: string;
  medical_conditions: string[];
  alertCount: number;
  lastContact: string;
}

export default function NurseMembers() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;

    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select(`
        member_id,
        members:member_id (
          id,
          date_of_birth,
          care_level,
          medical_conditions,
          profiles:user_id (
            first_name,
            last_name,
            phone
          )
        )
      `)
      .eq('nurse_id', user.id);

    if (assignments) {
      const memberData = await Promise.all(
        assignments.map(async (assignment: any) => {
          const member = assignment.members;
          
          const { count: alertCount } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('member_id', member.id)
            .eq('status', 'new');

          const { data: lastActivity } = await supabase
            .from('activity_logs')
            .select('created_at')
            .eq('member_id', member.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...member,
            alertCount: alertCount || 0,
            lastContact: lastActivity?.created_at || new Date().toISOString()
          };
        })
      );

      setMembers(memberData);
    }
    setLoading(false);
  };

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.profiles?.first_name} ${member.profiles?.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (alertCount: number) => {
    if (alertCount >= 3) return 'destructive';
    if (alertCount >= 1) return 'default';
    return 'secondary';
  };

  const getStatusLabel = (alertCount: number) => {
    if (alertCount >= 3) return 'Critical';
    if (alertCount >= 1) return 'Attention';
    return 'Good';
  };

  return (
    <DashboardLayout title={t('nurse.myMembers')}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">{t('nurse.noMembers')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </h3>
                        <Badge variant={getStatusColor(member.alertCount)}>
                          {getStatusLabel(member.alertCount)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <p>Age: {member.date_of_birth ? new Date().getFullYear() - new Date(member.date_of_birth).getFullYear() : 'N/A'}</p>
                          <p>Care Level: {member.care_level || 'Standard'}</p>
                        </div>
                        <div>
                          <p>Active Alerts: {member.alertCount}</p>
                          <p>Last Contact: {format(new Date(member.lastContact), 'MMM d, yyyy')}</p>
                        </div>
                      </div>

                      {member.medical_conditions && member.medical_conditions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {member.medical_conditions.slice(0, 3).map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/dashboard/nurse/members/${member.id}`)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

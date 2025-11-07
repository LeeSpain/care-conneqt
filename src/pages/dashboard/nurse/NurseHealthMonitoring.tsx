import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface MemberHealth {
  memberId: string;
  memberName: string;
  latestVitals: {
    heart_rate?: number;
    blood_pressure?: string;
    oxygen?: number;
    temperature?: number;
    glucose?: number;
  };
  trends: {
    [key: string]: 'up' | 'down' | 'stable';
  };
  lastUpdated: string;
}

export default function NurseHealthMonitoring() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const [membersHealth, setMembersHealth] = useState<MemberHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, [user]);

  const fetchHealthData = async () => {
    if (!user) return;

    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select(`
        member_id,
        members:member_id (
          id,
          profiles:user_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('nurse_id', user.id);

    if (assignments) {
      const healthData = await Promise.all(
        assignments.map(async (assignment: any) => {
          const { data: vitals } = await supabase
            .from('health_metrics')
            .select('*')
            .eq('member_id', assignment.member_id)
            .order('recorded_at', { ascending: false })
            .limit(10);

          const latestVitals: any = {};
          const trends: any = {};

          if (vitals && vitals.length > 0) {
            vitals.forEach((vital) => {
              if (!latestVitals[vital.metric_type]) {
                latestVitals[vital.metric_type] = vital.metric_value;
              }
            });

            // Calculate trends
            Object.keys(latestVitals).forEach((metricType) => {
              const metricVitals = vitals.filter(v => v.metric_type === metricType);
              if (metricVitals.length >= 2) {
                const latest = parseFloat(String(metricVitals[0].metric_value));
                const previous = parseFloat(String(metricVitals[1].metric_value));
                if (latest > previous * 1.05) trends[metricType] = 'up';
                else if (latest < previous * 0.95) trends[metricType] = 'down';
                else trends[metricType] = 'stable';
              }
            });
          }

          return {
            memberId: assignment.member_id,
            memberName: `${assignment.members.profiles.first_name} ${assignment.members.profiles.last_name}`,
            latestVitals,
            trends,
            lastUpdated: vitals?.[0]?.recorded_at || new Date().toISOString()
          };
        })
      );

      setMembersHealth(healthData);
    }
    setLoading(false);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getVitalStatus = (metricType: string, value: any) => {
    // Simple status logic - can be enhanced with proper ranges
    const normalRanges: any = {
      heart_rate: { min: 60, max: 100 },
      oxygen: { min: 95, max: 100 },
      temperature: { min: 36.1, max: 37.2 }
    };

    const range = normalRanges[metricType];
    if (!range) return 'default';

    const numValue = parseFloat(value);
    if (numValue < range.min || numValue > range.max) return 'destructive';
    return 'secondary';
  };

  return (
    <DashboardLayout title={t('healthMonitoring.title')}>
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : membersHealth.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No health data available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {membersHealth.map((member) => (
              <Card key={member.memberId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      {member.memberName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {format(new Date(member.lastUpdated), 'PPp')}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(member.latestVitals).length === 0 ? (
                    <p className="text-muted-foreground">No vitals recorded yet</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(member.latestVitals).map(([metricType, value]) => (
                        <div key={metricType} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium capitalize">
                              {metricType.replace('_', ' ')}
                            </p>
                            {member.trends[metricType] && getTrendIcon(member.trends[metricType])}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold">{value}</p>
                            <Badge variant={getVitalStatus(metricType, value)}>
                              {getVitalStatus(metricType, value) === 'destructive' ? 'Alert' : 'Normal'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

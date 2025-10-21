import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Users, ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('nurse_assignments')
        .select(`
          *,
          members:member_id (
            *,
            profiles:user_id (first_name, last_name)
          )
        `)
        .eq('nurse_id', user.id);

      setAssignments(data || []);
      setLoading(false);
    };

    fetchAssignments();
  }, [user]);

  return (
    <DashboardLayout title="Nurse Dashboard">
      <div className="space-y-6">
        {/* DEV: Test Credentials Panel */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Users className="h-5 w-5" />
              TEST CREDENTIALS - Nurse Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-900 dark:text-blue-100">
            <p className="font-mono text-sm">Email: nurse@test.com</p>
            <p className="font-mono text-sm">Password: Nurse123!</p>
            <p className="text-xs mt-2 text-blue-700 dark:text-blue-300">Use these credentials to login as a nurse. Create this account via signup if it doesn't exist.</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Members */}
        <Card>
          <CardHeader>
            <CardTitle>My Members</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No members assigned yet
              </p>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {assignment.members?.profiles?.first_name}{' '}
                        {assignment.members?.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.is_primary && '(Primary) '}
                        Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

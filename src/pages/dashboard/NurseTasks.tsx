import { useEffect, useState } from 'react';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateTaskDialog } from '@/components/nurse/CreateTaskDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, Circle, Clock, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string | null;
}

export default function NurseTasks() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('nurse_tasks')
      .select('*')
      .eq('nurse_id', user.id)
      .order('created_at', { ascending: false });

    setTasks((data || []) as Task[]);
    setLoading(false);
  };

  const completeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('nurse_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: user!.id,
      })
      .eq('id', taskId);

    if (error) {
      toast.error('Failed to update task');
    } else {
      toast.success('Task completed');
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending' || task.status === 'in_progress';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: 'default',
      medium: 'default',
      high: 'default',
      urgent: 'destructive',
    };
    return colors[priority] || 'default';
  };

  return (
    <NurseDashboardLayout title="My Tasks">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <Button onClick={() => setCreateTaskOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No tasks found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={() => {
                          if (task.status !== 'completed') {
                            completeTask(task.id);
                          }
                        }}
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Task #{task.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  {task.due_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Due: {format(new Date(task.due_date), 'PPp')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <CreateTaskDialog 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen}
        onTaskCreated={fetchTasks}
      />
    </NurseDashboardLayout>
  );
}

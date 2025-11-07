import { ReactNode, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId?: string;
  onTaskCreated?: () => void;
}

export function CreateTaskDialog({ open, onOpenChange, memberId, onTaskCreated }: CreateTaskDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [taskType, setTaskType] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(memberId || '');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch assigned members
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user || !open) return;
      const { data } = await supabase
        .from('nurse_assignments')
        .select('member_id, members:member_id(id, profiles:user_id(first_name, last_name))')
        .eq('nurse_id', user.id);
      
      if (data) {
        setMembers(data.map((a: any) => ({
          id: a.member_id,
          name: `${a.members.profiles.first_name} ${a.members.profiles.last_name}`
        })));
      }
    };
    fetchMembers();
  }, [user, open]);

  const handleSubmit = async () => {
    if (!user || !title || !selectedMemberId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('nurse_tasks')
      .insert({
        nurse_id: user.id,
        member_id: selectedMemberId,
        title,
        description: description || null,
        task_type: taskType,
        priority: priority as 'low' | 'medium' | 'high' | 'urgent',
        status: 'pending',
        due_date: dueDate || null
      });

    setLoading(false);

    if (error) {
      toast.error('Failed to create task');
    } else {
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTaskType('general');
      setDueDate('');
      setSelectedMemberId(memberId || '');
      onOpenChange(false);
      onTaskCreated?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!memberId && (
            <div>
              <Label htmlFor="member">Member *</Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Check medication compliance"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taskType">Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

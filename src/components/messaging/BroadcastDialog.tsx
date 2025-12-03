import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2, Users, Building, Shield, Heart, UserCog } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface BroadcastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBroadcastSent?: () => void;
}

interface RecipientGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  role?: string;
  facilityId?: string;
}

export function BroadcastDialog({ open, onOpenChange, onBroadcastSent }: BroadcastDialogProps) {
  const { t } = useTranslation('messaging');
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      fetchRecipientGroups();
      setMessage('');
      setSelectedGroups([]);
      setPriority('normal');
    }
  }, [open]);

  const fetchRecipientGroups = async () => {
    setLoading(true);
    try {
      const groups: RecipientGroup[] = [];

      // Count users by role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role');

      const roleCounts: Record<string, number> = {};
      roleData?.forEach(r => {
        roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
      });

      // Add role-based groups
      groups.push({
        id: 'role_nurse',
        label: t('broadcast.allNurses', 'All Nurses'),
        icon: <Heart className="h-4 w-4" />,
        count: roleCounts['nurse'] || 0,
        role: 'nurse'
      });

      groups.push({
        id: 'role_member',
        label: t('broadcast.allMembers', 'All Members'),
        icon: <Users className="h-4 w-4" />,
        count: roleCounts['member'] || 0,
        role: 'member'
      });

      groups.push({
        id: 'role_family_carer',
        label: t('broadcast.allFamilies', 'All Family Carers'),
        icon: <Users className="h-4 w-4" />,
        count: roleCounts['family_carer'] || 0,
        role: 'family_carer'
      });

      groups.push({
        id: 'role_facility_admin',
        label: t('broadcast.allFacilityAdmins', 'All Facility Admins'),
        icon: <Building className="h-4 w-4" />,
        count: roleCounts['facility_admin'] || 0,
        role: 'facility_admin'
      });

      groups.push({
        id: 'role_admin',
        label: t('broadcast.allAdmins', 'All Admins'),
        icon: <Shield className="h-4 w-4" />,
        count: roleCounts['admin'] || 0,
        role: 'admin'
      });

      // Fetch facilities for facility-based groups
      const { data: facilities } = await supabase
        .from('facilities')
        .select('id, name');

      facilities?.forEach(facility => {
        groups.push({
          id: `facility_${facility.id}`,
          label: facility.name,
          icon: <Building className="h-4 w-4" />,
          count: 0, // Would need to count staff
          facilityId: facility.id
        });
      });

      setRecipientGroups(groups);
    } catch (error) {
      console.error('Error fetching recipient groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSend = async () => {
    if (!message.trim() || selectedGroups.length === 0 || !user) return;

    setSending(true);
    try {
      // Collect all recipient user IDs based on selected groups
      const recipientIds = new Set<string>();

      for (const groupId of selectedGroups) {
        if (groupId.startsWith('role_')) {
          const role = groupId.replace('role_', '') as 'admin' | 'nurse' | 'member' | 'family_carer' | 'facility_admin' | 'insurance_admin' | 'company_admin';
          const { data: roleUsers } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', role);
          
          roleUsers?.forEach(u => recipientIds.add(u.user_id));
        } else if (groupId.startsWith('facility_')) {
          const facilityId = groupId.replace('facility_', '');
          const { data: facilityStaff } = await supabase
            .from('facility_staff')
            .select('user_id')
            .eq('facility_id', facilityId);
          
          facilityStaff?.forEach(s => recipientIds.add(s.user_id));
        }
      }

      // Remove self from recipients
      recipientIds.delete(user.id);

      if (recipientIds.size === 0) {
        toast.error(t('broadcast.noRecipients', 'No recipients found'));
        return;
      }

      // Create broadcast conversation
      const { data: conversation, error: convoError } = await supabase
        .from('conversations')
        .insert({
          type: 'group',
          title: t('broadcast.broadcastMessage', 'Broadcast Message'),
          is_broadcast: true
        })
        .select()
        .single();

      if (convoError) throw convoError;

      // Add all participants
      const participants = [user.id, ...Array.from(recipientIds)].map((userId, i) => ({
        conversation_id: conversation.id,
        user_id: userId,
        role: i === 0 ? 'owner' : 'participant'
      }));

      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (partError) throw partError;

      // Send the message
      const { error: msgError } = await supabase
        .from('platform_messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          message: message.trim(),
          message_type: 'text',
          priority
        });

      if (msgError) throw msgError;

      toast.success(t('broadcast.sent', 'Broadcast sent to {{count}} recipients', { count: recipientIds.size }));
      onOpenChange(false);
      onBroadcastSent?.();
    } catch (error: any) {
      console.error('Error sending broadcast:', error);
      toast.error(error.message || t('broadcast.error', 'Failed to send broadcast'));
    } finally {
      setSending(false);
    }
  };

  const totalRecipients = selectedGroups.reduce((total, groupId) => {
    const group = recipientGroups.find(g => g.id === groupId);
    return total + (group?.count || 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            {t('broadcast.title', 'Broadcast Message')}
          </DialogTitle>
          <DialogDescription>
            {t('broadcast.description', 'Send a message to multiple users at once')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Groups */}
          <div className="space-y-2">
            <Label>{t('broadcast.selectRecipients', 'Select Recipients')}</Label>
            <ScrollArea className="h-[200px] border rounded-lg p-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {recipientGroups.filter(g => g.count > 0 || g.facilityId).map(group => (
                    <button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox checked={selectedGroups.includes(group.id)} />
                      <div className="flex items-center gap-2 flex-1">
                        {group.icon}
                        <span className="text-sm">{group.label}</span>
                      </div>
                      {group.count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {group.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
            {selectedGroups.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {t('broadcast.recipientCount', '{{count}} groups selected', { count: selectedGroups.length })}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>{t('broadcast.priority', 'Priority')}</Label>
            <Select value={priority} onValueChange={(v: 'normal' | 'urgent') => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('broadcast.priorityNormal', 'Normal')}</SelectItem>
                <SelectItem value="urgent">{t('broadcast.priorityUrgent', 'Urgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>{t('broadcast.message', 'Message')}</Label>
            <Textarea
              placeholder={t('broadcast.messagePlaceholder', 'Enter your broadcast message...')}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || selectedGroups.length === 0 || sending}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {t('broadcast.send', 'Send Broadcast')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMessaging, Conversation } from '@/hooks/useMessaging';
import { toast } from 'sonner';

interface ContactOption {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
  context?: string;
}

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversation: Conversation) => void;
  allowedRoles?: string[];
  contextType?: string;
  contextId?: string;
}

export function ComposeDialog({
  open,
  onOpenChange,
  onConversationCreated,
  allowedRoles,
  contextType,
  contextId
}: ComposeDialogProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { createConversation } = useMessaging();
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) {
      fetchContacts();
      setSelected([]);
      setSearch('');
    }
  }, [open]);

  const fetchContacts = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const allContacts: ContactOption[] = [];

      // Get users based on role relationships
      // 1. For members - get their assigned nurses and family carers
      // 2. For nurses - get their assigned members and families
      // 3. For family carers - get their linked members and nurses
      // 4. For facility staff - get residents, families, other staff
      // 5. For admins - get all users

      // Fetch profiles with roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .neq('id', user.id);

      if (!profiles) return;

      // Get roles for each profile
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profiles.map(p => p.id));

      // Get nurse assignments for current user
      const { data: nurseAssignments } = await supabase
        .from('nurse_assignments')
        .select('nurse_id, member_id');

      // Get member carers for current user
      const { data: memberCarers } = await supabase
        .from('member_carers')
        .select('carer_id, member_id');

      // Get members
      const { data: members } = await supabase
        .from('members')
        .select('id, user_id');

      // Get family carers
      const { data: familyCarers } = await supabase
        .from('family_carers')
        .select('id, user_id');

      profiles.forEach(profile => {
        const roles = userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || [];
        const primaryRole = roles[0] || 'user';

        // Filter by allowed roles if specified
        if (allowedRoles && !roles.some(r => allowedRoles.includes(r))) {
          return;
        }

        const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown';

        // Determine context
        let context = '';
        const member = members?.find(m => m.user_id === profile.id);
        const familyCarer = familyCarers?.find(fc => fc.user_id === profile.id);

        if (primaryRole === 'nurse') {
          const assignedMembers = nurseAssignments?.filter(na => na.nurse_id === profile.id).length || 0;
          context = `${assignedMembers} assigned members`;
        } else if (primaryRole === 'member' && member) {
          const assignedNurse = nurseAssignments?.find(na => na.member_id === member.id);
          context = assignedNurse ? 'Has assigned nurse' : 'No nurse assigned';
        } else if (primaryRole === 'family_carer' && familyCarer) {
          const linkedMembers = memberCarers?.filter(mc => mc.carer_id === familyCarer.id).length || 0;
          context = `${linkedMembers} linked members`;
        }

        allContacts.push({
          id: profile.id,
          user_id: profile.id,
          name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: primaryRole,
          context
        });
      });

      setContacts(allContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.role.toLowerCase().includes(searchLower)
    );
  });

  const toggleContact = (userId: string) => {
    setSelected(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (selected.length === 0) return;

    setCreating(true);
    try {
      const type = selected.length > 1 ? 'group' : 'direct';
      const conversation = await createConversation(
        selected,
        type,
        type === 'group' ? t('messaging.groupChat', 'Group Chat') : undefined,
        contextType,
        contextId
      );
      
      if (conversation) {
        onConversationCreated(conversation as Conversation);
        onOpenChange(false);
        toast.success(t('messaging.conversationCreated', 'Conversation created'));
      }
    } catch (error: any) {
      toast.error(error.message || t('messaging.createError', 'Failed to create conversation'));
    } finally {
      setCreating(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'nurse':
        return 'default';
      case 'member':
        return 'secondary';
      case 'family_carer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: t('roles.admin', 'Admin'),
      nurse: t('roles.nurse', 'Nurse'),
      member: t('roles.member', 'Member'),
      family_carer: t('roles.familyCarer', 'Family'),
      facility_admin: t('roles.facilityAdmin', 'Facility Admin'),
      insurance_admin: t('roles.insuranceAdmin', 'Insurance'),
      company_admin: t('roles.companyAdmin', 'Care Company')
    };
    return labels[role] || role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('messaging.newConversation', 'New Conversation')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('messaging.searchContacts', 'Search contacts...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected count */}
          {selected.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selected.length} {t('messaging.selected', 'selected')}
            </p>
          )}

          {/* Contact list */}
          <ScrollArea className="h-[300px] border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {search
                  ? t('messaging.noContactsFound', 'No contacts found')
                  : t('messaging.noContactsAvailable', 'No contacts available')}
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact.user_id)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <Checkbox checked={selected.includes(contact.user_id)} />
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={contact.avatar_url || undefined} />
                      <AvatarFallback>
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{contact.name}</span>
                        <Badge variant={getRoleBadgeVariant(contact.role)} className="text-xs">
                          {getRoleLabel(contact.role)}
                        </Badge>
                      </div>
                      {contact.context && (
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.context}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={selected.length === 0 || creating}
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {selected.length > 1
                ? t('messaging.createGroup', 'Create Group')
                : t('messaging.startChat', 'Start Chat')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

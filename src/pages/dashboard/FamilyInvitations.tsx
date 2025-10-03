import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Invitation {
  id: string;
  invited_email: string;
  relationship: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export default function FamilyInvitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const fetchInvitations = async () => {
    if (!user) return;

    const { data: memberData } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (memberData) {
      setMemberId(memberData.id);
      const { data } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('member_id', memberData.id)
        .order('created_at', { ascending: false });

      setInvitations(data || []);
    }
    setLoading(false);
  };

  const sendInvitation = async () => {
    if (!memberId || !email || !relationship) {
      toast.error('Please fill in all fields');
      return;
    }

    const { error } = await supabase.from('family_invitations').insert({
      member_id: memberId,
      invited_email: email,
      invited_by: user!.id,
      relationship: relationship,
    });

    if (error) {
      toast.error('Failed to send invitation');
    } else {
      toast.success(`Invitation sent to ${email}`);
      setDialogOpen(false);
      setEmail('');
      setRelationship('');
      fetchInvitations();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'default',
      accepted: 'default',
      declined: 'destructive',
      expired: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <DashboardLayout title="Family & Carers">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Family Invitations</h2>
            <p className="text-muted-foreground">Invite family members to view your health data</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Family Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="family@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g., Daughter, Son, Spouse"
                  />
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    They will receive an email invitation and can view your health data and alerts once they accept.
                  </p>
                </div>
                <Button onClick={sendInvitation} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : invitations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No invitations sent yet. Invite family members to stay connected.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{invitation.invited_email}</CardTitle>
                      <p className="text-sm text-muted-foreground">{invitation.relationship}</p>
                    </div>
                    {getStatusIcon(invitation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    {getStatusBadge(invitation.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sent:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {invitation.status === 'pending' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expires:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </span>
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

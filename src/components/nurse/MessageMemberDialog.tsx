import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface MessageMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberId: string;
  recipientUserId: string;
}

export function MessageMemberDialog({ 
  open, 
  onOpenChange, 
  memberName, 
  memberId,
  recipientUserId 
}: MessageMemberDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!user || !message.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('care_messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientUserId,
        member_id: memberId,
        message: message.trim()
      });

    setLoading(false);

    if (error) {
      toast.error('Failed to send message');
    } else {
      toast.success('Message sent');
      setMessage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message to {memberName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading || !message.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

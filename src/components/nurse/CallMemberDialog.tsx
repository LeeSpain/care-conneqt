import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Video } from 'lucide-react';

interface CallMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberPhone?: string;
}

export function CallMemberDialog({ open, onOpenChange, memberName, memberPhone }: CallMemberDialogProps) {
  const handleCall = (type: 'voice' | 'video') => {
    // In a real app, this would initiate a call through your telephony service
    // For now, if phone is available, we can open the tel: link
    if (type === 'voice' && memberPhone) {
      window.location.href = `tel:${memberPhone}`;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Call {memberName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {memberPhone && (
            <p className="text-sm text-muted-foreground mb-4">
              Phone: {memberPhone}
            </p>
          )}
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleCall('voice')}
            disabled={!memberPhone}
          >
            <Phone className="h-4 w-4 mr-2" />
            Voice Call
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleCall('video')}
          >
            <Video className="h-4 w-4 mr-2" />
            Video Call
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

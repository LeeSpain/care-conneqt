import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock } from 'lucide-react';

interface ScheduledCall {
  id: string;
  type: 'nurse' | 'doctor';
  with: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
}

export const VideoCallScheduler = () => {
  const scheduledCalls: ScheduledCall[] = [
    {
      id: '1',
      type: 'nurse',
      with: 'Sarah Johnson, RN',
      date: 'Tomorrow',
      time: '2:00 PM',
      status: 'upcoming'
    },
    {
      id: '2',
      type: 'nurse',
      with: 'Sarah Johnson, RN',
      date: 'Jan 10, 2024',
      time: '10:00 AM',
      status: 'completed'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Video Calls
          </CardTitle>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduledCalls.map((call) => (
          <div
            key={call.id}
            className="p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{call.with}</h4>
                  <Badge variant={call.status === 'upcoming' ? 'default' : 'secondary'}>
                    {call.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground capitalize">{call.type} consultation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{call.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{call.time}</span>
              </div>
            </div>

            {call.status === 'upcoming' && (
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Join Call
                </Button>
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
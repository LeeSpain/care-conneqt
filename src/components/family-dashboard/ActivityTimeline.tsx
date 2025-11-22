import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Activity, Pill, Coffee, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TimelineEvent {
  id: string;
  type: 'activity' | 'medication' | 'meal' | 'sleep';
  title: string;
  time: string;
  description?: string;
}

const eventIcons = {
  activity: { icon: Activity, color: 'text-secondary' },
  medication: { icon: Pill, color: 'text-primary' },
  meal: { icon: Coffee, color: 'text-coral' },
  sleep: { icon: Moon, color: 'text-accent' }
};

export const ActivityTimeline = () => {
  const { t } = useTranslation('dashboard');
  
  const events: TimelineEvent[] = [
    {
      id: '1',
      type: 'medication',
      title: t('components.activityTimeline.morningMedication'),
      time: '09:00 AM',
      description: t('components.activityTimeline.allTaken')
    },
    {
      id: '2',
      type: 'activity',
      title: t('components.activityTimeline.morningWalk'),
      time: '10:30 AM',
      description: t('components.activityTimeline.walkDetails')
    },
    {
      id: '3',
      type: 'meal',
      title: t('components.activityTimeline.lunch'),
      time: '12:30 PM'
    },
    {
      id: '4',
      type: 'activity',
      title: t('components.activityTimeline.afternoonActivity'),
      time: '03:00 PM',
      description: t('components.activityTimeline.lightMovement')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t('components.activityTimeline.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-6">
            {events.map((event) => {
              const { icon: Icon, color } = eventIcons[event.type];
              
              return (
                <div key={event.id} className="relative flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center ${color} z-10`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
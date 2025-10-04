import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

const alertIcons = {
  critical: <AlertTriangle className="h-5 w-5 text-destructive" />,
  warning: <Bell className="h-5 w-5 text-coral" />,
  info: <Info className="h-5 w-5 text-primary" />
};

const alertColors = {
  critical: 'bg-destructive/10 border-destructive/20',
  warning: 'bg-coral/10 border-coral/20',
  info: 'bg-primary/10 border-primary/20'
};

export const AlertsCenter = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'info',
      title: 'Medication Taken',
      message: 'Morning medication taken at 9:00 AM',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'Activity Update',
      message: 'Daily step goal achieved (5,000 steps)',
      timestamp: '4 hours ago'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Alerts
          </CardTitle>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
            {alerts.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-secondary mb-3" />
            <p className="text-lg font-semibold text-foreground">All Clear!</p>
            <p className="text-sm text-muted-foreground">No active alerts at this time</p>
          </div>
        ) : (
          <>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${alertColors[alert.type]} transition-all hover:shadow-md`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {alertIcons[alert.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
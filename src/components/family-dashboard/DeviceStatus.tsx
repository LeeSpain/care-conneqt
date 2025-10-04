import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Watch, Pill, Phone, Wifi, Battery } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'watch' | 'dispenser' | 'phone' | 'other';
  status: 'online' | 'offline' | 'charging';
  battery: number;
  lastSync: string;
}

const deviceIcons = {
  watch: Watch,
  dispenser: Pill,
  phone: Phone,
  other: Wifi
};

export const DeviceStatus = () => {
  const devices: Device[] = [
    {
      id: '1',
      name: 'Vivago Watch',
      type: 'watch',
      status: 'online',
      battery: 85,
      lastSync: '5 min ago'
    },
    {
      id: '2',
      name: 'Dosell Dispenser',
      type: 'dispenser',
      status: 'online',
      battery: 92,
      lastSync: '1 hour ago'
    },
    {
      id: '3',
      name: 'Emergency Phone',
      type: 'phone',
      status: 'charging',
      battery: 65,
      lastSync: '30 min ago'
    }
  ];

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-secondary';
    if (level > 20) return 'text-coral';
    return 'text-destructive';
  };

  const getStatusBadge = (status: Device['status']) => {
    const variants = {
      online: { variant: 'default' as const, className: 'bg-secondary/10 text-secondary' },
      offline: { variant: 'secondary' as const, className: 'bg-destructive/10 text-destructive' },
      charging: { variant: 'secondary' as const, className: 'bg-coral/10 text-coral' }
    };
    return variants[status];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Connected Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => {
          const Icon = deviceIcons[device.type];
          const statusBadge = getStatusBadge(device.status);

          return (
            <div
              key={device.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-sm"
            >
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{device.name}</h4>
                  <Badge {...statusBadge}>
                    {device.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last sync: {device.lastSync}</p>
              </div>
              <div className="flex items-center gap-1">
                <Battery className={`h-4 w-4 ${getBatteryColor(device.battery)}`} />
                <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>
                  {device.battery}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
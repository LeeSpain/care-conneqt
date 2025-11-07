import { useState, useEffect } from 'react';
import { MemberDashboardLayout } from '@/components/MemberDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Wifi, WifiOff, Battery, BatteryWarning } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  device_serial: string | null;
  device_status: string;
  battery_level: number | null;
  last_sync_at: string | null;
  notes: string | null;
}

export default function DeviceManagement() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // Form state
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const fetchDevices = async () => {
    if (!user) return;

    const { data: memberData } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (memberData) {
      setMemberId(memberData.id);
      const { data } = await supabase
        .from('member_devices')
        .select('*')
        .eq('member_id', memberData.id)
        .order('created_at', { ascending: false });

      setDevices(data || []);
    }
    setLoading(false);
  };

  const addDevice = async () => {
    if (!memberId || !deviceName || !deviceType) {
      toast.error('Please fill in required fields');
      return;
    }

    const { error } = await supabase.from('member_devices').insert({
      member_id: memberId,
      device_name: deviceName,
      device_type: deviceType as any,
      device_serial: deviceSerial || null,
      notes: notes || null,
    } as any);

    if (error) {
      toast.error('Failed to add device');
    } else {
      toast.success('Device added successfully');
      setDialogOpen(false);
      setDeviceName('');
      setDeviceType('');
      setDeviceSerial('');
      setNotes('');
      fetchDevices();
    }
  };

  const getDeviceIcon = (status: string) => {
    return status === 'active' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
  };

  const getBatteryIcon = (level: number | null) => {
    if (!level) return null;
    return level < 20 ? <BatteryWarning className="h-4 w-4 text-destructive" /> : <Battery className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive',
      needs_battery: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <MemberDashboardLayout title="Device Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Devices</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deviceName">Device Name *</Label>
                  <Input
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., My Vivago Watch"
                  />
                </div>
                <div>
                  <Label htmlFor="deviceType">Device Type *</Label>
                  <Select value={deviceType} onValueChange={setDeviceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivago_watch">Vivago Watch</SelectItem>
                      <SelectItem value="dosell_dispenser">Dosell Smart Dispenser</SelectItem>
                      <SelectItem value="bbrain_sensor">BBrain Sensor</SelectItem>
                      <SelectItem value="heart_monitor">Heart Monitor</SelectItem>
                      <SelectItem value="fall_detector">Fall Detector</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deviceSerial">Serial Number</Label>
                  <Input
                    id="deviceSerial"
                    value={deviceSerial}
                    onChange={(e) => setDeviceSerial(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
                <Button onClick={addDevice} className="w-full">
                  Add Device
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : devices.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No devices added yet. Click "Add Device" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{device.device_name}</CardTitle>
                    {getDeviceIcon(device.device_status)}
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {device.device_type.replace(/_/g, ' ')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    {getStatusBadge(device.device_status)}
                  </div>
                  {device.battery_level !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Battery:</span>
                      <div className="flex items-center gap-1">
                        {getBatteryIcon(device.battery_level)}
                        <span className="text-sm">{device.battery_level}%</span>
                      </div>
                    </div>
                  )}
                  {device.last_sync_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(device.last_sync_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {device.device_serial && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Serial: {device.device_serial}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MemberDashboardLayout>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Phone, Mail, Calendar, MapPin, Heart, Pill, Activity, 
  AlertCircle, Watch, Smartphone, Battery, Shield
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ResidentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: any;
}

export function ResidentDetailDialog({ open, onOpenChange, resident }: ResidentDetailDialogProps) {
  const { t } = useTranslation('dashboard-admin');
  const member = resident?.member;
  const profile = member?.profile;

  const { data: devices } = useQuery({
    queryKey: ["member-devices", member?.id],
    queryFn: async () => {
      if (!member?.id) return [];
      const { data, error } = await supabase
        .from("member_devices")
        .select("*")
        .eq("member_id", member.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!member?.id && open
  });

  if (!resident) return null;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'vivago_watch':
        return <Watch className="h-5 w-5" />;
      case 'heart_monitor':
        return <Heart className="h-5 w-5" />;
      case 'fall_detector':
        return <Shield className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-500';
      case 'needs_battery':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xl">{profile?.first_name} {profile?.last_name}</span>
              <p className="text-sm font-normal text-muted-foreground">
                {t('residentDetail.room')} {resident.room_number} • {t('residentDetail.admitted')} {format(new Date(resident.admission_date), 'MMM d, yyyy')}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('residentDetail.tabs.overview')}</TabsTrigger>
              <TabsTrigger value="medical">{t('residentDetail.tabs.medical')}</TabsTrigger>
              <TabsTrigger value="devices">{t('residentDetail.tabs.devices')} ({devices?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('residentDetail.personalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.fullName')}</p>
                    <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.dateOfBirth')}</p>
                    <p className="font-medium">
                      {member?.date_of_birth 
                        ? format(new Date(member.date_of_birth), 'MMMM d, yyyy')
                        : t('residentDetail.notRecorded')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {t('residentDetail.email')}
                    </p>
                    <p className="font-medium">{profile?.email || t('residentDetail.notRecorded')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {t('residentDetail.phone')}
                    </p>
                    <p className="font-medium">{profile?.phone || t('residentDetail.notRecorded')}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {t('residentDetail.address')}
                    </p>
                    <p className="font-medium">
                      {member?.address_line1 
                        ? `${member.address_line1}, ${member.city || ''} ${member.postal_code || ''}`
                        : t('residentDetail.notRecorded')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {t('residentDetail.emergencyContact')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.contactName')}</p>
                    <p className="font-medium">{member?.emergency_contact_name || t('residentDetail.notRecorded')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.phoneNumber')}</p>
                    <p className="font-medium">{member?.emergency_contact_phone || t('residentDetail.notRecorded')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('residentDetail.careStatus')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.careLevel')}</p>
                    <Badge variant="outline" className="capitalize">
                      {member?.care_level || t('residentDetail.standard')}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.mobility')}</p>
                    <Badge variant="outline" className="capitalize">
                      {member?.mobility_level || t('residentDetail.independent')}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('residentDetail.subscription')}</p>
                    <Badge variant={member?.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {member?.subscription_status || t('residentDetail.unknown')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {t('residentDetail.medicalConditions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {member?.medical_conditions ? (
                    <div className="flex flex-wrap gap-2">
                      {(typeof member.medical_conditions === 'string' 
                        ? member.medical_conditions.split(',') 
                        : Array.isArray(member.medical_conditions) 
                          ? member.medical_conditions 
                          : []
                      ).map((condition: string, i: number) => (
                        <Badge key={i} variant="secondary" className="capitalize">
                          {condition.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">{t('residentDetail.noMedicalConditions')}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    {t('residentDetail.currentMedications')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {member?.medications ? (
                    <div className="flex flex-wrap gap-2">
                      {(typeof member.medications === 'string' 
                        ? member.medications.split(',') 
                        : Array.isArray(member.medications) 
                          ? member.medications 
                          : []
                      ).map((med: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {med.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">{t('residentDetail.noMedications')}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {t('residentDetail.careNotes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {member?.notes || t('residentDetail.noCareNotes')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4 mt-4">
              {devices && devices.length > 0 ? (
                <div className="grid gap-3">
                  {devices.map((device: any) => (
                    <Card key={device.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            {getDeviceIcon(device.device_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{device.device_name}</h4>
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(device.device_status)}`} />
                              <span className="text-xs text-muted-foreground capitalize">
                                {device.device_status?.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {device.device_type?.replace('_', ' ')} • {t('residentDetail.serial')}: {device.device_serial || t('residentDetail.na')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`flex items-center gap-1 ${getBatteryColor(device.battery_level || 0)}`}>
                              <Battery className="h-4 w-4" />
                              <span className="font-medium">{device.battery_level || 0}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {device.last_sync_at 
                                ? `${t('residentDetail.lastSync')}: ${format(new Date(device.last_sync_at), 'MMM d, HH:mm')}`
                                : t('residentDetail.neverSynced')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{t('residentDetail.noDevices')}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

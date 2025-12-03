import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { 
  Settings, Shield, Bell, Building2, Database, Save, 
  RefreshCw, Globe, Clock, Lock, Mail, AlertTriangle, Calendar
} from "lucide-react";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  description: string;
  is_sensitive: boolean;
}

export default function SystemSettings() {
  const { t } = useTranslation('dashboard-admin');
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: systemSettings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("category");
      if (error) throw error;
      return data as SystemSetting[];
    }
  });

  useEffect(() => {
    if (systemSettings) {
      const settingsMap: Record<string, any> = {};
      systemSettings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    }
  }, [systemSettings]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(settings).map(([key, value]) => 
        supabase
          .from("system_settings")
          .update({ setting_value: value, updated_at: new Date().toISOString() })
          .eq("setting_key", key)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      toast.success(t('systemSettings.saveSuccess'));
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: () => {
      toast.error(t('systemSettings.saveFailed'));
    }
  });

  if (isLoading) {
    return (
      <AdminDashboardLayout title={t('systemSettings.title')}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={t('systemSettings.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('systemSettings.title')}</h2>
            <p className="text-muted-foreground">{t('systemSettings.subtitle')}</p>
          </div>
          <Button 
            onClick={() => saveMutation.mutate()} 
            disabled={!hasChanges || saveMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? t('systemSettings.saving') : t('systemSettings.saveChanges')}
          </Button>
        </div>

        {hasChanges && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              {t('systemSettings.unsavedChanges')}
            </span>
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('systemSettings.tabs.general')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t('systemSettings.tabs.security')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('systemSettings.tabs.notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('systemSettings.tabs.business')}</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{t('systemSettings.tabs.maintenance')}</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('systemSettings.general.title')}
                </CardTitle>
                <CardDescription>{t('systemSettings.general.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('systemSettings.general.platformName')}</Label>
                    <Input
                      value={settings.platform_name || ''}
                      onChange={(e) => updateSetting('platform_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('systemSettings.general.defaultLanguage')}</Label>
                    <Select
                      value={settings.default_language || 'nl'}
                      onValueChange={(v) => updateSetting('default_language', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nl">Nederlands</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('systemSettings.general.defaultTimezone')}</Label>
                    <Select
                      value={settings.default_timezone || 'Europe/Amsterdam'}
                      onValueChange={(v) => updateSetting('default_timezone', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Amsterdam">Europe/Amsterdam</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                        <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('systemSettings.general.dateFormat')}</Label>
                    <Select
                      value={settings.date_format || 'DD/MM/YYYY'}
                      onValueChange={(v) => updateSetting('date_format', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('systemSettings.general.timeFormat')}</Label>
                    <Select
                      value={settings.time_format || '24h'}
                      onValueChange={(v) => updateSetting('time_format', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24-{t('systemSettings.general.hour')}</SelectItem>
                        <SelectItem value="12h">12-{t('systemSettings.general.hour')} (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('systemSettings.security.title')}
                </CardTitle>
                <CardDescription>{t('systemSettings.security.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.security.sessionSettings')}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('systemSettings.security.sessionTimeout')}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="5"
                          max="480"
                          value={settings.session_timeout_minutes || 60}
                          onChange={(e) => updateSetting('session_timeout_minutes', parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">{t('systemSettings.security.minutes')}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('systemSettings.security.maxLoginAttempts')}</Label>
                      <Input
                        type="number"
                        min="3"
                        max="10"
                        value={settings.max_login_attempts || 5}
                        onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('systemSettings.security.lockoutDuration')}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="5"
                          max="120"
                          value={settings.lockout_duration_minutes || 30}
                          onChange={(e) => updateSetting('lockout_duration_minutes', parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">{t('systemSettings.security.minutes')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.security.passwordPolicy')}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('systemSettings.security.minLength')}</Label>
                      <Input
                        type="number"
                        min="6"
                        max="32"
                        value={settings.password_min_length || 8}
                        onChange={(e) => updateSetting('password_min_length', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t('systemSettings.security.requireSpecialChar')}</Label>
                      <Switch
                        checked={settings.require_special_char === true}
                        onCheckedChange={(v) => updateSetting('require_special_char', v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t('systemSettings.security.requireNumber')}</Label>
                      <Switch
                        checked={settings.require_number === true}
                        onCheckedChange={(v) => updateSetting('require_number', v)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t('systemSettings.notifications.title')}
                </CardTitle>
                <CardDescription>{t('systemSettings.notifications.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('systemSettings.notifications.emailEnabled')}</Label>
                    <p className="text-sm text-muted-foreground">{t('systemSettings.notifications.emailEnabledDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.email_notifications_enabled === true}
                    onCheckedChange={(v) => updateSetting('email_notifications_enabled', v)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.notifications.alertThresholds')}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('systemSettings.notifications.lowBattery')}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="5"
                          max="50"
                          value={settings.low_battery_threshold || 20}
                          onChange={(e) => updateSetting('low_battery_threshold', parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('systemSettings.notifications.inactivityAlert')}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="72"
                          value={settings.inactivity_alert_hours || 24}
                          onChange={(e) => updateSetting('inactivity_alert_hours', parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">{t('systemSettings.notifications.hours')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('systemSettings.business.title')}
                </CardTitle>
                <CardDescription>{t('systemSettings.business.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.business.operatingHours')}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('systemSettings.business.startTime')}</Label>
                      <Input
                        type="time"
                        value={settings.business_hours_start || '08:00'}
                        onChange={(e) => updateSetting('business_hours_start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('systemSettings.business.endTime')}</Label>
                      <Input
                        type="time"
                        value={settings.business_hours_end || '18:00'}
                        onChange={(e) => updateSetting('business_hours_end', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.business.emergencyContact')}</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('systemSettings.business.contactName')}</Label>
                      <Input
                        value={settings.emergency_contact_name || ''}
                        onChange={(e) => updateSetting('emergency_contact_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('systemSettings.business.contactPhone')}</Label>
                      <Input
                        value={settings.emergency_contact_phone || ''}
                        onChange={(e) => updateSetting('emergency_contact_phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Settings */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t('systemSettings.maintenance.title')}
                </CardTitle>
                <CardDescription>{t('systemSettings.maintenance.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">{t('systemSettings.maintenance.maintenanceMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('systemSettings.maintenance.maintenanceModeDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode === true}
                    onCheckedChange={(v) => updateSetting('maintenance_mode', v)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">{t('systemSettings.maintenance.dataRetention')}</h4>
                  <div className="space-y-2">
                    <Label>{t('systemSettings.maintenance.retentionPeriod')}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="30"
                        max="1825"
                        value={settings.data_retention_days || 365}
                        onChange={(e) => updateSetting('data_retention_days', parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">{t('systemSettings.maintenance.days')}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('systemSettings.maintenance.autoBackup')}</Label>
                    <p className="text-sm text-muted-foreground">{t('systemSettings.maintenance.autoBackupDesc')}</p>
                  </div>
                  <Switch
                    checked={settings.auto_backup_enabled === true}
                    onCheckedChange={(v) => updateSetting('auto_backup_enabled', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

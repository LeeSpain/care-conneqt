-- Create system_settings table for platform configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage system settings
CREATE POLICY "Admins can manage system settings"
  ON public.system_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value, category, description) VALUES
('platform_name', '"Conneqt Care"', 'general', 'Platform display name'),
('default_language', '"nl"', 'general', 'Default language for new users'),
('default_timezone', '"Europe/Amsterdam"', 'general', 'Default timezone'),
('date_format', '"DD/MM/YYYY"', 'general', 'Date display format'),
('time_format', '"24h"', 'general', 'Time display format (12h or 24h)'),
('session_timeout_minutes', '60', 'security', 'Session timeout in minutes'),
('password_min_length', '8', 'security', 'Minimum password length'),
('require_special_char', 'true', 'security', 'Require special character in passwords'),
('require_number', 'true', 'security', 'Require number in passwords'),
('max_login_attempts', '5', 'security', 'Maximum failed login attempts before lockout'),
('lockout_duration_minutes', '30', 'security', 'Account lockout duration in minutes'),
('email_notifications_enabled', 'true', 'notifications', 'Enable email notifications'),
('alert_email_recipients', '[]', 'notifications', 'Email addresses for system alerts'),
('low_battery_threshold', '20', 'notifications', 'Device battery threshold for alerts (%)'),
('inactivity_alert_hours', '24', 'notifications', 'Hours of inactivity before alert'),
('business_hours_start', '"08:00"', 'business', 'Business hours start time'),
('business_hours_end', '"18:00"', 'business', 'Business hours end time'),
('business_days', '["monday","tuesday","wednesday","thursday","friday"]', 'business', 'Business days'),
('emergency_contact_name', '"Emergency Support"', 'business', 'Emergency contact name'),
('emergency_contact_phone', '"+31 800 1234"', 'business', 'Emergency contact phone'),
('data_retention_days', '365', 'maintenance', 'Days to retain activity logs'),
('auto_backup_enabled', 'true', 'maintenance', 'Enable automatic backups'),
('maintenance_mode', 'false', 'maintenance', 'Enable maintenance mode');
import { DashboardLayout } from '@/components/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Globe, User, Bot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');
  const location = useLocation();

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User, path: '/settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings#notifications' },
    { id: 'language', label: 'Language & Region', icon: Globe, path: '/settings#language' },
    { id: 'security', label: 'Security', icon: Lock, path: '/settings#security' },
    ...(isAdmin ? [
      { id: 'ai-agents', label: 'AI Agents', icon: Bot, path: '/dashboard/admin/ai-agents' },
      { id: 'users', label: 'User Management', icon: User, path: '/dashboard/admin/users' }
    ] : []),
  ];

  return (
    <DashboardLayout title={t('common:sidebar.settings')}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <aside className="lg:w-64 space-y-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = section.path === '/dashboard/admin/ai-agents' || section.path === '/dashboard/admin/users'
                ? location.pathname === section.path
                : location.pathname === '/settings' && location.hash === section.path.split('#')[1];
              
              return (
                <Link
                  key={section.id}
                  to={section.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          <Card id="profile">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+31 6 12345678" />
            </div>
            <Button>{t('common:buttons.save')}</Button>
          </CardContent>
        </Card>

          {/* Notification Settings */}
          <Card id="notifications">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive urgent alerts via SMS
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

          {/* Language Settings */}
          <Card id="language">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Language & Region</CardTitle>
            </div>
            <CardDescription>
              Set your preferred language and region
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" value="Nederlands" disabled />
              <p className="text-sm text-muted-foreground">
                Use the language switcher in the navigation to change languages
              </p>
            </div>
          </CardContent>
        </Card>

          {/* Security Settings */}
          <Card id="security">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

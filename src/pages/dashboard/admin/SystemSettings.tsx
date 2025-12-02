import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function SystemSettings() {
  const { t } = useTranslation('dashboard-admin');

  return (
    <AdminDashboardLayout title={t('systemSettings.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('systemSettings.title')}</h2>
          <p className="text-muted-foreground">
            {t('systemSettings.subtitle')}
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('systemSettings.general.title')}</CardTitle>
              <CardDescription>{t('systemSettings.general.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('systemSettings.comingSoon')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('systemSettings.security.title')}</CardTitle>
              <CardDescription>{t('systemSettings.security.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('systemSettings.comingSoon')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('systemSettings.notifications.title')}</CardTitle>
              <CardDescription>{t('systemSettings.notifications.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('systemSettings.comingSoon')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

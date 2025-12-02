import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Analytics() {
  const { t } = useTranslation('dashboard-admin');

  return (
    <AdminDashboardLayout title={t('analytics.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('analytics.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.userGrowth')}</CardTitle>
              <CardDescription>{t('analytics.userGrowthDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('analytics.comingSoon')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.engagement')}</CardTitle>
              <CardDescription>{t('analytics.engagementDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('analytics.comingSoon')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.performance')}</CardTitle>
              <CardDescription>{t('analytics.performanceDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('analytics.comingSoon')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

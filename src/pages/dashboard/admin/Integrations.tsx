import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Integrations() {
  const { t } = useTranslation('dashboard-admin');

  const handleEnableStripe = () => {
    window.open('https://dashboard.stripe.com/register', '_blank');
  };

  return (
    <AdminDashboardLayout title={t('integrations.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('integrations.title')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('integrations.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('integrations.stripe.title')}</CardTitle>
                  <CardDescription>{t('integrations.stripe.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('integrations.stripe.details')}
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('integrations.stripe.benefits')}:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>{t('integrations.stripe.benefit1')}</li>
                  <li>{t('integrations.stripe.benefit2')}</li>
                  <li>{t('integrations.stripe.benefit3')}</li>
                  <li>{t('integrations.stripe.benefit4')}</li>
                </ul>
              </div>
              <Button onClick={handleEnableStripe} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('integrations.stripe.setupButton')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t('integrations.stripe.note')}
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>{t('integrations.comingSoon.title')}</CardTitle>
              <CardDescription>{t('integrations.comingSoon.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('integrations.comingSoon.details')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

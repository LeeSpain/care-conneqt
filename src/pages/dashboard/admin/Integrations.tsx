import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ExternalLink, Settings, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

export default function Integrations() {
  const { t } = useTranslation('dashboard-admin');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleEnableStripe = () => {
    window.open('https://dashboard.stripe.com/register', '_blank');
  };

  const handleSaveStripeConfig = () => {
    // TODO: Save to secrets when backend is ready
    toast.success(t('integrations.stripe.configSaved'));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Webhook endpoint URL for Stripe configuration
  const webhookEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-webhook`;

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

          {/* Stripe Configuration Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('integrations.stripeConfig.title')}</CardTitle>
                  <CardDescription>{t('integrations.stripeConfig.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-endpoint">{t('integrations.stripeConfig.webhookEndpoint')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-endpoint"
                    value={webhookEndpoint}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(webhookEndpoint, 'webhook')}
                  >
                    {copied === 'webhook' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('integrations.stripeConfig.webhookEndpointHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret">{t('integrations.stripeConfig.secretKey')}</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  placeholder="sk_live_..."
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t('integrations.stripeConfig.secretKeyHelp')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">{t('integrations.stripeConfig.webhookSecret')}</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="whsec_..."
                  value={stripeWebhookSecret}
                  onChange={(e) => setStripeWebhookSecret(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t('integrations.stripeConfig.webhookSecretHelp')}
                </p>
              </div>

              <Button onClick={handleSaveStripeConfig} className="w-full" disabled>
                {t('integrations.stripeConfig.saveButton')}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t('integrations.stripeConfig.comingSoon')}
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

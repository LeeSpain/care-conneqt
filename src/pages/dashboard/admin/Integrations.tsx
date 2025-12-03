import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Settings, Copy, Check, CheckCircle2, XCircle, Plug, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Integrations() {
  const { t } = useTranslation('dashboard-admin');
  const [copied, setCopied] = useState<string | null>(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check Stripe connection status on mount
  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    setCheckingStatus(true);
    try {
      // Try to call an edge function that checks if Stripe is configured
      const { data, error } = await supabase.functions.invoke('clara-checkout', {
        body: { action: 'check_status' }
      });
      
      // If we get a response without STRIPE_SECRET_KEY error, it's connected
      setStripeConnected(!error && data?.status !== 'not_configured');
    } catch (err) {
      setStripeConnected(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSetupStripe = () => {
    window.open('https://dashboard.stripe.com/register', '_blank');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(t('integrations.copied'));
    setTimeout(() => setCopied(null), 2000);
  };

  // Webhook endpoint URL for Stripe configuration
  const webhookEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-webhook`;

  const integrationsList = [
    {
      id: 'twilio',
      name: 'Twilio',
      description: t('integrations.twilio.description'),
      status: 'coming_soon',
      icon: '📱'
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: t('integrations.sendgrid.description'),
      status: 'coming_soon',
      icon: '📧'
    },
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      description: t('integrations.googleCalendar.description'),
      status: 'coming_soon',
      icon: '📅'
    }
  ];

  return (
    <AdminDashboardLayout title={t('integrations.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('integrations.title')}</h2>
          <p className="text-muted-foreground mt-2">
            {t('integrations.subtitle')}
          </p>
        </div>

        {/* Stripe Integration - Main Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t('integrations.stripe.title')}
                    {checkingStatus ? (
                      <Badge variant="outline">{t('integrations.status.checking')}</Badge>
                    ) : stripeConnected ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {t('integrations.status.connected')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                        <XCircle className="h-3 w-3 mr-1" />
                        {t('integrations.status.notConnected')}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{t('integrations.stripe.description')}</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={handleSetupStripe}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('integrations.stripe.dashboard')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Benefits */}
              <div className="space-y-3">
                <p className="text-sm font-medium">{t('integrations.stripe.benefits')}:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('integrations.stripe.benefit1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('integrations.stripe.benefit2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('integrations.stripe.benefit3')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('integrations.stripe.benefit4')}
                  </li>
                </ul>
              </div>

              {/* Webhook Configuration */}
              <div className="space-y-3">
                <p className="text-sm font-medium">{t('integrations.stripeConfig.webhookEndpoint')}</p>
                <div className="flex gap-2">
                  <Input
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
            </div>

            {/* Setup Instructions */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('integrations.stripeConfig.setupInstructions')}
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>{t('integrations.stripeConfig.step1')}</li>
                <li>{t('integrations.stripeConfig.step2')}</li>
                <li>{t('integrations.stripeConfig.step3')}</li>
                <li>{t('integrations.stripeConfig.step4')}</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                {t('integrations.stripe.note')}
              </p>
              <Button onClick={checkStripeStatus} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('integrations.status.refresh')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Other Integrations Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('integrations.otherIntegrations')}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {integrationsList.map((integration) => (
              <Card key={integration.id} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{integration.icon}</span>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{t('integrations.comingSoon.badge')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API & Webhooks Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plug className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('integrations.api.title')}</CardTitle>
                <CardDescription>{t('integrations.api.description')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('integrations.api.details')}
            </p>
            <Button variant="outline" className="mt-4" disabled>
              {t('integrations.api.viewDocs')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

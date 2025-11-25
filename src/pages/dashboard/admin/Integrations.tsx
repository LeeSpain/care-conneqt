import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";

export default function Integrations() {
  const handleEnableStripe = () => {
    window.open('https://dashboard.stripe.com/register', '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect external services to extend platform capabilities
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
                <CardTitle>Stripe Payments</CardTitle>
                <CardDescription>Process payments and subscriptions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable Stripe to allow Clara AI to process payments, create checkout sessions, and manage subscriptions directly through conversations.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Clara can complete sales end-to-end</li>
                <li>Automatic order tracking</li>
                <li>Secure payment processing</li>
                <li>Subscription management</li>
              </ul>
            </div>
            <Button onClick={handleEnableStripe} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Set Up Stripe Integration
            </Button>
            <p className="text-xs text-muted-foreground">
              You'll need to create a Stripe account and add your API keys in Lovable secrets management.
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle>More Integrations Coming Soon</CardTitle>
            <CardDescription>Additional integrations will be available here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Future integrations may include email marketing, CRM systems, and analytics platforms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

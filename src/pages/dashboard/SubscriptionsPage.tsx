import { useEffect, useState } from 'react';
import { MemberDashboardLayout } from '@/components/MemberDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Download, Shield, AlertCircle } from 'lucide-react';
import { packages } from '@/data/pricing';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setMember(data);
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <MemberDashboardLayout title="Subscriptions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MemberDashboardLayout>
    );
  }

  const currentPackage = packages.find(
    pkg => pkg.id === member?.subscription_tier
  ) || packages[0];

  return (
    <MemberDashboardLayout title="Subscriptions">
      <div className="space-y-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Current Subscription</CardTitle>
                <CardDescription className="mt-2">
                  Manage your subscription and billing
                </CardDescription>
              </div>
              <Badge variant={member?.subscription_status === 'active' ? 'default' : 'secondary'}>
                {member?.subscription_status || 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{currentPackage.name}</h3>
                <p className="text-3xl font-bold mt-2">
                  €{currentPackage.price}
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Included in your plan:</h4>
                <ul className="space-y-2">
                  {currentPackage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Next billing date</p>
                  <p className="font-medium mt-1">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment method</p>
                  <p className="font-medium mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/subscriptions/manage')}>
                  Manage Subscription
                </Button>
                <Button variant="outline">
                  Update Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>
              Get access to more features and enhanced support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => {
                const isCurrent = pkg.id === member?.subscription_tier;
                const isUpgrade = pkg.price > currentPackage.price;

                return (
                  <Card key={pkg.id} className={isCurrent ? 'border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        {isCurrent && <Badge>Current</Badge>}
                      </div>
                      <div className="text-2xl font-bold">
                        €{pkg.price}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{pkg.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                      {isCurrent ? (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : isUpgrade ? (
                        <Button className="w-full">
                          Upgrade
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View and download your past invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: '2025-09-04', amount: currentPackage.price, status: 'Paid', invoice: 'INV-2025-09' },
                { date: '2025-08-04', amount: currentPackage.price, status: 'Paid', invoice: 'INV-2025-08' },
                { date: '2025-07-04', amount: currentPackage.price, status: 'Paid', invoice: 'INV-2025-07' },
                { date: '2025-06-04', amount: currentPackage.price, status: 'Paid', invoice: 'INV-2025-06' },
              ].map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.invoice}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">€{payment.amount.toFixed(2)}</p>
                      <Badge variant="secondary" className="mt-1">
                        {payment.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium">Data & Privacy</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your personal data and privacy settings
                  </p>
                  <Button variant="link" className="px-0 mt-2">
                    Privacy Settings
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <CreditCard className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium">Billing Information</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update your billing address and payment methods
                  </p>
                  <Button variant="link" className="px-0 mt-2">
                    Update Billing
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg border-destructive/50">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium">Cancel Subscription</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cancel your subscription at any time. You'll retain access until the end of your billing period.
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-destructive">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MemberDashboardLayout>
  );
}

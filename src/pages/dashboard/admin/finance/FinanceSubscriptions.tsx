import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "@/hooks/useFinance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Eye, 
  Pause, 
  Play, 
  XCircle,
  Calendar,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceSubscriptions() {
  const { t } = useTranslation('dashboard-admin');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  const { data: subscriptions, isLoading, refetch } = useSubscriptions(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
      expired: 'bg-muted text-muted-foreground',
      past_due: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return (
      <Badge variant="outline" className={styles[status] || ''}>
        {status}
      </Badge>
    );
  };

  const filteredSubscriptions = subscriptions?.filter((sub: any) => {
    if (!searchTerm) return true;
    const memberName = `${sub.members?.profiles?.first_name || ''} ${sub.members?.profiles?.last_name || ''}`.toLowerCase();
    const email = (sub.members?.profiles?.email || '').toLowerCase();
    return memberName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: subscriptions?.length || 0,
    active: subscriptions?.filter((s: any) => s.status === 'active').length || 0,
    paused: subscriptions?.filter((s: any) => s.status === 'paused').length || 0,
    cancelled: subscriptions?.filter((s: any) => s.status === 'cancelled').length || 0,
  };

  return (
    <AdminDashboardLayout title={t('finance.subscriptions.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.subscriptions.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.subscriptions.subtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common:buttons.refresh')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.subscriptions.total')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.subscriptions.active')}</CardTitle>
              <Play className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.subscriptions.paused')}</CardTitle>
              <Pause className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.paused}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.subscriptions.cancelled')}</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('finance.subscriptions.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('finance.subscriptions.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:status.all')}</SelectItem>
                  <SelectItem value="active">{t('common:status.active')}</SelectItem>
                  <SelectItem value="paused">{t('finance.subscriptions.paused')}</SelectItem>
                  <SelectItem value="cancelled">{t('finance.subscriptions.cancelled')}</SelectItem>
                  <SelectItem value="expired">{t('finance.subscriptions.expired')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.subscriptions.allSubscriptions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredSubscriptions && filteredSubscriptions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('finance.subscriptions.member')}</TableHead>
                    <TableHead>{t('finance.subscriptions.plan')}</TableHead>
                    <TableHead>{t('finance.subscriptions.amount')}</TableHead>
                    <TableHead>{t('finance.subscriptions.billing')}</TableHead>
                    <TableHead>{t('finance.subscriptions.periodEnd')}</TableHead>
                    <TableHead>{t('common:status')}</TableHead>
                    <TableHead>{t('common:actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {sub.members?.profiles?.first_name} {sub.members?.profiles?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {sub.members?.profiles?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.pricing_plans?.slug || 'Custom'}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        €{Number(sub.monthly_amount).toFixed(2)}/mo
                      </TableCell>
                      <TableCell className="capitalize">{sub.billing_interval}</TableCell>
                      <TableCell>
                        {sub.current_period_end ? 
                          format(new Date(sub.current_period_end), 'MMM d, yyyy') : 
                          '—'
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedSubscription(sub)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('finance.subscriptions.noSubscriptions')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Detail Dialog */}
        <Dialog open={!!selectedSubscription} onOpenChange={() => setSelectedSubscription(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('finance.subscriptions.details')}</DialogTitle>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-6">
                {/* Member Info */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedSubscription.members?.profiles?.first_name} {selectedSubscription.members?.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.members?.profiles?.email}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {getStatusBadge(selectedSubscription.status)}
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.subscriptions.plan')}</p>
                    <p className="font-medium">{selectedSubscription.pricing_plans?.slug || 'Custom'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.subscriptions.amount')}</p>
                    <p className="font-medium">€{Number(selectedSubscription.monthly_amount).toFixed(2)}/mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.subscriptions.billing')}</p>
                    <p className="font-medium capitalize">{selectedSubscription.billing_interval}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.subscriptions.currency')}</p>
                    <p className="font-medium">{selectedSubscription.currency}</p>
                  </div>
                </div>

                {/* Billing Period */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t('finance.subscriptions.billingPeriod')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('finance.subscriptions.periodStart')}</p>
                      <p>{selectedSubscription.current_period_start ? 
                        format(new Date(selectedSubscription.current_period_start), 'PPP') : '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('finance.subscriptions.periodEnd')}</p>
                      <p>{selectedSubscription.current_period_end ? 
                        format(new Date(selectedSubscription.current_period_end), 'PPP') : '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Stripe Info */}
                {selectedSubscription.stripe_subscription_id && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{t('finance.subscriptions.paymentInfo')}</span>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">{t('finance.subscriptions.stripeId')}</p>
                      <p className="font-mono text-xs">{selectedSubscription.stripe_subscription_id}</p>
                    </div>
                  </div>
                )}

                {/* Items */}
                {selectedSubscription.subscription_items?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">{t('finance.subscriptions.items')}</p>
                    <div className="space-y-2">
                      {selectedSubscription.subscription_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span className="text-sm">{item.description || item.product_type}</span>
                          <span className="text-sm font-medium">
                            {item.quantity}x €{Number(item.unit_price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedSubscription.status === 'active' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      {t('finance.subscriptions.pause')}
                    </Button>
                  )}
                  {selectedSubscription.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      {t('finance.subscriptions.resume')}
                    </Button>
                  )}
                  {selectedSubscription.status !== 'cancelled' && (
                    <Button variant="destructive" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('finance.subscriptions.cancel')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}

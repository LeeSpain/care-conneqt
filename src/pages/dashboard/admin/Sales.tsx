import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, ShoppingCart, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";

export default function Sales() {
  const { t } = useTranslation('dashboard-admin');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['clara-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          pricing_plans(slug),
          ai_agent_conversations(conversation_data)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const stats = {
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + (parseFloat(order.total_monthly?.toString() || '0')), 0) || 0,
    pendingOrders: orders?.filter(o => o.payment_status === 'pending').length || 0,
    completedOrders: orders?.filter(o => o.payment_status === 'completed').length || 0,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      completed: "default",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error(t('toast.error.updateFailed'));
      return;
    }

    toast.success(t('toast.success.orderUpdated'));
    refetch();
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, payment_status: newStatus });
    }
  };

  return (
    <AdminDashboardLayout title={t('sales.title')}>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('sales.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('sales.subtitle')}
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.totalOrders')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}/mo</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.completed')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('sales.pending')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('sales.recentOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">{t('common:loading.default')}</p>
          ) : orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('sales.customer')}</TableHead>
                  <TableHead>{t('sales.plan')}</TableHead>
                  <TableHead>{t('sales.amount')}</TableHead>
                  <TableHead>{t('common:status')}</TableHead>
                  <TableHead>{t('sales.date')}</TableHead>
                  <TableHead>{t('common:actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name || t('sales.anonymous')}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.pricing_plans?.slug || t('common:na')}</Badge>
                    </TableCell>
                    <TableCell>€{order.total_monthly}/mo</TableCell>
                    <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('sales.noOrders')}</p>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('sales.orderDetails')}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Status Update */}
                <div>
                  <Label>{t('sales.paymentStatus')}</Label>
                  <Select 
                    value={selectedOrder.payment_status} 
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t('sales.pending')}</SelectItem>
                      <SelectItem value="completed">{t('sales.completed')}</SelectItem>
                      <SelectItem value="failed">{t('sales.failed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('sales.customerInformation')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t('sales.name')}</Label>
                      <p className="font-medium">{selectedOrder.customer_name || t('common:na')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('sales.email')}</Label>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('sales.phone')}</Label>
                      <p className="font-medium">{selectedOrder.customer_phone || t('common:na')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('sales.language')}</Label>
                      <p className="font-medium">{selectedOrder.language?.toUpperCase() || t('common:na')}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('sales.orderDetails')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t('sales.plan')}</Label>
                      <p className="font-medium">{selectedOrder.pricing_plans?.slug || t('common:na')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('sales.monthlyTotal')}</Label>
                      <p className="font-medium text-lg">€{selectedOrder.total_monthly}/mo</p>
                    </div>
                  </div>
                  
                  {selectedOrder.selected_devices && (
                    <div>
                      <Label className="text-muted-foreground">{t('sales.selectedDevices')}</Label>
                      <div className="mt-2 space-y-1">
                        {Object.entries(selectedOrder.selected_devices).map(([device, quantity]: [string, any]) => (
                          quantity > 0 && (
                            <p key={device} className="text-sm">
                              {device}: {quantity}x
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="border-t pt-4 text-sm text-muted-foreground">
                  <p>{t('sales.orderId')}: {selectedOrder.id}</p>
                  <p>{t('sales.created')}: {format(new Date(selectedOrder.created_at), 'PPpp')}</p>
                  {selectedOrder.completed_at && (
                    <p>{t('sales.completed')}: {format(new Date(selectedOrder.completed_at), 'PPpp')}</p>
                  )}
                  {selectedOrder.stripe_session_id && (
                    <p>{t('sales.stripeSession')}: {selectedOrder.stripe_session_id}</p>
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

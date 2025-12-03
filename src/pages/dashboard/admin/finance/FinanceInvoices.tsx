import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useInvoices, getCustomerName, getCustomerEmail, type CustomerType } from "@/hooks/useFinance";
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
  FileText, 
  Search, 
  Eye, 
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CustomerTypeBadge } from "@/components/finance/CustomerTypeBadge";
import { CustomerTypeFilter } from "@/components/finance/CustomerTypeFilter";

export default function FinanceInvoices() {
  const { t } = useTranslation('dashboard-admin');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data: invoices, isLoading, refetch } = useInvoices({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    customerType: customerTypeFilter !== 'all' ? customerTypeFilter as CustomerType : undefined,
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      paid: { class: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: <Clock className="h-3 w-3" /> },
      overdue: { class: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <AlertCircle className="h-3 w-3" /> },
      draft: { class: 'bg-muted text-muted-foreground', icon: <FileText className="h-3 w-3" /> },
      cancelled: { class: 'bg-muted text-muted-foreground', icon: null },
      refunded: { class: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: null },
    };
    const style = styles[status] || styles.draft;
    return (
      <Badge variant="outline" className={`${style.class} flex items-center gap-1`}>
        {style.icon}
        {status}
      </Badge>
    );
  };

  const filteredInvoices = invoices?.filter((inv: any) => {
    if (!searchTerm) return true;
    const customerName = getCustomerName(inv).toLowerCase();
    const invoiceNum = (inv.invoice_number || '').toLowerCase();
    return customerName.includes(searchTerm.toLowerCase()) || invoiceNum.includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: invoices?.length || 0,
    paid: invoices?.filter((i: any) => i.status === 'paid').length || 0,
    pending: invoices?.filter((i: any) => i.status === 'pending').length || 0,
    overdue: invoices?.filter((i: any) => i.status === 'overdue').length || 0,
    totalAmount: invoices?.reduce((sum: number, i: any) => sum + Number(i.total || 0), 0) || 0,
    paidAmount: invoices?.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + Number(i.total || 0), 0) || 0,
  };

  return (
    <AdminDashboardLayout title={t('finance.invoices.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.invoices.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.invoices.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common:buttons.refresh')}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t('finance.invoices.create')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.invoices.total')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">€{stats.totalAmount.toFixed(2)} {t('finance.invoices.totalValue')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.paid')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.paid}</div>
              <p className="text-xs text-muted-foreground">€{stats.paidAmount.toFixed(2)} {t('finance.invoices.collected')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.pending')}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.overdue')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
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
                  placeholder={t('finance.invoices.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <CustomerTypeFilter value={customerTypeFilter} onChange={setCustomerTypeFilter} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('finance.invoices.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:status.all')}</SelectItem>
                  <SelectItem value="draft">{t('finance.invoices.draft')}</SelectItem>
                  <SelectItem value="pending">{t('finance.pending')}</SelectItem>
                  <SelectItem value="paid">{t('finance.paid')}</SelectItem>
                  <SelectItem value="overdue">{t('finance.overdue')}</SelectItem>
                  <SelectItem value="cancelled">{t('finance.invoices.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.invoices.allInvoices')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredInvoices && filteredInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('finance.invoices.invoiceNumber')}</TableHead>
                    <TableHead>{t('finance.customerType')}</TableHead>
                    <TableHead>{t('finance.invoices.customer')}</TableHead>
                    <TableHead>{t('finance.invoices.amount')}</TableHead>
                    <TableHead>{t('finance.invoices.dueDate')}</TableHead>
                    <TableHead>{t('common:status')}</TableHead>
                    <TableHead>{t('common:actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv: any) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono font-medium">{inv.invoice_number}</TableCell>
                      <TableCell>
                        <CustomerTypeBadge customerType={inv.customer_type} showLabel={false} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getCustomerName(inv)}</p>
                          <p className="text-sm text-muted-foreground">{getCustomerEmail(inv)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">€{Number(inv.total).toFixed(2)}</p>
                          {inv.amount_due > 0 && inv.amount_due !== inv.total && (
                            <p className="text-xs text-muted-foreground">
                              {t('finance.invoices.due')}: €{Number(inv.amount_due).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {inv.due_date ? format(new Date(inv.due_date), 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell>{getStatusBadge(inv.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedInvoice(inv)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('finance.invoices.noInvoices')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Detail Dialog */}
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('finance.invoices.details')}</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold font-mono">{selectedInvoice.invoice_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('finance.invoices.created')}: {format(new Date(selectedInvoice.created_at), 'PPP')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomerTypeBadge customerType={selectedInvoice.customer_type} />
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>

                <Separator />

                {/* Customer Info */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{t('finance.invoices.billTo')}</p>
                  <p className="font-medium">{getCustomerName(selectedInvoice)}</p>
                  <p className="text-sm text-muted-foreground">{getCustomerEmail(selectedInvoice)}</p>
                </div>

                {/* Line Items */}
                {selectedInvoice.invoice_items?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{t('finance.invoices.items')}</p>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('finance.invoices.description')}</TableHead>
                            <TableHead className="text-right">{t('finance.invoices.qty')}</TableHead>
                            <TableHead className="text-right">{t('finance.invoices.price')}</TableHead>
                            <TableHead className="text-right">{t('finance.invoices.total')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.invoice_items.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">€{Number(item.unit_price).toFixed(2)}</TableCell>
                              <TableCell className="text-right">€{Number(item.total).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('finance.invoices.subtotal')}</span>
                      <span>€{Number(selectedInvoice.subtotal).toFixed(2)}</span>
                    </div>
                    {selectedInvoice.tax_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{t('finance.invoices.tax')} ({selectedInvoice.tax_rate}%)</span>
                        <span>€{Number(selectedInvoice.tax_amount).toFixed(2)}</span>
                      </div>
                    )}
                    {selectedInvoice.discount_amount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>{t('finance.invoices.discount')}</span>
                        <span>-€{Number(selectedInvoice.discount_amount).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>{t('finance.invoices.total')}</span>
                      <span>€{Number(selectedInvoice.total).toFixed(2)}</span>
                    </div>
                    {selectedInvoice.amount_paid > 0 && (
                      <>
                        <div className="flex justify-between text-sm text-green-500">
                          <span>{t('finance.invoices.paid')}</span>
                          <span>-€{Number(selectedInvoice.amount_paid).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>{t('finance.invoices.amountDue')}</span>
                          <span>€{Number(selectedInvoice.amount_due).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t('finance.invoices.download')}
                  </Button>
                  {selectedInvoice.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      {t('finance.invoices.sendReminder')}
                    </Button>
                  )}
                  {selectedInvoice.status !== 'paid' && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('finance.invoices.markPaid')}
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

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useTransactions } from "@/hooks/useFinance";
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
  Receipt, 
  Search, 
  Eye, 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceTransactions() {
  const { t } = useTranslation('dashboard-admin');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { data: transactions, isLoading, refetch } = useTransactions({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const getTypeBadge = (type: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      payment: { class: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <ArrowUpRight className="h-3 w-3" /> },
      refund: { class: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <ArrowDownRight className="h-3 w-3" /> },
      credit: { class: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <CreditCard className="h-3 w-3" /> },
      adjustment: { class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: null },
      chargeback: { class: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: null },
    };
    const style = styles[type] || styles.payment;
    return (
      <Badge variant="outline" className={`${style.class} flex items-center gap-1`}>
        {style.icon}
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      completed: { class: 'bg-green-500/10 text-green-500', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { class: 'bg-yellow-500/10 text-yellow-500', icon: <Clock className="h-3 w-3" /> },
      processing: { class: 'bg-blue-500/10 text-blue-500', icon: <RefreshCw className="h-3 w-3" /> },
      failed: { class: 'bg-red-500/10 text-red-500', icon: <XCircle className="h-3 w-3" /> },
      cancelled: { class: 'bg-muted text-muted-foreground', icon: null },
    };
    const style = styles[status] || styles.pending;
    return (
      <Badge variant="outline" className={`${style.class} flex items-center gap-1`}>
        {style.icon}
        {status}
      </Badge>
    );
  };

  const filteredTransactions = transactions?.filter((tx: any) => {
    if (!searchTerm) return true;
    const memberName = `${tx.members?.profiles?.first_name || ''} ${tx.members?.profiles?.last_name || ''}`.toLowerCase();
    return memberName.includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: transactions?.length || 0,
    totalAmount: transactions?.filter((t: any) => t.transaction_type === 'payment' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0) || 0,
    refundedAmount: transactions?.filter((t: any) => t.transaction_type === 'refund' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0) || 0,
    failedCount: transactions?.filter((t: any) => t.status === 'failed').length || 0,
  };

  return (
    <AdminDashboardLayout title={t('finance.transactions.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.transactions.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.transactions.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common:buttons.refresh')}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('finance.transactions.export')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.transactions.total')}</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.transactions.collected')}</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">€{stats.totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.transactions.refunded')}</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">€{stats.refundedAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.transactions.failed')}</CardTitle>
              <XCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.failedCount}</div>
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
                  placeholder={t('finance.transactions.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('finance.transactions.filterByType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:status.all')}</SelectItem>
                  <SelectItem value="payment">{t('finance.transactions.payment')}</SelectItem>
                  <SelectItem value="refund">{t('finance.transactions.refund')}</SelectItem>
                  <SelectItem value="credit">{t('finance.transactions.credit')}</SelectItem>
                  <SelectItem value="adjustment">{t('finance.transactions.adjustment')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('finance.transactions.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:status.all')}</SelectItem>
                  <SelectItem value="completed">{t('finance.transactions.completed')}</SelectItem>
                  <SelectItem value="pending">{t('finance.pending')}</SelectItem>
                  <SelectItem value="processing">{t('finance.transactions.processing')}</SelectItem>
                  <SelectItem value="failed">{t('finance.transactions.failedStatus')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.transactions.allTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('finance.transactions.date')}</TableHead>
                    <TableHead>{t('finance.transactions.type')}</TableHead>
                    <TableHead>{t('finance.transactions.customer')}</TableHead>
                    <TableHead>{t('finance.transactions.amount')}</TableHead>
                    <TableHead>{t('finance.transactions.method')}</TableHead>
                    <TableHead>{t('common:status')}</TableHead>
                    <TableHead>{t('common:actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx: any) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{format(new Date(tx.created_at), 'MMM d, yyyy')}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), 'HH:mm')}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(tx.transaction_type)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {tx.members?.profiles?.first_name} {tx.members?.profiles?.last_name}
                          </p>
                          {tx.invoices?.invoice_number && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {tx.invoices.invoice_number}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          tx.transaction_type === 'refund' || tx.transaction_type === 'chargeback' 
                            ? 'text-red-500' : ''
                        }`}>
                          {tx.transaction_type === 'refund' || tx.transaction_type === 'chargeback' ? '-' : ''}
                          €{Number(tx.amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{tx.payment_method || '—'}</span>
                          {tx.card_last_four && (
                            <span className="text-xs text-muted-foreground">•••• {tx.card_last_four}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedTransaction(tx)}
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
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('finance.transactions.noTransactions')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Detail Dialog */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('finance.transactions.details')}</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-6">
                {/* Amount Display */}
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <p className={`text-4xl font-bold ${
                    selectedTransaction.transaction_type === 'refund' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {selectedTransaction.transaction_type === 'refund' ? '-' : '+'}
                    €{Number(selectedTransaction.amount).toFixed(2)}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getTypeBadge(selectedTransaction.transaction_type)}
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.transactions.customer')}</p>
                    <p className="font-medium">
                      {selectedTransaction.members?.profiles?.first_name} {selectedTransaction.members?.profiles?.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.transactions.date')}</p>
                    <p className="font-medium">{format(new Date(selectedTransaction.created_at), 'PPpp')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.transactions.method')}</p>
                    <p className="font-medium capitalize">{selectedTransaction.payment_method || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('finance.transactions.currency')}</p>
                    <p className="font-medium">{selectedTransaction.currency}</p>
                  </div>
                </div>

                {/* Card Info */}
                {selectedTransaction.card_last_four && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium capitalize">{selectedTransaction.card_brand || 'Card'}</p>
                        <p className="text-sm text-muted-foreground">•••• •••• •••• {selectedTransaction.card_last_four}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stripe IDs */}
                {(selectedTransaction.stripe_payment_intent_id || selectedTransaction.stripe_charge_id) && (
                  <div className="space-y-2 text-sm">
                    {selectedTransaction.stripe_payment_intent_id && (
                      <div>
                        <span className="text-muted-foreground">Payment Intent: </span>
                        <span className="font-mono text-xs">{selectedTransaction.stripe_payment_intent_id}</span>
                      </div>
                    )}
                    {selectedTransaction.stripe_charge_id && (
                      <div>
                        <span className="text-muted-foreground">Charge ID: </span>
                        <span className="font-mono text-xs">{selectedTransaction.stripe_charge_id}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Failure Reason */}
                {selectedTransaction.failure_reason && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-500">
                      <strong>{t('finance.transactions.failureReason')}:</strong> {selectedTransaction.failure_reason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}

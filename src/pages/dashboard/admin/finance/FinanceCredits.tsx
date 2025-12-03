import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { useCredits, getCustomerName, getCustomerEmail, type CustomerType } from "@/hooks/useFinance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  Search, 
  Plus,
  RefreshCw,
  DollarSign,
  Gift,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CustomerTypeBadge } from "@/components/finance/CustomerTypeBadge";
import { CustomerTypeFilter } from "@/components/finance/CustomerTypeFilter";

export default function FinanceCredits() {
  const { t } = useTranslation('dashboard-admin');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [issueCreditOpen, setIssueCreditOpen] = useState(false);
  const [newCredit, setNewCredit] = useState({
    customerId: '',
    customerType: 'member' as CustomerType,
    amount: '',
    reason: '',
    expiresAt: ''
  });

  const { data: credits, isLoading, refetch } = useCredits({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    customerType: customerTypeFilter !== 'all' ? customerTypeFilter as CustomerType : undefined,
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      active: { class: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle className="h-3 w-3" /> },
      partially_applied: { class: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <Clock className="h-3 w-3" /> },
      applied: { class: 'bg-muted text-muted-foreground', icon: <CheckCircle className="h-3 w-3" /> },
      expired: { class: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="h-3 w-3" /> },
      cancelled: { class: 'bg-muted text-muted-foreground', icon: <XCircle className="h-3 w-3" /> },
    };
    const style = styles[status] || styles.active;
    return (
      <Badge variant="outline" className={`${style.class} flex items-center gap-1`}>
        {style.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredCredits = credits?.filter((credit: any) => {
    if (!searchTerm) return true;
    const customerName = getCustomerName(credit).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: credits?.length || 0,
    totalAmount: credits?.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0) || 0,
    activeAmount: credits?.filter((c: any) => c.status === 'active')
      .reduce((sum: number, c: any) => sum + Number(c.remaining_amount || 0), 0) || 0,
    appliedAmount: credits?.filter((c: any) => c.status === 'applied' || c.status === 'partially_applied')
      .reduce((sum: number, c: any) => sum + (Number(c.amount || 0) - Number(c.remaining_amount || 0)), 0) || 0,
  };

  const handleIssueCredit = async () => {
    if (!newCredit.customerId || !newCredit.amount || !newCredit.reason) {
      toast.error(t('finance.credits.fillRequired'));
      return;
    }

    const insertData: any = {
      amount: parseFloat(newCredit.amount),
      remaining_amount: parseFloat(newCredit.amount),
      reason: newCredit.reason,
      expires_at: newCredit.expiresAt || null,
      status: 'active',
      customer_type: newCredit.customerType
    };

    // Set the appropriate ID based on customer type
    switch (newCredit.customerType) {
      case 'facility':
        insertData.facility_id = newCredit.customerId;
        break;
      case 'care_company':
        insertData.care_company_id = newCredit.customerId;
        break;
      case 'insurance_company':
        insertData.insurance_company_id = newCredit.customerId;
        break;
      default:
        insertData.member_id = newCredit.customerId;
    }

    const { error } = await supabase.from('credits').insert(insertData);

    if (error) {
      toast.error(t('finance.credits.issueFailed'));
      return;
    }

    toast.success(t('finance.credits.issueSuccess'));
    setIssueCreditOpen(false);
    setNewCredit({ customerId: '', customerType: 'member', amount: '', reason: '', expiresAt: '' });
    refetch();
  };

  return (
    <AdminDashboardLayout title={t('finance.credits.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('finance.credits.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('finance.credits.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common:buttons.refresh')}
            </Button>
            <Button size="sm" onClick={() => setIssueCreditOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('finance.credits.issueCredit')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.credits.totalIssued')}</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">€{stats.totalAmount.toFixed(2)} {t('finance.credits.total')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.credits.activeCredits')}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">€{stats.activeAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t('finance.credits.outstanding')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.credits.applied')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">€{stats.appliedAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t('finance.credits.usedCredits')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('finance.credits.utilizationRate')}</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAmount > 0 ? Math.round((stats.appliedAmount / stats.totalAmount) * 100) : 0}%
              </div>
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
                  placeholder={t('finance.credits.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <CustomerTypeFilter value={customerTypeFilter} onChange={setCustomerTypeFilter} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('finance.credits.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common:status.all')}</SelectItem>
                  <SelectItem value="active">{t('common:status.active')}</SelectItem>
                  <SelectItem value="partially_applied">{t('finance.credits.partiallyApplied')}</SelectItem>
                  <SelectItem value="applied">{t('finance.credits.fullyApplied')}</SelectItem>
                  <SelectItem value="expired">{t('finance.credits.expired')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Credits Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('finance.credits.allCredits')}</CardTitle>
            <CardDescription>{t('finance.credits.allCreditsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredCredits && filteredCredits.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('finance.customerType')}</TableHead>
                    <TableHead>{t('finance.credits.customer')}</TableHead>
                    <TableHead>{t('finance.credits.originalAmount')}</TableHead>
                    <TableHead>{t('finance.credits.remaining')}</TableHead>
                    <TableHead>{t('finance.credits.reason')}</TableHead>
                    <TableHead>{t('finance.credits.expires')}</TableHead>
                    <TableHead>{t('common:status')}</TableHead>
                    <TableHead>{t('finance.credits.issued')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.map((credit: any) => (
                    <TableRow key={credit.id}>
                      <TableCell>
                        <CustomerTypeBadge customerType={credit.customer_type} showLabel={false} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getCustomerName(credit)}</p>
                          <p className="text-sm text-muted-foreground">{getCustomerEmail(credit)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">€{Number(credit.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={credit.remaining_amount > 0 ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                          €{Number(credit.remaining_amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm max-w-[200px] truncate block">{credit.reason}</span>
                      </TableCell>
                      <TableCell>
                        {credit.expires_at ? (
                          <span className={new Date(credit.expires_at) < new Date() ? 'text-red-500' : ''}>
                            {format(new Date(credit.expires_at), 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{t('finance.credits.noExpiry')}</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(credit.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(credit.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('finance.credits.noCredits')}</p>
                <Button className="mt-4" onClick={() => setIssueCreditOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('finance.credits.issueFirst')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue Credit Dialog */}
        <Dialog open={issueCreditOpen} onOpenChange={setIssueCreditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('finance.credits.issueCredit')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('finance.customerType')}</Label>
                <Select 
                  value={newCredit.customerType} 
                  onValueChange={(v) => setNewCredit({ ...newCredit, customerType: v as CustomerType, customerId: '' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">{t('finance.customerTypes.member')}</SelectItem>
                    <SelectItem value="facility">{t('finance.customerTypes.facility')}</SelectItem>
                    <SelectItem value="care_company">{t('finance.customerTypes.careCompany')}</SelectItem>
                    <SelectItem value="insurance_company">{t('finance.customerTypes.insurance')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('finance.credits.customerId')}</Label>
                <Input
                  placeholder={t('finance.credits.customerIdPlaceholder')}
                  value={newCredit.customerId}
                  onChange={(e) => setNewCredit({ ...newCredit, customerId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('finance.credits.amount')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newCredit.amount}
                    onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('finance.credits.reason')}</Label>
                <Textarea
                  placeholder={t('finance.credits.reasonPlaceholder')}
                  value={newCredit.reason}
                  onChange={(e) => setNewCredit({ ...newCredit, reason: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('finance.credits.expiryDate')} ({t('common:optional')})</Label>
                <Input
                  type="date"
                  value={newCredit.expiresAt}
                  onChange={(e) => setNewCredit({ ...newCredit, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIssueCreditOpen(false)}>
                {t('common:buttons.cancel')}
              </Button>
              <Button onClick={handleIssueCredit}>
                {t('finance.credits.issue')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}

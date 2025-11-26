import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, TrendingUp, Package, Star, Eye, EyeOff } from "lucide-react";
import { useAllPricingPlans } from "@/hooks/usePricingPlans";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

export default function PricingPlans() {
  const { t } = useTranslation('dashboard-admin');
  const { data: plans, isLoading, refetch } = useAllPricingPlans();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [popularFilter, setPopularFilter] = useState<"all" | "popular" | "standard">("all");

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("pricing_plans").delete().eq("id", deleteId);

    if (error) {
      toast.error(t('toast.error.deleteFailed', { error: error.message }));
      console.error(error);
    } else {
      toast.success(t('toast.success.planDeleted'));
      refetch();
    }
    setDeleteId(null);
  };

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("pricing_plans")
      .update({ is_active: !currentStatus })
      .eq("id", planId);

    if (error) {
      toast.error(t('toast.error.updateFailed', { error: error.message }));
    } else {
      toast.success(t(!currentStatus ? 'toast.success.planActivated' : 'toast.success.planDeactivated', { defaultValue: `Plan ${!currentStatus ? "activated" : "deactivated"}` }));
      refetch();
    }
  };

  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    
    return plans.filter((plan) => {
      const enTranslation = plan.plan_translations?.find((t: any) => t.language === "en");
      const name = enTranslation?.name || plan.slug;
      const description = enTranslation?.description || "";
      
      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && plan.is_active) ||
        (statusFilter === "inactive" && !plan.is_active);
      
      const matchesPopular = 
        popularFilter === "all" ||
        (popularFilter === "popular" && plan.is_popular) ||
        (popularFilter === "standard" && !plan.is_popular);
      
      return matchesSearch && matchesStatus && matchesPopular;
    });
  }, [plans, searchQuery, statusFilter, popularFilter]);

  const stats = useMemo(() => {
    if (!plans) return { total: 0, active: 0, popular: 0, avgPrice: 0 };
    
    return {
      total: plans.length,
      active: plans.filter((p) => p.is_active).length,
      popular: plans.filter((p) => p.is_popular).length,
      avgPrice: plans.reduce((sum, p) => sum + Number(p.monthly_price), 0) / plans.length,
    };
  }, [plans]);

  return (
    <AdminDashboardLayout title="Pricing Plans">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('pricingPlans.title')}</h2>
            <p className="text-muted-foreground">
              {t('pricingPlans.subtitle')}
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/admin/pricing-plans/new")} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            {t('pricingPlans.addPlan')}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common:totalPlans', { defaultValue: 'Total Plans' })}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{t('common:allPricingTiers', { defaultValue: 'All pricing tiers' })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pricingPlans.active')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">{t('common:currentlyAvailable', { defaultValue: 'Currently available' })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pricingPlans.popular')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.popular}</div>
              <p className="text-xs text-muted-foreground">{t('common:featuredOfferings', { defaultValue: 'Featured offerings' })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common:avgPrice', { defaultValue: 'Avg. Price' })}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.avgPrice.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">{t('pricingPlans.perMonth')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('pricingPlans.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('common:status', { defaultValue: 'Status' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('pricingPlans.allPlans')}</SelectItem>
                    <SelectItem value="active">{t('pricingPlans.active')}</SelectItem>
                    <SelectItem value="inactive">{t('pricingPlans.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={popularFilter} onValueChange={(v: any) => setPopularFilter(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t('common:type', { defaultValue: 'Type' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common:allTypes', { defaultValue: 'All Types' })}</SelectItem>
                    <SelectItem value="popular">{t('pricingPlans.popular')}</SelectItem>
                    <SelectItem value="standard">{t('common:standard', { defaultValue: 'Standard' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
                <p className="text-muted-foreground">{t('common:loading', { defaultValue: 'Loading...' })}</p>
              </div>
            ) : filteredPlans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common:planDetails', { defaultValue: 'Plan Details' })}</TableHead>
                    <TableHead>{t('common:price', { defaultValue: 'Price' })}</TableHead>
                    <TableHead>{t('common:inclusions', { defaultValue: 'Inclusions' })}</TableHead>
                    <TableHead>{t('common:languages', { defaultValue: 'Languages' })}</TableHead>
                    <TableHead>{t('common:status', { defaultValue: 'Status' })}</TableHead>
                    <TableHead className="text-right">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => {
                    const enTranslation = plan.plan_translations?.find((t: any) => t.language === "en");
                    const translations = plan.plan_translations || [];
                    const hasEN = translations.some((t: any) => t.language === "en");
                    const hasES = translations.some((t: any) => t.language === "es");
                    const hasNL = translations.some((t: any) => t.language === "nl");
                    
                    return (
                      <TableRow key={plan.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{enTranslation?.name || plan.slug}</span>
                                {plan.is_popular && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Star className="h-3 w-3" />
                                    {t('pricingPlans.popular')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {enTranslation?.description || t('common:noDescription', { defaultValue: 'No description' })}
                              </p>
                              <code className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded w-fit">
                                {plan.slug}
                              </code>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-lg">€{plan.monthly_price}</div>
                          <div className="text-xs text-muted-foreground">{t('pricingPlans.perMonth')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span>{t('pricingPlans.devices', { count: plan.devices_included })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {plan.family_dashboards === -1
                                  ? t('common:unlimitedDashboards', { defaultValue: 'Unlimited dashboards' })
                                  : t('pricingPlans.dashboards', { count: plan.family_dashboards })}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant={hasEN ? "default" : "outline"} className="text-xs">EN</Badge>
                            <Badge variant={hasES ? "default" : "outline"} className="text-xs">ES</Badge>
                            <Badge variant={hasNL ? "default" : "outline"} className="text-xs">NL</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={plan.is_active}
                              onCheckedChange={() => handleToggleActive(plan.id, plan.is_active)}
                            />
                            <span className="text-sm">
                              {plan.is_active ? (
                                <Badge variant="default" className="gap-1">
                                  <Eye className="h-3 w-3" />
                                  {t('pricingPlans.active')}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <EyeOff className="h-3 w-3" />
                                  {t('pricingPlans.inactive')}
                                </Badge>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/dashboard/admin/pricing-plans/${plan.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(plan.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">{t('pricingPlans.noPlans')}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all" || popularFilter !== "all"
                    ? t('common:tryAdjustingFilters', { defaultValue: 'Try adjusting your filters' })
                    : t('common:getStartedCreatingPlan', { defaultValue: 'Get started by creating your first pricing plan' })}
                </p>
                {(!searchQuery && statusFilter === "all" && popularFilter === "all") && (
                  <Button onClick={() => navigate("/dashboard/admin/pricing-plans/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('pricingPlans.addPlan')}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pricingPlans.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common:deleteConfirm', { defaultValue: 'Are you sure you want to delete this? This action cannot be undone.' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel', { defaultValue: 'Cancel' })}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common:delete', { defaultValue: 'Delete' })}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

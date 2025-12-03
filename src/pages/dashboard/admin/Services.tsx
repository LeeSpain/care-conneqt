import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAllProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function Services() {
  const { t } = useTranslation('dashboard-admin');
  const { data: products, isLoading, refetch } = useAllProducts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("products").delete().eq("id", deleteId);

    if (error) {
      toast.error(t('toast.error.deleteFailed', { error: error.message }));
      console.error(error);
    } else {
      toast.success(t('services.deleted'));
      refetch();
    }
    setDeleteId(null);
  };

  // Filter to only show services (product_type = 'service')
  const filteredProducts = products?.filter((product) => {
    const enTranslation = product.product_translations?.find((tr: any) => tr.language === "en");
    const name = enTranslation?.name || "";
    
    const isService = product.product_type === 'service';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    return isService && matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminDashboardLayout title={t('services.title')}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('services.title')}</h2>
            <p className="text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/admin/services/new")}>
            <Plus className="h-4 w-4 mr-2" />
            {t('services.addService')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('common:filters', { defaultValue: 'Filters' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder={t('services.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('services.filterByCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('services.allCategories')}</SelectItem>
                  <SelectItem value="service">{t('services.generalService')}</SelectItem>
                  <SelectItem value="support">{t('services.support')}</SelectItem>
                  <SelectItem value="monitoring">{t('services.monitoring')}</SelectItem>
                  <SelectItem value="care">{t('services.care')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('services.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('services.active')}</SelectItem>
                  <SelectItem value="inactive">{t('services.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">{t('common:loading.services', { defaultValue: 'Loading services...' })}</div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common:service', { defaultValue: 'Service' })}</TableHead>
                    <TableHead>{t('common:category', { defaultValue: 'Category' })}</TableHead>
                    <TableHead>{t('common:price', { defaultValue: 'Price' })}</TableHead>
                    <TableHead>{t('common:status', { defaultValue: 'Status' })}</TableHead>
                    <TableHead>{t('common:sortOrder', { defaultValue: 'Sort Order' })}</TableHead>
                    <TableHead className="text-right">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const enTranslation = product.product_translations?.find((tr: any) => tr.language === "en");
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt=""
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{enTranslation?.name || product.slug}</div>
                              <div className="text-sm text-muted-foreground">{product.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {product.monthly_price ? `€${product.monthly_price}${t('services.perMonth')}` : t('common:included', { defaultValue: 'Included' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.is_active && <Badge variant="default">{t('services.active')}</Badge>}
                            {!product.is_active && <Badge variant="secondary">{t('services.inactive')}</Badge>}
                            {product.is_popular && <Badge>{t('services.popular')}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{product.sort_order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/dashboard/admin/services/${product.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(product.id)}
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
              <div className="p-8 text-center text-muted-foreground">
                {t('services.noServices')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('services.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common:deleteConfirm', { defaultValue: 'Are you sure you want to delete this service? This action cannot be undone.' })}
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

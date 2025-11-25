import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAllPricingPlans } from "@/hooks/usePricingPlans";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

export default function PricingPlans() {
  const { data: plans, isLoading, refetch } = useAllPricingPlans();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("pricing_plans").delete().eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete pricing plan");
      console.error(error);
    } else {
      toast.success("Pricing plan deleted successfully");
      refetch();
    }
    setDeleteId(null);
  };

  return (
    <AdminDashboardLayout title="Pricing Plans">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pricing Plans</h2>
            <p className="text-muted-foreground">
              Manage membership tiers and subscription packages
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/admin/pricing-plans/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading plans...</div>
            ) : plans && plans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Family Dashboards</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => {
                    const enTranslation = plan.plan_translations?.find((t: any) => t.language === "en");
                    return (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{enTranslation?.name || plan.slug}</div>
                            <div className="text-sm text-muted-foreground">
                              {enTranslation?.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">€{plan.monthly_price}/mo</TableCell>
                        <TableCell>{plan.devices_included} devices</TableCell>
                        <TableCell>
                          {plan.family_dashboards === -1
                            ? "Unlimited"
                            : `${plan.family_dashboards} users`}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {plan.is_active && <Badge variant="default">Active</Badge>}
                            {!plan.is_active && <Badge variant="secondary">Inactive</Badge>}
                            {plan.is_popular && <Badge>Popular</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{plan.sort_order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
              <div className="p-8 text-center text-muted-foreground">No pricing plans found</div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pricing Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pricing plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

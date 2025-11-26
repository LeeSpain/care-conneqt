import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Plus, Search, MoreVertical, Edit, Trash2, Shield, MapPin, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AddInsuranceCompanyDialog } from "@/components/admin/AddInsuranceCompanyDialog";
import { useNavigate } from "react-router-dom";

export default function InsuranceCompanies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["insurance-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_companies")
        .select("*, insurance_staff(count), covered_members(count)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredCompanies = companies?.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = insuranceTypeFilter === "all" || company.insurance_type === insuranceTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (companyId: string) => {
    setDeletingCompanyId(companyId);
  };

  const confirmDelete = async () => {
    if (!deletingCompanyId) return;

    const { error } = await supabase
      .from("insurance_companies")
      .delete()
      .eq("id", deletingCompanyId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete insurance company",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Insurance company deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["insurance-companies"] });
    }
    setDeletingCompanyId(null);
  };

  const getSubscriptionBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      trial: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.expired}>
        {status}
      </Badge>
    );
  };

  const getInsuranceTypeLabel = (type: string) => {
    const labels = {
      health: "Health",
      care: "Care",
      life: "Life",
      other: "Other",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <AdminDashboardLayout title="Insurance Companies">
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search insurance companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={insuranceTypeFilter} onValueChange={setInsuranceTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="care">Care</SelectItem>
              <SelectItem value="life">Life</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => {
            setEditingCompany(null);
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance Company
          </Button>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCompanies && filteredCompanies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company: any) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{getInsuranceTypeLabel(company.insurance_type)}</Badge>
                        {getSubscriptionBadge(company.subscription_status)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/commercial/insurance/${company.id}`)}>
                          <Shield className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(company)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Company
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(company.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {company.city && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {company.city}, {company.country}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">Policies</div>
                        <div className="text-2xl font-bold">{company.total_policies || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Covered</div>
                        <div className="text-2xl font-bold">
                          {company.covered_members?.[0]?.count || 0}
                        </div>
                      </div>
                    </div>

                    {company.email && (
                      <div className="text-xs text-muted-foreground pt-2">
                        {company.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No insurance companies found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || insuranceTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first insurance company"}
              </p>
              {!searchQuery && insuranceTypeFilter === "all" && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Insurance Company
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <AddInsuranceCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingCompany(null);
        }}
        company={editingCompany}
      />

      <AlertDialog open={!!deletingCompanyId} onOpenChange={() => setDeletingCompanyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Insurance Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this insurance company? This action cannot be undone.
              All associated policies and covered members will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Building2, Users, Bed, Plus, MoreVertical, Pencil, UserPlus, CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddFacilityDialog } from "@/components/admin/AddFacilityDialog";
import { AddFacilityStaffDialog } from "@/components/admin/AddFacilityStaffDialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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

export default function Facilities() {
  const { t } = useTranslation('dashboard-admin');
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<any>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: facilities, isLoading } = useQuery({
    queryKey: ["admin-facilities"],
    queryFn: async () => {
      const { data: facilitiesData, error } = await supabase
        .from("facilities")
        .select("*");

      if (error) throw error;

      // Get resident counts
      const { data: residents } = await supabase
        .from("facility_residents")
        .select("facility_id, id")
        .is("discharge_date", null);

      // Get staff counts
      const { data: staff } = await supabase
        .from("facility_staff")
        .select("facility_id, id");

      const facilitiesWithStats = facilitiesData.map(facility => {
        const residentCount = residents?.filter(r => r.facility_id === facility.id).length || 0;
        const staffCount = staff?.filter(s => s.facility_id === facility.id).length || 0;
        const occupancyRate = facility.bed_capacity 
          ? Math.round((residentCount / facility.bed_capacity) * 100)
          : 0;

        return {
          ...facility,
          residentCount,
          staffCount,
          occupancyRate
        };
      });

      return facilitiesWithStats;
    }
  });

  const filteredFacilities = facilities?.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (facility: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFacility(facility);
    setAddDialogOpen(true);
  };

  const handleAddStaff = (facilityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFacilityId(facilityId);
    setAddStaffDialogOpen(true);
  };

  const handleDelete = (facility: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setFacilityToDelete(facility);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!facilityToDelete) return;
    
    try {
      const { error } = await supabase
        .from("facilities")
        .delete()
        .eq("id", facilityToDelete.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      toast.success(t('toast.success.facilityDeleted'));
      setDeleteDialogOpen(false);
      setFacilityToDelete(null);
    } catch (error: any) {
      toast.error(t('toast.error.deleteFailed', { error: error.message }));
    }
  };

  return (
    <AdminDashboardLayout title={t('facilities.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('facilities.title')}</h2>
            <p className="text-muted-foreground">
              {t('facilities.subtitle')}
            </p>
          </div>
          <Button onClick={() => {
            setEditingFacility(null);
            setAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            {t('facilities.addFacility')}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('facilities.searchPlaceholder')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredFacilities?.map((facility) => (
              <Card 
                key={facility.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/admin/commercial/facilities/${facility.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <CardDescription>
                          {facility.city}, {facility.country}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        facility.subscription_status === "active" ? "default" :
                        facility.subscription_status === "trial" ? "secondary" : "outline"
                      }>
                        {facility.subscription_status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEdit(facility, e)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {t('facilities.actions.editFacility')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleAddStaff(facility.id, e)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t('facilities.actions.manageStaff')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            {t('common:manageSubscription', { defaultValue: 'Manage Subscription' })}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => handleDelete(facility, e)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('common:delete', { defaultValue: 'Delete' })}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t('common:residents', { defaultValue: 'Residents' })}:
                      </span>
                      <span className="font-medium">
                        {facility.residentCount} / {facility.bed_capacity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {t('common:occupancy', { defaultValue: 'Occupancy' })}:
                      </span>
                      <span className="font-medium">{facility.occupancyRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('common:staff', { defaultValue: 'Staff' })}:</span>
                      <span className="font-medium">{facility.staffCount}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(facility.occupancyRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!isLoading && filteredFacilities?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('facilities.noFacilities')}</p>
              <Button className="mt-4" onClick={() => {
                setEditingFacility(null);
                setAddDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {t('facilities.addFacility')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AddFacilityDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingFacility(null);
        }}
        facility={editingFacility}
      />

      <AddFacilityStaffDialog
        open={addStaffDialogOpen}
        onOpenChange={setAddStaffDialogOpen}
        facilityId={selectedFacilityId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common:delete', { defaultValue: 'Delete' })} {t('common:facility', { defaultValue: 'Facility' })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common:deleteConfirm', { defaultValue: 'Are you sure you want to delete {{name}}? This action cannot be undone.' }).replace('{{name}}', facilityToDelete?.name || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common:cancel', { defaultValue: 'Cancel' })}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t('common:delete', { defaultValue: 'Delete' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

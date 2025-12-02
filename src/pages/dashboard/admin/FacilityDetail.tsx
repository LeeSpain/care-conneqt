import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, Bed, Settings, AlertCircle, MoreVertical, Eye, DoorOpen, Trash2, UserCog } from "lucide-react";
import { useState } from "react";
import { AdmitResidentDialog } from "@/components/admin/AdmitResidentDialog";
import { AddFacilityStaffDialog } from "@/components/admin/AddFacilityStaffDialog";
import { AddFacilityDialog } from "@/components/admin/AddFacilityDialog";
import { DischargeResidentDialog } from "@/components/admin/DischargeResidentDialog";
import { ChangeRoomDialog } from "@/components/admin/ChangeRoomDialog";
import { EditStaffRoleDialog } from "@/components/admin/EditStaffRoleDialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function FacilityDetail() {
  const { t } = useTranslation('dashboard-admin');
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [admitResidentOpen, setAdmitResidentOpen] = useState(false);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [editFacilityOpen, setEditFacilityOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [changeRoomDialogOpen, setChangeRoomDialogOpen] = useState(false);
  const [editStaffRoleDialogOpen, setEditStaffRoleDialogOpen] = useState(false);
  const [removeStaffDialogOpen, setRemoveStaffDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: residents } = useQuery({
    queryKey: ["facility-residents", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_residents")
        .select(`
          *,
          member:members (
            *,
            profile:profiles (*)
          )
        `)
        .eq("facility_id", id)
        .is("discharge_date", null);

      if (error) throw error;
      return data;
    }
  });

  const { data: staff } = useQuery({
    queryKey: ["facility-staff", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_staff")
        .select(`
          *,
          profile:profiles (*)
        `)
        .eq("facility_id", id);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <AdminDashboardLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const occupancyRate = facility?.bed_capacity 
    ? Math.round(((residents?.length || 0) / facility.bed_capacity) * 100)
    : 0;

  const handleRemoveStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      const { error } = await supabase
        .from("facility_staff")
        .delete()
        .eq("id", selectedStaff.id);

      if (error) throw error;
      
      toast.success("Staff member removed from facility");
      queryClient.invalidateQueries({ queryKey: ["facility-staff", id] });
      setRemoveStaffDialogOpen(false);
      setSelectedStaff(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove staff member");
    }
  };

  return (
    <AdminDashboardLayout title={facility?.name || "Facility Details"}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/commercial/facilities")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{facility?.name}</h2>
            <p className="text-muted-foreground">
              {facility?.address_line1}, {facility?.city}, {facility?.postal_code}
            </p>
          </div>
          <Button variant="outline" onClick={() => setEditFacilityOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Facility
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{residents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                of {facility?.bed_capacity} beds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={
                facility?.subscription_status === "active" ? "default" : "secondary"
              }>
                {facility?.subscription_status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {facility?.facility_type}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="residents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="residents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Residents</h3>
              <Button onClick={() => setAdmitResidentOpen(true)}>Add Resident</Button>
            </div>
            {residents && residents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {residents.map((resident: any) => (
                  <Card key={resident.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {resident.member?.profile?.first_name} {resident.member?.profile?.last_name}
                          </CardTitle>
                          <CardDescription>
                            Room {resident.room_number} • Admitted {new Date(resident.admission_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/members`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedResident(resident);
                              setChangeRoomDialogOpen(true);
                            }}>
                              <Bed className="h-4 w-4 mr-2" />
                              Change Room
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedResident(resident);
                                setDischargeDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <DoorOpen className="h-4 w-4 mr-2" />
                              Discharge Resident
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No residents currently in this facility</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Facility Staff</h3>
              <Button onClick={() => setAddStaffOpen(true)}>Add Staff Member</Button>
            </div>
            {staff && staff.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {staff.map((member: any) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {member.profile?.first_name} {member.profile?.last_name}
                          </CardTitle>
                          <CardDescription>
                            {member.staff_role}
                            {member.is_facility_admin && " • Administrator"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/staff`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedStaff(member);
                              setEditStaffRoleDialogOpen(true);
                            }}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedStaff(member);
                                setRemoveStaffDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove from Facility
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {member.profile?.email}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No staff members assigned</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Number</p>
                    <p className="text-sm">{facility?.license_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Facility Type</p>
                    <p className="text-sm">{facility?.facility_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bed Capacity</p>
                    <p className="text-sm">{facility?.bed_capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-sm">{facility?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{facility?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {facility?.created_at ? new Date(facility.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AdmitResidentDialog
        open={admitResidentOpen}
        onOpenChange={setAdmitResidentOpen}
        facilityId={id!}
      />

      <AddFacilityStaffDialog
        open={addStaffOpen}
        onOpenChange={setAddStaffOpen}
        facilityId={id!}
      />

      <AddFacilityDialog
        open={editFacilityOpen}
        onOpenChange={setEditFacilityOpen}
        facility={facility}
      />

      <DischargeResidentDialog
        open={dischargeDialogOpen}
        onOpenChange={setDischargeDialogOpen}
        resident={selectedResident}
        facilityId={id!}
      />

      <ChangeRoomDialog
        open={changeRoomDialogOpen}
        onOpenChange={setChangeRoomDialogOpen}
        resident={selectedResident}
        facilityId={id!}
      />

      <EditStaffRoleDialog
        open={editStaffRoleDialogOpen}
        onOpenChange={setEditStaffRoleDialogOpen}
        staffMember={selectedStaff}
        facilityId={id!}
      />

      <AlertDialog open={removeStaffDialogOpen} onOpenChange={setRemoveStaffDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedStaff?.profile?.first_name} {selectedStaff?.profile?.last_name} from this facility?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveStaff} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

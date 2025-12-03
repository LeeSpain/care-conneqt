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
import { ArrowLeft, Building2, Users, Bed, Settings, AlertCircle, MoreVertical, Eye, DoorOpen, Trash2, UserCog, Pencil } from "lucide-react";
import { useState } from "react";
import { AdmitResidentDialog } from "@/components/admin/AdmitResidentDialog";
import { AddFacilityStaffDialog } from "@/components/admin/AddFacilityStaffDialog";
import { AddFacilityDialog } from "@/components/admin/AddFacilityDialog";
import { DischargeResidentDialog } from "@/components/admin/DischargeResidentDialog";
import { ChangeRoomDialog } from "@/components/admin/ChangeRoomDialog";
import { EditStaffRoleDialog } from "@/components/admin/EditStaffRoleDialog";
import { ResidentDetailDialog } from "@/components/admin/ResidentDetailDialog";
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
  const [residentDetailOpen, setResidentDetailOpen] = useState(false);
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
      // First get facility residents
      const { data: residentsData, error: residentsError } = await supabase
        .from("facility_residents")
        .select("*")
        .eq("facility_id", id)
        .is("discharge_date", null);

      if (residentsError) throw residentsError;
      if (!residentsData?.length) return [];

      // Get member IDs
      const memberIds = residentsData.map(r => r.member_id);
      
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*")
        .in("id", memberIds);

      if (membersError) throw membersError;

      // Get user IDs from members
      const userIds = membersData?.map(m => m.user_id).filter(Boolean) || [];
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      return residentsData.map(resident => {
        const member = membersData?.find(m => m.id === resident.member_id);
        const profile = member ? profilesData?.find(p => p.id === member.user_id) : null;
        return {
          ...resident,
          member: member ? { ...member, profile } : null
        };
      });
    }
  });

  const { data: staff } = useQuery({
    queryKey: ["facility-staff", id],
    queryFn: async () => {
      // First get facility staff
      const { data: staffData, error: staffError } = await supabase
        .from("facility_staff")
        .select("*")
        .eq("facility_id", id);

      if (staffError) throw staffError;
      if (!staffData?.length) return [];

      // Get user IDs
      const userIds = staffData.map(s => s.user_id).filter(Boolean);
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      return staffData.map(staffMember => ({
        ...staffMember,
        profile: profilesData?.find(p => p.id === staffMember.user_id) || null
      }));
    }
  });

  if (isLoading) {
    return (
      <AdminDashboardLayout title={t('facilityDetail.loading')}>
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
      
      toast.success(t('facilityDetail.staffRemoved'));
      queryClient.invalidateQueries({ queryKey: ["facility-staff", id] });
      setRemoveStaffDialogOpen(false);
      setSelectedStaff(null);
    } catch (error: any) {
      toast.error(error.message || t('facilityDetail.removeStaffFailed'));
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
            {t('facilityDetail.editFacility')}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('facilityDetail.residents')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{residents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {t('facilityDetail.ofBeds', { count: facility?.bed_capacity })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('facilityDetail.occupancy')}</CardTitle>
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
              <CardTitle className="text-sm font-medium">{t('facilityDetail.staff')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {t('facilityDetail.teamMembers')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('facilityDetail.status')}</CardTitle>
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
            <TabsTrigger value="residents">{t('facilityDetail.tabs.residents')}</TabsTrigger>
            <TabsTrigger value="staff">{t('facilityDetail.tabs.staff')}</TabsTrigger>
            <TabsTrigger value="details">{t('facilityDetail.tabs.details')}</TabsTrigger>
          </TabsList>

          <TabsContent value="residents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('facilityDetail.currentResidents')}</h3>
              <Button onClick={() => setAdmitResidentOpen(true)}>{t('facilityDetail.addResident')}</Button>
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
                            {t('facilityDetail.room')} {resident.room_number} • {t('facilityDetail.admitted')} {new Date(resident.admission_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedResident(resident);
                              setResidentDetailOpen(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('facilityDetail.viewProfile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/members/${resident.member?.id}`)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              {t('facilityDetail.editProfile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedResident(resident);
                              setChangeRoomDialogOpen(true);
                            }}>
                              <Bed className="h-4 w-4 mr-2" />
                              {t('facilityDetail.changeRoom')}
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
                              {t('facilityDetail.dischargeResident')}
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
                  <p className="text-muted-foreground">{t('facilityDetail.noResidents')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('facilityDetail.facilityStaff')}</h3>
              <Button onClick={() => setAddStaffOpen(true)}>{t('facilityDetail.addStaffMember')}</Button>
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
                            {member.is_facility_admin && ` • ${t('facilityDetail.administrator')}`}
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
                              {t('facilityDetail.viewProfile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedStaff(member);
                              setEditStaffRoleDialogOpen(true);
                            }}>
                              <UserCog className="h-4 w-4 mr-2" />
                              {t('facilityDetail.editRole')}
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
                              {t('facilityDetail.removeFromFacility')}
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
                  <p className="text-muted-foreground">{t('facilityDetail.noStaff')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('facilityDetail.facilityInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.licenseNumber')}</p>
                    <p className="text-sm">{facility?.license_number || t('facilityDetail.na')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.facilityType')}</p>
                    <p className="text-sm">{facility?.facility_type || t('facilityDetail.na')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.bedCapacity')}</p>
                    <p className="text-sm">{facility?.bed_capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.contactEmail')}</p>
                    <p className="text-sm">{facility?.email || t('facilityDetail.na')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.phone')}</p>
                    <p className="text-sm">{facility?.phone || t('facilityDetail.na')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('facilityDetail.created')}</p>
                    <p className="text-sm">
                      {facility?.created_at ? new Date(facility.created_at).toLocaleDateString() : t('facilityDetail.na')}
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
            <AlertDialogTitle>{t('facilityDetail.removeStaffTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('facilityDetail.removeStaffDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('facilityDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveStaff} className="bg-destructive text-destructive-foreground">
              {t('facilityDetail.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ResidentDetailDialog
        open={residentDetailOpen}
        onOpenChange={setResidentDetailOpen}
        resident={selectedResident}
      />
    </AdminDashboardLayout>
  );
}

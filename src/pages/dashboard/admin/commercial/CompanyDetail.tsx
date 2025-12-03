import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2, Users, UserPlus, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { AddCompanyStaffDialog } from "@/components/admin/AddCompanyStaffDialog";
import { AddCompanyClientDialog } from "@/components/admin/AddCompanyClientDialog";
import { AddCareCompanyDialog } from "@/components/admin/AddCareCompanyDialog";
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

export default function CompanyDetail() {
  const { t } = useTranslation('dashboard-admin');
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [removingStaffId, setRemovingStaffId] = useState<string | null>(null);
  const [removingClientId, setRemovingClientId] = useState<string | null>(null);

  const { data: company, isLoading } = useQuery({
    queryKey: ["care-company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("care_companies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["company-staff", id],
    queryFn: async () => {
      const { data: staffData, error } = await supabase
        .from("company_staff")
        .select("*")
        .eq("company_id", id);

      if (error) throw error;
      if (!staffData?.length) return [];

      // Get user IDs
      const userIds = staffData.map(s => s.user_id).filter(Boolean);
      
      // Fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      // Combine data
      return staffData.map(member => ({
        ...member,
        profiles: profilesData?.find(p => p.id === member.user_id) || null
      }));
    },
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["company-clients", id],
    queryFn: async () => {
      const { data: clientsData, error } = await supabase
        .from("company_clients")
        .select("*, members(*)")
        .eq("company_id", id);

      if (error) throw error;

      // Get profiles for the members
      const memberUserIds = clientsData?.map(c => c.members?.user_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", memberUserIds);

      // Attach profiles to members
      return clientsData?.map(client => ({
        ...client,
        members: {
          ...client.members,
          profile: profilesData?.find(p => p.id === client.members?.user_id)
        }
      }));
    },
  });

  const confirmRemoveStaff = async () => {
    if (!removingStaffId) return;

    const { error } = await supabase
      .from("company_staff")
      .delete()
      .eq("id", removingStaffId);

    if (error) {
      toast.error(t('companyDetail.removeStaffFailed'));
    } else {
      toast.success(t('companyDetail.staffRemoved'));
      queryClient.invalidateQueries({ queryKey: ["company-staff", id] });
      queryClient.invalidateQueries({ queryKey: ["care-company", id] });
    }
    setRemovingStaffId(null);
  };

  const confirmRemoveClient = async () => {
    if (!removingClientId) return;

    const { error } = await supabase
      .from("company_clients")
      .delete()
      .eq("id", removingClientId);

    if (error) {
      toast.error(t('companyDetail.removeClientFailed'));
    } else {
      toast.success(t('companyDetail.clientRemoved'));
      queryClient.invalidateQueries({ queryKey: ["company-clients", id] });
      queryClient.invalidateQueries({ queryKey: ["care-company", id] });
    }
    setRemovingClientId(null);
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout title={t('companyDetail.loading')}>
        <Skeleton className="h-64 w-full" />
      </AdminDashboardLayout>
    );
  }

  if (!company) {
    return (
      <AdminDashboardLayout title={t('companyDetail.notFound')}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('companyDetail.notFound')}</h2>
          <Button onClick={() => navigate("/dashboard/admin/commercial/companies")} className="mt-4">
            {t('companyDetail.backToCompanies')}
          </Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={company.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/commercial/companies")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{company.name}</h2>
            <p className="text-muted-foreground">
              {company.address_line1}, {company.city}, {company.postal_code}
            </p>
          </div>
          <Button variant="outline" onClick={() => setEditCompanyOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            {t('companyDetail.editCompany')}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('companyDetail.totalClients')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.total_clients || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('companyDetail.totalStaff')}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.total_staff || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('companyDetail.companyType')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold capitalize">{company.company_type?.replace('_', ' ')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('companyDetail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={company.subscription_status === "active" ? "default" : "secondary"}>
                {company.subscription_status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" className="w-full">
          <TabsList>
            <TabsTrigger value="clients">{t('companyDetail.tabs.clients')}</TabsTrigger>
            <TabsTrigger value="staff">{t('companyDetail.tabs.staff')}</TabsTrigger>
            <TabsTrigger value="services">{t('companyDetail.tabs.services')}</TabsTrigger>
            <TabsTrigger value="settings">{t('companyDetail.tabs.settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('companyDetail.clients')}</h3>
              <Button onClick={() => setAddClientOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('companyDetail.addClient')}
              </Button>
            </div>
            {clientsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : clients && clients.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {clients.map((client: any) => (
                  <Card key={client.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {client.members?.profile?.first_name} {client.members?.profile?.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{client.service_type}</p>
                          {client.start_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t('companyDetail.started')}: {new Date(client.start_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRemovingClientId(client.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('companyDetail.removeClient')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('companyDetail.noClients')}</p>
                  <Button onClick={() => setAddClientOpen(true)} className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('companyDetail.addFirstClient')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('companyDetail.staffMembers')}</h3>
              <Button onClick={() => setAddStaffOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('companyDetail.addStaff')}
              </Button>
            </div>
            {staffLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : staff && staff.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {staff.map((member: any) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {member.profiles?.first_name} {member.profiles?.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{member.staff_role}</p>
                          {member.is_company_admin && (
                            <Badge variant="secondary" className="mt-1">{t('companyDetail.admin')}</Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRemovingStaffId(member.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('companyDetail.removeStaff')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('companyDetail.noStaff')}</p>
                  <Button onClick={() => setAddStaffOpen(true)} className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('companyDetail.addFirstStaff')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>{t('companyDetail.serviceAreas')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('companyDetail.serviceAreaConfig')}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('companyDetail.companySettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('companyDetail.contactInfo')}</h4>
                  <p className="text-sm">{t('companyDetail.email')}: {company.email || t('companyDetail.notProvided')}</p>
                  <p className="text-sm">{t('companyDetail.phone')}: {company.phone || t('companyDetail.notProvided')}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('companyDetail.registration')}</h4>
                  <p className="text-sm">{t('companyDetail.registrationNumber')}: {company.registration_number || t('companyDetail.notProvided')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddCompanyStaffDialog
        open={addStaffOpen}
        onOpenChange={setAddStaffOpen}
        companyId={id!}
      />
      <AddCompanyClientDialog
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        companyId={id!}
      />
      <AddCareCompanyDialog
        open={editCompanyOpen}
        onOpenChange={setEditCompanyOpen}
        company={company}
      />

      <AlertDialog open={!!removingStaffId} onOpenChange={() => setRemovingStaffId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('companyDetail.removeStaffTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('companyDetail.removeStaffDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('companyDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveStaff} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('companyDetail.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!removingClientId} onOpenChange={() => setRemovingClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('companyDetail.removeClientTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('companyDetail.removeClientDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('companyDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('companyDetail.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

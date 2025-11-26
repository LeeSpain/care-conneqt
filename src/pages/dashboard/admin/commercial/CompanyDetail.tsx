import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
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
      const { data, error } = await supabase
        .from("company_staff")
        .select("*, profiles(*)")
        .eq("company_id", id);

      if (error) throw error;
      return data;
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
      toast.error("Failed to remove staff member");
    } else {
      toast.success("Staff member removed successfully");
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
      toast.error("Failed to remove client");
    } else {
      toast.success("Client removed successfully");
      queryClient.invalidateQueries({ queryKey: ["company-clients", id] });
      queryClient.invalidateQueries({ queryKey: ["care-company", id] });
    }
    setRemovingClientId(null);
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout title="Loading...">
        <Skeleton className="h-64 w-full" />
      </AdminDashboardLayout>
    );
  }

  if (!company) {
    return (
      <AdminDashboardLayout title="Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Company not found</h2>
          <Button onClick={() => navigate("/dashboard/admin/commercial/companies")} className="mt-4">
            Back to Companies
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
            Edit Company
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.total_clients || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{company.total_staff || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Company Type</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold capitalize">{company.company_type?.replace('_', ' ')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={company.subscription_status === "active" ? "default" : "secondary"}>
                {company.subscription_status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Clients</h3>
              <Button onClick={() => setAddClientOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
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
                              Started: {new Date(client.start_date).toLocaleDateString()}
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
                              Remove Client
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
                  <p className="text-muted-foreground">No clients assigned yet</p>
                  <Button onClick={() => setAddClientOpen(true)} className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Client
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Staff Members</h3>
              <Button onClick={() => setAddStaffOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
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
                            <Badge variant="secondary" className="mt-1">Admin</Badge>
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
                              Remove Staff
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
                  <p className="text-muted-foreground">No staff members yet</p>
                  <Button onClick={() => setAddStaffOpen(true)} className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Staff Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Service area configuration coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <p className="text-sm">Email: {company.email || "Not provided"}</p>
                  <p className="text-sm">Phone: {company.phone || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Registration</h4>
                  <p className="text-sm">Number: {company.registration_number || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
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

      {/* Remove Staff Dialog */}
      <AlertDialog open={!!removingStaffId} onOpenChange={() => setRemovingStaffId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this staff member from the company?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveStaff} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Client Dialog */}
      <AlertDialog open={!!removingClientId} onOpenChange={() => setRemovingClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this client from the company? This will not delete the member, only the relationship.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

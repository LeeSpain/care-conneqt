import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Shield,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Users,
  FileText,
  UserPlus,
  FilePlus,
  UserCheck,
  Edit,
} from "lucide-react";
import { AddInsuranceStaffDialog } from "@/components/admin/AddInsuranceStaffDialog";
import { AddInsurancePolicyDialog } from "@/components/admin/AddInsurancePolicyDialog";
import { AddCoveredMemberDialog } from "@/components/admin/AddCoveredMemberDialog";

export default function InsuranceDetail() {
  const { t } = useTranslation(['dashboard-admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isCoveredMemberDialogOpen, setIsCoveredMemberDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["insurance-company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_companies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["insurance-staff", id],
    queryFn: async () => {
      const { data: staffData, error } = await supabase
        .from("insurance_staff")
        .select("*")
        .eq("insurance_company_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!staffData?.length) return [];

      // Get user IDs
      const userIds = staffData.map(s => s.user_id).filter(Boolean);
      
      // Fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      // Combine data
      return staffData.map(member => ({
        ...member,
        profiles: profilesData?.find(p => p.id === member.user_id) || null
      }));
    },
  });

  const { data: policies, isLoading: policiesLoading } = useQuery({
    queryKey: ["insurance-policies", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_policies")
        .select("*, covered_members(count)")
        .eq("insurance_company_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: coveredMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["covered-members", id],
    queryFn: async () => {
      const { data: coverageData, error: coverageError } = await supabase
        .from("covered_members")
        .select("*, members(id, user_id)")
        .eq("insurance_company_id", id)
        .order("created_at", { ascending: false });

      if (coverageError) throw coverageError;

      const userIds = coverageData?.map(c => c.members?.user_id).filter(Boolean) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      return coverageData?.map(coverage => ({
        ...coverage,
        profile: profilesData?.find(p => p.id === coverage.members?.user_id)
      }));
    },
  });

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

  if (companyLoading) {
    return (
      <AdminDashboardLayout title="Loading...">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!company) {
    return (
      <AdminDashboardLayout title="Insurance Company Not Found">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Insurance Company Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The insurance company you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/dashboard/admin/commercial/insurance")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Insurance Companies
            </Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={company.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/admin/commercial/insurance")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">{company.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{getInsuranceTypeLabel(company.insurance_type)}</Badge>
                  {getSubscriptionBadge(company.subscription_status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {company.registration_number && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Registration Number</div>
                    <div className="text-sm text-muted-foreground">{company.registration_number}</div>
                  </div>
                </div>
              )}
              {company.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{company.email}</div>
                  </div>
                </div>
              )}
              {company.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{company.phone}</div>
                  </div>
                </div>
              )}
              {company.city && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {company.city}, {company.country}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="policies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="policies">
              <FileText className="h-4 w-4 mr-2" />
              Policies ({policies?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="covered">
              <UserCheck className="h-4 w-4 mr-2" />
              Covered Members ({coveredMembers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="h-4 w-4 mr-2" />
              Staff ({staff?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => {
                setEditingPolicy(null);
                setIsPolicyDialogOpen(true);
              }}>
                <FilePlus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </div>

            {policiesLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
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
            ) : policies && policies.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {policies.map((policy: any) => (
                  <Card key={policy.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={policy.is_active ? "default" : "secondary"}>
                              {policy.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                            </Badge>
                            {policy.coverage_type && (
                              <Badge variant="outline">{policy.coverage_type}</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingPolicy(policy);
                            setIsPolicyDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {policy.premium_range && (
                          <div className="text-sm">
                            <span className="font-medium">Premium Range:</span>{" "}
                            <span className="text-muted-foreground">{policy.premium_range}</span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Covered Members:</span>{" "}
                          <span className="text-muted-foreground">
                            {policy.covered_members?.[0]?.count || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No policies yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first insurance policy to get started
                  </p>
                  <Button onClick={() => setIsPolicyDialogOpen(true)}>
                    <FilePlus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Covered Members Tab */}
          <TabsContent value="covered" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsCoveredMemberDialogOpen(true)}>
                <UserCheck className="h-4 w-4 mr-2" />
                Add Covered Member
              </Button>
            </div>

            {membersLoading ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : coveredMembers && coveredMembers.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {coveredMembers.map((coverage: any) => (
                      <div key={coverage.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {coverage.profile?.first_name} {coverage.profile?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {coverage.profile?.email}
                            </div>
                            {coverage.policy_number && (
                              <div className="text-sm text-muted-foreground mt-1">
                                Policy #: {coverage.policy_number}
                              </div>
                            )}
                            {coverage.coverage_start && (
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span>Start: {new Date(coverage.coverage_start).toLocaleDateString()}</span>
                                {coverage.coverage_end && (
                                  <span>End: {new Date(coverage.coverage_end).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No covered members yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add members covered by insurance policies
                  </p>
                  <Button onClick={() => setIsCoveredMemberDialogOpen(true)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Add Covered Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsStaffDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </div>

            {staffLoading ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : staff && staff.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {staff.map((member: any) => (
                      <div key={member.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">
                              {member.profiles?.first_name} {member.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {member.profiles?.email}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{member.staff_role}</Badge>
                              {member.is_admin && (
                                <Badge variant="secondary">Admin</Badge>
                              )}
                            </div>
                            {member.hired_at && (
                              <div className="text-xs text-muted-foreground mt-2">
                                Hired: {new Date(member.hired_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No staff members yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add staff members to manage this insurance company
                  </p>
                  <Button onClick={() => setIsStaffDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddInsuranceStaffDialog
        open={isStaffDialogOpen}
        onOpenChange={setIsStaffDialogOpen}
        companyId={id!}
      />
      <AddInsurancePolicyDialog
        open={isPolicyDialogOpen}
        onOpenChange={(open) => {
          setIsPolicyDialogOpen(open);
          if (!open) setEditingPolicy(null);
        }}
        companyId={id!}
        policy={editingPolicy}
      />
      <AddCoveredMemberDialog
        open={isCoveredMemberDialogOpen}
        onOpenChange={setIsCoveredMemberDialogOpen}
        companyId={id!}
      />
    </AdminDashboardLayout>
  );
}

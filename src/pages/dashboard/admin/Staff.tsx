import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, UserPlus, MoreVertical, Stethoscope, Building2, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("dashboard-admin");

  const { data: nurses, isLoading: nursesLoading } = useQuery({
    queryKey: ["staff-nurses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq("role", "nurse");

      if (error) throw error;

      // Get assignment counts
      const nursesWithStats = await Promise.all(
        data.map(async (nurse) => {
          const { count: assignmentCount } = await supabase
            .from("nurse_assignments")
            .select("*", { count: "exact", head: true })
            .eq("nurse_id", nurse.user_id);

          const { count: taskCount } = await supabase
            .from("nurse_tasks")
            .select("*", { count: "exact", head: true })
            .eq("nurse_id", nurse.user_id)
            .eq("status", "pending");

          const profile = nurse.profiles || {};
          return {
            ...profile,
            assignmentCount: assignmentCount || 0,
            pendingTasks: taskCount || 0,
          };
        })
      );

      return nursesWithStats;
    },
  });

  const { data: facilityStaff, isLoading: facilityLoading } = useQuery({
    queryKey: ["staff-facility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_staff")
        .select(`
          id,
          staff_role,
          is_facility_admin,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          ),
          facilities (
            id,
            name
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const allStaff: any[] = [
    ...(nurses || []).map((n: any) => ({ ...n, type: "nurse" })),
    ...(facilityStaff || []).map((s: any) => {
      const profile = s.profiles || {};
      return {
        id: profile.id || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || null,
        avatar_url: profile.avatar_url || null,
        type: "facility", 
        facility: s.facilities?.name, 
        role: s.staff_role,
      };
    }),
  ];

  const filteredNurses = nurses?.filter((nurse: any) =>
    `${nurse.first_name} ${nurse.last_name} ${nurse.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacilityStaff = facilityStaff?.filter((staff: any) =>
    `${staff.profiles?.first_name} ${staff.profiles?.last_name} ${staff.profiles?.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllStaff = allStaff.filter((staff: any) =>
    `${staff.first_name} ${staff.last_name} ${staff.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStaff = allStaff.length;
  const totalNurses = nurses?.length || 0;
  const totalFacilityStaff = facilityStaff?.length || 0;
  const avgWorkload = nurses && nurses.length > 0
    ? Math.round(nurses.reduce((sum: number, n: any) => sum + n.assignmentCount, 0) / nurses.length)
    : 0;

  return (
    <AdminDashboardLayout title={t("staff.title")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("staff.title")}</h2>
            <p className="text-muted-foreground">{t("staff.subtitle")}</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            {t("staff.addStaff")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("staff.totalStaff")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{totalStaff}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("staff.nurses")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{totalNurses}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("staff.facilityStaff")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{totalFacilityStaff}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("staff.avgWorkload")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{avgWorkload}</span>
                <span className="text-sm text-muted-foreground">{t("staff.members")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("staff.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">{t("staff.allStaff")} ({totalStaff})</TabsTrigger>
            <TabsTrigger value="nurses">{t("staff.nurses")} ({totalNurses})</TabsTrigger>
            <TabsTrigger value="facility">{t("staff.facilityStaff")} ({totalFacilityStaff})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredAllStaff.map((staff: any) => (
                <Card key={staff.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={staff.avatar_url} />
                        <AvatarFallback>
                          {staff.first_name?.[0]}{staff.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.first_name} {staff.last_name}</p>
                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={staff.type === "nurse" ? "default" : "secondary"}>
                            {staff.type === "nurse" ? t("staff.nurse") : staff.role}
                          </Badge>
                          {staff.facility && (
                            <span className="text-xs text-muted-foreground">{staff.facility}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {staff.type === "nurse" && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{t("staff.assignedMembers", { count: staff.assignmentCount })}</p>
                          <p className="text-xs text-muted-foreground">{t("staff.pendingTasks", { count: staff.pendingTasks })}</p>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>{t("staff.actions.viewProfile")}</DropdownMenuItem>
                          {staff.type === "nurse" && (
                            <>
                              <DropdownMenuItem>{t("staff.actions.viewAssignments")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("staff.actions.assignMember")}</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>{t("staff.actions.editDetails")}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nurses" className="space-y-4">
            <div className="grid gap-4">
              {filteredNurses?.map((nurse: any) => (
                <Card key={nurse.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={nurse.avatar_url} />
                        <AvatarFallback>
                          {nurse.first_name?.[0]}{nurse.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{nurse.first_name} {nurse.last_name}</p>
                        <p className="text-sm text-muted-foreground">{nurse.email}</p>
                        <Badge className="mt-1">{t("staff.nurse")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{t("staff.assignedMembers", { count: nurse.assignmentCount })}</p>
                        <p className="text-xs text-muted-foreground">{t("staff.pendingTasks", { count: nurse.pendingTasks })}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>{t("staff.actions.viewProfile")}</DropdownMenuItem>
                          <DropdownMenuItem>{t("staff.actions.viewAssignments")}</DropdownMenuItem>
                          <DropdownMenuItem>{t("staff.actions.assignMember")}</DropdownMenuItem>
                          <DropdownMenuItem>{t("staff.actions.viewSchedule")}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facility" className="space-y-4">
            <div className="grid gap-4">
              {filteredFacilityStaff?.map((staff: any) => (
                <Card key={staff.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={staff.profiles?.avatar_url} />
                        <AvatarFallback>
                          {staff.profiles?.first_name?.[0]}{staff.profiles?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {staff.profiles?.first_name} {staff.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{staff.profiles?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{staff.staff_role}</Badge>
                          {staff.is_facility_admin && (
                            <Badge variant="outline">{t("staff.admin")}</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{staff.facilities?.name}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("staff.actions.viewProfile")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("staff.actions.changeFacility")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("staff.actions.editRole")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

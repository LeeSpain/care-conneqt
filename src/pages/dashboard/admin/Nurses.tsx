import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Phone,
  Users,
  ClipboardList,
  Download,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Nurses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workloadFilter, setWorkloadFilter] = useState<string>("all");
  const { t } = useTranslation("dashboard-admin");

  const { data: nurses, isLoading } = useQuery({
    queryKey: ["admin-nurses"],
    queryFn: async () => {
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "nurse");

      if (rolesError) throw rolesError;

      const nurseIds = userRoles.map((r) => r.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", nurseIds);

      if (profilesError) throw profilesError;

      // Get assignment counts for each nurse
      const { data: assignments } = await supabase
        .from("nurse_assignments")
        .select("nurse_id, member_id");

      // Get task counts
      const { data: tasks } = await supabase
        .from("nurse_tasks")
        .select("nurse_id, status");

      const nursesWithStats = profiles.map((profile) => {
        const nurseAssignments = assignments?.filter((a) => a.nurse_id === profile.id) || [];
        const nurseTasks = tasks?.filter((t) => t.nurse_id === profile.id) || [];
        const completedTasks = nurseTasks.filter((t) => t.status === "completed").length;
        const pendingTasks = nurseTasks.filter((t) => t.status === "pending").length;

        return {
          ...profile,
          assignedMembers: nurseAssignments.length,
          completedTasks,
          pendingTasks,
          workload:
            nurseAssignments.length < 5
              ? "low"
              : nurseAssignments.length < 10
              ? "medium"
              : "high",
        };
      });

      return nursesWithStats;
    },
  });

  const filteredNurses = nurses?.filter((nurse) => {
    const matchesSearch =
      nurse.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkload = workloadFilter === "all" || nurse.workload === workloadFilter;
    return matchesSearch && matchesWorkload;
  });

  const stats = {
    total: nurses?.length || 0,
    lowWorkload: nurses?.filter((n) => n.workload === "low").length || 0,
    mediumWorkload: nurses?.filter((n) => n.workload === "medium").length || 0,
    highWorkload: nurses?.filter((n) => n.workload === "high").length || 0,
  };

  return (
    <AdminDashboardLayout title={t("nurses.title")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("nurses.title")}</h2>
            <p className="text-muted-foreground">
              {t("nurses.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("nurses.export")}
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t("nurses.addNurse")}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("nurses.totalNurses")}</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("nurses.lowWorkload")}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowWorkload}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("nurses.mediumWorkload")}</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediumWorkload}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("nurses.highWorkload")}</CardTitle>
              <Users className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highWorkload}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("nurses.searchPlaceholder")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={workloadFilter} onValueChange={setWorkloadFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("nurses.workload")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("nurses.allWorkloads")}</SelectItem>
              <SelectItem value="low">{t("nurses.low")}</SelectItem>
              <SelectItem value="medium">{t("nurses.medium")}</SelectItem>
              <SelectItem value="high">{t("nurses.high")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nurses Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredNurses?.map((nurse) => (
              <Card key={nurse.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={nurse.avatar_url || ""} />
                        <AvatarFallback>
                          {nurse.first_name?.[0]}
                          {nurse.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {nurse.first_name} {nurse.last_name}
                        </CardTitle>
                        <CardDescription className="truncate">{nurse.email}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("nurses.actions.viewProfile").split(" ")[0]}</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("nurses.actions.viewProfile")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          {t("nurses.actions.editDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          {t("nurses.actions.sendMessage")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          {t("nurses.actions.manageAssignments")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardList className="h-4 w-4 mr-2" />
                          {t("nurses.actions.viewTasks")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge
                      variant={
                        nurse.workload === "low"
                          ? "default"
                          : nurse.workload === "medium"
                          ? "secondary"
                          : "destructive"
                      }
                      className="w-full justify-center"
                    >
                      {t("nurses.workloadBadge", { level: nurse.workload.toUpperCase() })}
                    </Badge>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {t("nurses.assignedMembers")}:
                        </span>
                        <span className="font-medium">{nurse.assignedMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <ClipboardList className="h-3 w-3" />
                          {t("nurses.pendingTasks")}:
                        </span>
                        <span className="font-medium">{nurse.pendingTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t("nurses.completed")}:
                        </span>
                        <span className="font-medium">{nurse.completedTasks}</span>
                      </div>
                      {nurse.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {t("nurses.phone")}:
                          </span>
                          <span className="font-medium text-xs">{nurse.phone}</span>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" className="w-full mt-2">
                      <Eye className="h-4 w-4 mr-2" />
                      {t("nurses.viewDetails")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!isLoading && filteredNurses?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("nurses.noNurses")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users, TrendingUp, Activity, AlertCircle, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ConnectionsPanel } from "@/components/admin/ConnectionsPanel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Mail, Phone, MapPin, Download, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [careLevelFilter, setCareLevelFilter] = useState<string>("all");
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const { t } = useTranslation("dashboard-admin");

  const { data: members, isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data: membersData, error } = await supabase
        .from("members")
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            phone
          )
        `);

      if (error) throw error;

      // Get device counts
      const { data: devices } = await supabase
        .from("member_devices")
        .select("member_id, id");

      // Get alert counts
      const { data: alerts } = await supabase
        .from("alerts")
        .select("member_id, id, priority")
        .eq("status", "new");

      const membersWithStats = membersData.map((member) => ({
        ...member,
        deviceCount: devices?.filter((d) => d.member_id === member.id).length || 0,
        activeAlerts: alerts?.filter((a) => a.member_id === member.id).length || 0,
        criticalAlerts: alerts?.filter((a) => a.member_id === member.id && a.priority === "critical").length || 0,
      }));

      return membersWithStats;
    },
  });

  const filteredMembers = members?.filter((member) => {
    const profile = member.profiles as any;
    const matchesSearch =
      profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile?.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscription =
      subscriptionFilter === "all" || member.subscription_status === subscriptionFilter;
    const matchesCareLevel =
      careLevelFilter === "all" || member.care_level === careLevelFilter;
    return matchesSearch && matchesSubscription && matchesCareLevel;
  });

  const stats = {
    total: members?.length || 0,
    active: members?.filter((m) => m.subscription_status === "active").length || 0,
    trial: members?.filter((m) => m.subscription_status === "trial").length || 0,
    withAlerts: members?.filter((m) => m.activeAlerts > 0).length || 0,
  };

  return (
    <AdminDashboardLayout title={t("members.title")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("members.title")}</h2>
            <p className="text-muted-foreground">
              {t("members.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("members.export")}
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t("members.addMember")}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("members.totalMembers")}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("members.active")}</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("members.trial")}</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trial}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("members.withAlerts")}</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withAlerts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("members.searchPlaceholder")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("members.subscription")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("members.allSubscriptions")}</SelectItem>
              <SelectItem value="trial">{t("members.trial")}</SelectItem>
              <SelectItem value="active">{t("members.active")}</SelectItem>
              <SelectItem value="cancelled">{t("members.cancelled")}</SelectItem>
              <SelectItem value="past_due">{t("members.pastDue")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={careLevelFilter} onValueChange={setCareLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("members.careLevel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("members.allCareLevels")}</SelectItem>
              <SelectItem value="low">{t("members.low")}</SelectItem>
              <SelectItem value="medium">{t("members.medium")}</SelectItem>
              <SelectItem value="high">{t("members.high")}</SelectItem>
              <SelectItem value="critical">{t("members.critical")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Members Grid */}
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
            filteredMembers?.map((member) => {
              const profile = member.profiles as any;
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback>
                            {profile?.first_name?.[0]}
                            {profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {profile?.first_name} {profile?.last_name}
                          </CardTitle>
                          <CardDescription className="truncate">{profile?.email}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("members.actions.viewProfile").split(" ")[0]}</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {t("members.actions.viewProfile")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            {t("members.actions.editDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            {t("members.actions.sendMessage")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            {t("members.actions.viewDevices")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            member.subscription_status === "active"
                              ? "default"
                              : member.subscription_status === "trial"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {member.subscription_status}
                        </Badge>
                        {member.care_level && (
                          <Badge variant="outline">{member.care_level} care</Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Devices:
                          </span>
                          <span className="font-medium">{member.deviceCount}</span>
                        </div>
                        {profile?.phone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              Phone:
                            </span>
                            <span className="font-medium text-xs">{profile.phone}</span>
                          </div>
                        )}
                        {member.city && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Location:
                            </span>
                            <span className="font-medium text-xs">{member.city}</span>
                          </div>
                        )}
                      </div>

                      {member.activeAlerts > 0 && (
                        <Badge
                          variant={member.criticalAlerts > 0 ? "destructive" : "default"}
                          className="w-full justify-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {member.activeAlerts} Active Alert{member.activeAlerts > 1 ? "s" : ""}
                          {member.criticalAlerts > 0 && ` (${member.criticalAlerts} Critical)`}
                        </Badge>
                      )}

                      <Button variant="outline" className="w-full mt-2">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>

                      <Collapsible
                        open={expandedMembers.has(member.id)}
                        onOpenChange={(open) => {
                          const newExpanded = new Set(expandedMembers);
                          if (open) {
                            newExpanded.add(member.id);
                          } else {
                            newExpanded.delete(member.id);
                          }
                          setExpandedMembers(newExpanded);
                        }}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="mt-2 w-full">
                            {expandedMembers.has(member.id) ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Hide Connections
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Show Connections
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <ConnectionsPanel memberId={member.id} />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {!isLoading && filteredMembers?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("members.noMembers")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

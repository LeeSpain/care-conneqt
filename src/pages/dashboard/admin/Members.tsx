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
  Heart,
  Activity,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Download,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [careLevelFilter, setCareLevelFilter] = useState<string>("all");
  const { t } = useTranslation("dashboard");

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
    <AdminDashboardLayout title={t("admin.members.title")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Care Members</h2>
            <p className="text-muted-foreground">
              Manage care recipients and monitor their health status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trial</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trial}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Alerts</CardTitle>
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
              placeholder="Search members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
            </SelectContent>
          </Select>
          <Select value={careLevelFilter} onValueChange={setCareLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Care Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Care Levels</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Activity className="h-4 w-4 mr-2" />
                            View Devices
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
              <p className="text-muted-foreground">No members found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  Shield,
  Bell,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  UserPlus,
  Download,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FamilyCarers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("dashboard-admin");

  const { data: carers, isLoading } = useQuery({
    queryKey: ["admin-family-carers"],
    queryFn: async () => {
      const { data: carersData, error } = await supabase
        .from("family_carers")
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

      // Get member connections
      const { data: connections } = await supabase
        .from("member_carers")
        .select("carer_id, member_id");

      const carersWithConnections = carersData.map((carer) => ({
        ...carer,
        connectedMembers: connections?.filter((c) => c.carer_id === carer.id).length || 0,
      }));

      return carersWithConnections;
    },
  });

  const filteredCarers = carers?.filter((carer) => {
    const profile = carer.profiles as any;
    return (
      profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const stats = {
    total: carers?.length || 0,
    primary: carers?.filter((c) => c.is_primary_contact).length || 0,
    withMedical: carers?.filter((c) => c.can_view_medical).length || 0,
    withAlerts: carers?.filter((c) => c.can_receive_alerts).length || 0,
  };

  return (
    <AdminDashboardLayout title={t("familyCarers.title")}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("familyCarers.title")}</h2>
            <p className="text-muted-foreground">
              {t("familyCarers.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t("familyCarers.export")}
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t("familyCarers.inviteCarer")}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("familyCarers.totalCarers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("familyCarers.primaryContacts")}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.primary}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("familyCarers.medicalAccess")}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withMedical}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("familyCarers.alertEnabled")}</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withAlerts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("familyCarers.searchPlaceholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Carers Grid */}
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
            filteredCarers?.map((carer) => {
              const profile = carer.profiles as any;
              return (
                <Card key={carer.id} className="hover:shadow-lg transition-shadow">
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
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg truncate">
                              {profile?.first_name} {profile?.last_name}
                            </CardTitle>
                            {carer.is_primary_contact && (
                              <Badge variant="default" className="text-xs">
                                {t("familyCarers.primary")}
                              </Badge>
                            )}
                          </div>
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
                          <DropdownMenuLabel>{t("familyCarers.actions.viewProfile").split(" ")[0]}</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {t("familyCarers.actions.viewProfile")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            {t("familyCarers.actions.editPermissions")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            {t("familyCarers.actions.sendMessage")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            {t("familyCarers.actions.viewMembers")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {t("familyCarers.relationship")}:
                        </span>
                        <span className="font-medium capitalize">
                          {carer.relationship_to_member?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("familyCarers.connectedMembers")}:</span>
                        <span className="font-medium">{carer.connectedMembers}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {carer.can_view_medical && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            {t("familyCarers.medicalAccessBadge")}
                          </Badge>
                        )}
                        {carer.can_receive_alerts && (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            {t("familyCarers.alerts")}
                          </Badge>
                        )}
                      </div>

                      <Button variant="outline" className="w-full mt-2">
                        <Shield className="h-4 w-4 mr-2" />
                        {t("familyCarers.managePermissions")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {!isLoading && filteredCarers?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("familyCarers.noCarers")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

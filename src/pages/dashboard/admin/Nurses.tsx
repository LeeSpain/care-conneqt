import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

export default function Nurses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workloadFilter, setWorkloadFilter] = useState<string>("all");
  const { t } = useTranslation('dashboard');

  const { data: nurses, isLoading } = useQuery({
    queryKey: ["admin-nurses"],
    queryFn: async () => {
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "nurse");

      if (rolesError) throw rolesError;

      const nurseIds = userRoles.map(r => r.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", nurseIds);

      if (profilesError) throw profilesError;

      // Get assignment counts for each nurse
      const { data: assignments } = await supabase
        .from("nurse_assignments")
        .select("nurse_id, member_id");

      const nursesWithStats = profiles.map(profile => {
        const nurseAssignments = assignments?.filter(a => a.nurse_id === profile.id) || [];
        return {
          ...profile,
          assignedMembers: nurseAssignments.length,
          workload: nurseAssignments.length < 5 ? "low" : nurseAssignments.length < 10 ? "medium" : "high"
        };
      });

      return nursesWithStats;
    }
  });

  const filteredNurses = nurses?.filter(nurse => {
    const matchesSearch = nurse.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nurse.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nurse.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkload = workloadFilter === "all" || nurse.workload === workloadFilter;
    return matchesSearch && matchesWorkload;
  });

  return (
    <AdminDashboardLayout title={t('admin.nurses.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('admin.nurses.pageTitle')}</h2>
            <p className="text-muted-foreground">
              {t('admin.nurses.description')}
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            {t('admin.nurses.addNurse')}
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.nurses.searchPlaceholder')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={workloadFilter} onValueChange={setWorkloadFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('admin.nurses.workload')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.nurses.allWorkloads')}</SelectItem>
              <SelectItem value="low">{t('admin.nurses.low')}</SelectItem>
              <SelectItem value="medium">{t('admin.nurses.medium')}</SelectItem>
              <SelectItem value="high">{t('admin.nurses.high')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredNurses?.map((nurse) => (
              <Card key={nurse.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={nurse.avatar_url || ""} />
                        <AvatarFallback>
                          {nurse.first_name?.[0]}{nurse.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {nurse.first_name} {nurse.last_name}
                        </CardTitle>
                        <CardDescription>{nurse.email}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      nurse.workload === "low" ? "default" :
                      nurse.workload === "medium" ? "secondary" : "destructive"
                    }>
                      {nurse.workload}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('admin.nurses.assignedMembers')}</span>
                      <span className="font-medium">{nurse.assignedMembers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('admin.nurses.phone')}</span>
                      <span className="font-medium">{nurse.phone || "N/A"}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      {t('admin.nurses.viewDetails')}
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
              <p className="text-muted-foreground">{t('admin.nurses.noNurses')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

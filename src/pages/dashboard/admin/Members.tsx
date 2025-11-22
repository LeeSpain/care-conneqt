import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Heart, Activity } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const { t } = useTranslation('dashboard');

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
            avatar_url
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
        .select("member_id, id")
        .eq("status", "new");

      const membersWithStats = membersData.map(member => ({
        ...member,
        deviceCount: devices?.filter(d => d.member_id === member.id).length || 0,
        activeAlerts: alerts?.filter(a => a.member_id === member.id).length || 0
      }));

      return membersWithStats;
    }
  });

  const filteredMembers = members?.filter(member => {
    const profile = member.profiles as any;
    const matchesSearch = profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile?.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscription = subscriptionFilter === "all" || member.subscription_status === subscriptionFilter;
    return matchesSearch && matchesSubscription;
  });

  return (
    <AdminDashboardLayout title={t('admin.members.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('admin.members.pageTitle')}</h2>
            <p className="text-muted-foreground">
              {t('admin.members.description')}
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            {t('admin.members.addMember')}
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
            filteredMembers?.map((member) => {
              const profile = member.profiles as any;
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback>
                            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {profile?.first_name} {profile?.last_name}
                          </CardTitle>
                          <CardDescription>{profile?.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={
                        member.subscription_status === "active" ? "default" :
                        member.subscription_status === "trial" ? "secondary" : "outline"
                      }>
                        {member.subscription_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Devices:
                        </span>
                        <span className="font-medium">{member.deviceCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          Care Level:
                        </span>
                        <span className="font-medium">{member.care_level || "Standard"}</span>
                      </div>
                      {member.activeAlerts > 0 && (
                        <Badge variant="destructive" className="w-full justify-center">
                          {member.activeAlerts} Active Alerts
                        </Badge>
                      )}
                      <Button variant="outline" className="w-full mt-4">
                        View Profile
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
              <p className="text-muted-foreground">No members found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

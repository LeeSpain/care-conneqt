import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users, Shield, Bell } from "lucide-react";
import { useState } from "react";

export default function FamilyCarers() {
  const [searchQuery, setSearchQuery] = useState("");

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
            avatar_url
          )
        `);

      if (error) throw error;

      // Get member connections
      const { data: connections } = await supabase
        .from("member_carers")
        .select("carer_id, member_id");

      const carersWithConnections = carersData.map(carer => ({
        ...carer,
        connectedMembers: connections?.filter(c => c.carer_id === carer.id).length || 0
      }));

      return carersWithConnections;
    }
  });

  const filteredCarers = carers?.filter(carer => {
    const profile = carer.profiles as any;
    return profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           profile?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <AdminDashboardLayout title="Family Carer Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Family Carers</h2>
            <p className="text-muted-foreground">
              Manage family members and their access permissions
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search family carers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            filteredCarers?.map((carer) => {
              const profile = carer.profiles as any;
              return (
                <Card key={carer.id} className="hover:shadow-lg transition-shadow">
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
                      {carer.is_primary_contact && (
                        <Badge>Primary</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Relationship:
                        </span>
                        <span className="font-medium">{carer.relationship_to_member}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Connected Members:</span>
                        <span className="font-medium">{carer.connectedMembers}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {carer.can_view_medical && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Medical
                          </Badge>
                        )}
                        {carer.can_receive_alerts && (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Alerts
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Manage Permissions
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
              <p className="text-muted-foreground">No family carers found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

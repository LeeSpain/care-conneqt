import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Stethoscope, Building2 } from "lucide-react";

interface ConnectionsPanelProps {
  memberId: string;
}

export const ConnectionsPanel = ({ memberId }: ConnectionsPanelProps) => {
  const { data: nurses } = useQuery({
    queryKey: ["member-nurses", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nurse_assignments")
        .select(`
          id,
          is_primary,
          profiles:nurse_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("member_id", memberId);

      if (error) throw error;
      return data;
    },
  });

  const { data: carers } = useQuery({
    queryKey: ["member-carers", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_carers")
        .select(`
          id,
          family_carers (
            id,
            relationship_to_member,
            profiles:user_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq("member_id", memberId);

      if (error) throw error;
      return data;
    },
  });

  const { data: facility } = useQuery({
    queryKey: ["member-facility", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_residents")
        .select(`
          id,
          room_number,
          facilities (
            id,
            name,
            facility_type
          )
        `)
        .eq("member_id", memberId)
        .is("discharge_date", null)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-secondary" />
            <CardTitle className="text-sm">Assigned Nurses</CardTitle>
          </div>
          <CardDescription>Care team members</CardDescription>
        </CardHeader>
        <CardContent>
          {nurses && nurses.length > 0 ? (
            <div className="space-y-3">
              {nurses.map((assignment: any) => (
                <div key={assignment.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={assignment.profiles?.avatar_url} />
                    <AvatarFallback>
                      {assignment.profiles?.first_name?.[0]}
                      {assignment.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {assignment.profiles?.first_name} {assignment.profiles?.last_name}
                    </p>
                    {assignment.is_primary && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No nurses assigned</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            <CardTitle className="text-sm">Family Carers</CardTitle>
          </div>
          <CardDescription>Connected family members</CardDescription>
        </CardHeader>
        <CardContent>
          {carers && carers.length > 0 ? (
            <div className="space-y-3">
              {carers.map((connection: any) => (
                <div key={connection.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={connection.family_carers?.profiles?.avatar_url} />
                    <AvatarFallback>
                      {connection.family_carers?.profiles?.first_name?.[0]}
                      {connection.family_carers?.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {connection.family_carers?.profiles?.first_name}{" "}
                      {connection.family_carers?.profiles?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {connection.family_carers?.relationship_to_member}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No carers connected</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-secondary" />
            <CardTitle className="text-sm">Facility</CardTitle>
          </div>
          <CardDescription>Residential placement</CardDescription>
        </CardHeader>
        <CardContent>
          {facility ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">{facility.facilities?.name}</p>
              <p className="text-xs text-muted-foreground">
                {facility.facilities?.facility_type}
              </p>
              {facility.room_number && (
                <Badge variant="outline">Room {facility.room_number}</Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Community based</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

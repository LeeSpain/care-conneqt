import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Building2, Link2 } from "lucide-react";

export default function AssignmentsHub() {
  const { data: nurseAssignments } = useQuery({
    queryKey: ["nurse-assignments-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nurse_assignments")
        .select(`
          id,
          is_primary,
          nurse:nurse_id (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          member:member_id (
            id,
            user:user_id (
              id,
              first_name,
              last_name,
              avatar_url
            ),
            care_level
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: carerConnections } = useQuery({
    queryKey: ["carer-connections-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_carers")
        .select(`
          id,
          member:member_id (
            id,
            user:user_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          ),
          carer:carer_id (
            id,
            relationship_to_member,
            user:user_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: facilityPlacements } = useQuery({
    queryKey: ["facility-placements-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_residents")
        .select(`
          id,
          room_number,
          admission_date,
          member:member_id (
            id,
            user:user_id (
              id,
              first_name,
              last_name,
              avatar_url
            )
          ),
          facility:facility_id (
            id,
            name,
            facility_type
          )
        `)
        .is("discharge_date", null);

      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminDashboardLayout title="Assignments Hub">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Assignments Hub</h2>
            <p className="text-muted-foreground">Central management for all relationships and connections</p>
          </div>
          <Button>
            <Link2 className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nurse Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{nurseAssignments?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Family Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{carerConnections?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Facility Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{facilityPlacements?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="nurses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nurses">Nurse Assignments</TabsTrigger>
            <TabsTrigger value="carers">Family Connections</TabsTrigger>
            <TabsTrigger value="facilities">Facility Placements</TabsTrigger>
          </TabsList>

          <TabsContent value="nurses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nurse-Member Assignments</CardTitle>
                <CardDescription>Overview of all nurse assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nurseAssignments?.map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={assignment.nurse?.avatar_url} />
                          <AvatarFallback>
                            {assignment.nurse?.first_name?.[0]}
                            {assignment.nurse?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {assignment.nurse?.first_name} {assignment.nurse?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">Nurse</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">→</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={assignment.member?.user?.avatar_url} />
                          <AvatarFallback>
                            {assignment.member?.user?.first_name?.[0]}
                            {assignment.member?.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {assignment.member?.user?.first_name} {assignment.member?.user?.last_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Member</p>
                            {assignment.is_primary && (
                              <Badge variant="secondary" className="text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">Reassign</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Family Carer Connections</CardTitle>
                <CardDescription>Overview of family member relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carerConnections?.map((connection: any) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={connection.carer?.user?.avatar_url} />
                          <AvatarFallback>
                            {connection.carer?.user?.first_name?.[0]}
                            {connection.carer?.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {connection.carer?.user?.first_name} {connection.carer?.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {connection.carer?.relationship_to_member}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">→</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={connection.member?.user?.avatar_url} />
                          <AvatarFallback>
                            {connection.member?.user?.first_name?.[0]}
                            {connection.member?.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {connection.member?.user?.first_name} {connection.member?.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">Care Member</p>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facility Resident Placements</CardTitle>
                <CardDescription>Overview of residential care placements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilityPlacements?.map((placement: any) => (
                    <div key={placement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={placement.member?.user?.avatar_url} />
                          <AvatarFallback>
                            {placement.member?.user?.first_name?.[0]}
                            {placement.member?.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {placement.member?.user?.first_name} {placement.member?.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">Resident</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">→</span>
                      </div>

                      <div className="flex-1 mx-4">
                        <p className="font-medium">{placement.facility?.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{placement.facility?.facility_type}</p>
                          {placement.room_number && (
                            <Badge variant="outline" className="text-xs">Room {placement.room_number}</Badge>
                          )}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">Transfer</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

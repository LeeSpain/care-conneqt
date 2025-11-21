import { useEffect, useState } from "react";
import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Search, Plus, Bed, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function FacilityResidents() {
  const { user } = useAuth();
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchResidents();
    }
  }, [user]);

  const fetchResidents = async () => {
    try {
      // Get facility ID from staff record
      const { data: staffData } = await supabase
        .from("facility_staff")
        .select("facility_id")
        .eq("user_id", user?.id)
        .single();

      if (staffData) {
        // Get residents for this facility
        const { data } = await supabase
          .from("facility_residents")
          .select(`
            id,
            room_number,
            admission_date,
            discharge_date,
            members (
              id,
              care_level,
              mobility_level,
              profiles (
                first_name,
                last_name,
                avatar_url,
                phone
              )
            )
          `)
          .eq("facility_id", staffData.facility_id)
          .is("discharge_date", null)
          .order("admission_date", { ascending: false });

        setResidents(data || []);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter((resident) => {
    const profile = resident.members?.profiles;
    const fullName = `${profile?.first_name} ${profile?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           resident.room_number?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <FacilityDashboardLayout title="Residents">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Facility Residents</h2>
            <p className="text-muted-foreground">
              Manage and monitor all residents in your facility
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Residents</CardTitle>
                <CardDescription>
                  {filteredResidents.length} active residents
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search residents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Residents Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No residents match your search" : "Start by adding your first resident"}
                </p>
                {!searchTerm && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Resident
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Care Level</TableHead>
                    <TableHead>Mobility</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => {
                    const member = resident.members;
                    const profile = member?.profiles;
                    
                    return (
                      <TableRow key={resident.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={profile?.avatar_url || ""} />
                              <AvatarFallback>
                                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {profile?.first_name} {profile?.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {profile?.phone || "No phone"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            {resident.room_number || "Not assigned"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {member?.care_level || "Standard"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member?.mobility_level || "Not set"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {resident.admission_date 
                              ? format(new Date(resident.admission_date), "MMM dd, yyyy")
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </FacilityDashboardLayout>
  );
}

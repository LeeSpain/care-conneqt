import { useEffect, useState } from "react";
import { FacilityDashboardLayout } from "@/components/FacilityDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserCheck, Search, Plus, Mail, Phone, Shield } from "lucide-react";
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

export default function FacilityStaff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      // Get facility ID from staff record
      const { data: staffData } = await supabase
        .from("facility_staff")
        .select("facility_id")
        .eq("user_id", user?.id)
        .single();

      if (staffData) {
        // Get all staff for this facility
        const { data } = await supabase
          .from("facility_staff")
          .select(`
            id,
            staff_role,
            is_facility_admin,
            hired_at,
            profiles (
              id,
              first_name,
              last_name,
              email,
              phone,
              avatar_url
            )
          `)
          .eq("facility_id", staffData.facility_id)
          .order("hired_at", { ascending: false });

        setStaff(data || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const profile = member.profiles;
    const fullName = `${profile?.first_name} ${profile?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member.staff_role?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <FacilityDashboardLayout title="Staff">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Facility Staff</h2>
            <p className="text-muted-foreground">
              Manage and monitor all staff members in your facility
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">Active staff members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staff.filter(s => s.is_facility_admin).length}
              </div>
              <p className="text-xs text-muted-foreground">With admin access</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Care Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staff.filter(s => !s.is_facility_admin).length}
              </div>
              <p className="text-xs text-muted-foreground">Care professionals</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  {filteredStaff.length} staff members
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
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
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Staff Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No staff match your search" : "Start by adding your first staff member"}
                </p>
                {!searchTerm && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Staff Member
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hired Date</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => {
                    const profile = member.profiles;
                    
                    return (
                      <TableRow key={member.id}>
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
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {profile?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {member.staff_role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {profile?.phone || "No phone"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.hired_at 
                            ? format(new Date(member.hired_at), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {member.is_facility_admin ? (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline">Staff</Badge>
                          )}
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

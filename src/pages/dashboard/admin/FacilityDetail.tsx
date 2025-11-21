import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, Bed, Settings, AlertCircle } from "lucide-react";

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: facility, isLoading } = useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: residents } = useQuery({
    queryKey: ["facility-residents", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_residents")
        .select(`
          *,
          member:members (
            *,
            profile:profiles (*)
          )
        `)
        .eq("facility_id", id)
        .is("discharge_date", null);

      if (error) throw error;
      return data;
    }
  });

  const { data: staff } = useQuery({
    queryKey: ["facility-staff", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_staff")
        .select(`
          *,
          profile:profiles (*)
        `)
        .eq("facility_id", id);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <AdminDashboardLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const occupancyRate = facility?.bed_capacity 
    ? Math.round(((residents?.length || 0) / facility.bed_capacity) * 100)
    : 0;

  return (
    <AdminDashboardLayout title={facility?.name || "Facility Details"}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/facilities")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight">{facility?.name}</h2>
            <p className="text-muted-foreground">
              {facility?.address_line1}, {facility?.city}, {facility?.postal_code}
            </p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{residents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                of {facility?.bed_capacity} beds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Team members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={
                facility?.subscription_status === "active" ? "default" : "secondary"
              }>
                {facility?.subscription_status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {facility?.facility_type}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="residents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="residents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Residents</h3>
              <Button>Add Resident</Button>
            </div>
            {residents && residents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {residents.map((resident: any) => (
                  <Card key={resident.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {resident.member?.profile?.first_name} {resident.member?.profile?.last_name}
                      </CardTitle>
                      <CardDescription>
                        Room {resident.room_number} • Admitted {new Date(resident.admission_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No residents currently in this facility</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Facility Staff</h3>
              <Button>Add Staff Member</Button>
            </div>
            {staff && staff.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {staff.map((member: any) => (
                  <Card key={member.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {member.profile?.first_name} {member.profile?.last_name}
                      </CardTitle>
                      <CardDescription>
                        {member.staff_role}
                        {member.is_facility_admin && " • Administrator"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {member.profile?.email}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No staff members assigned</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Number</p>
                    <p className="text-sm">{facility?.license_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Facility Type</p>
                    <p className="text-sm">{facility?.facility_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bed Capacity</p>
                    <p className="text-sm">{facility?.bed_capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-sm">{facility?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{facility?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {facility?.created_at ? new Date(facility.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

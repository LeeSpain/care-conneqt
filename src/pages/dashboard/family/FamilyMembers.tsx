import { useEffect, useState } from "react";
import { FamilyDashboardLayout } from "@/components/FamilyDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { User, Phone, MapPin, Heart, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FamilyMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    try {
      // Get family carer record
      const { data: carerData } = await supabase
        .from("family_carers")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (carerData) {
        // Get connected members
        const { data: connections } = await supabase
          .from("member_carers")
          .select(`
            id,
            accepted_at,
            members (
              id,
              user_id,
              care_level,
              mobility_level,
              medical_conditions,
              profiles (
                first_name,
                last_name,
                avatar_url,
                phone
              )
            )
          `)
          .eq("carer_id", carerData.id);

        setMembers(connections || []);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FamilyDashboardLayout title="Family Members">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Family Members</h2>
            <p className="text-muted-foreground">
              Manage and monitor your connected family members
            </p>
          </div>
          <Button>Invite Family Member</Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Family Members Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't connected with any family members yet
              </p>
              <Button>Send Invitation</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((connection: any) => {
              const member = connection.members;
              const profile = member?.profiles;
              
              return (
                <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback>
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {profile?.first_name} {profile?.last_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Heart className="h-3 w-3" />
                          {member?.care_level || "Standard Care"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Mobility: {member?.mobility_level || "Not set"}</span>
                      </div>
                    </div>

                    {member?.medical_conditions && member.medical_conditions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertCircle className="h-4 w-4" />
                          Medical Conditions
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.medical_conditions.slice(0, 3).map((condition: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </FamilyDashboardLayout>
  );
}

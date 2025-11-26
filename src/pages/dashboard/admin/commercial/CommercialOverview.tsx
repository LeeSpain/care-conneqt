import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, Shield, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function CommercialOverview() {
  const navigate = useNavigate();

  // Fetch facilities stats
  const { data: facilitiesStats, isLoading: facilitiesLoading } = useQuery({
    queryKey: ["facilities-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, subscription_status");
      
      if (error) throw error;
      
      return {
        total: data.length,
        active: data.filter(f => f.subscription_status === "active").length,
        trial: data.filter(f => f.subscription_status === "trial").length,
      };
    },
  });

  // Fetch care companies stats
  const { data: companiesStats, isLoading: companiesLoading } = useQuery({
    queryKey: ["care-companies-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("care_companies")
        .select("id, subscription_status, total_clients");
      
      if (error) throw error;
      
      return {
        total: data.length,
        active: data.filter(c => c.subscription_status === "active").length,
        totalClients: data.reduce((sum, c) => sum + (c.total_clients || 0), 0),
      };
    },
  });

  // Fetch insurance companies stats
  const { data: insuranceStats, isLoading: insuranceLoading } = useQuery({
    queryKey: ["insurance-companies-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_companies")
        .select("id, subscription_status, total_policies");
      
      if (error) throw error;
      
      const { data: coveredMembers } = await supabase
        .from("covered_members")
        .select("id");
      
      return {
        total: data.length,
        active: data.filter(i => i.subscription_status === "active").length,
        totalPolicies: data.reduce((sum, i) => sum + (i.total_policies || 0), 0),
        coveredMembers: coveredMembers?.length || 0,
      };
    },
  });

  const isLoading = facilitiesLoading || companiesLoading || insuranceLoading;

  return (
    <AdminDashboardLayout
      title="Commercial Partners"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/admin/commercial/facilities")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Care Facility
          </Button>
          <Button onClick={() => navigate("/dashboard/admin/commercial/companies")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Care Company
          </Button>
          <Button onClick={() => navigate("/dashboard/admin/commercial/insurance")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance Company
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Care Facilities Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/facilities")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Care Facilities</CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{facilitiesStats?.total || 0}</div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span className="font-semibold text-green-600">{facilitiesStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trial:</span>
                      <span className="font-semibold text-yellow-600">{facilitiesStats?.trial || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Care Companies Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/companies")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Care Companies</CardTitle>
              <Briefcase className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{companiesStats?.total || 0}</div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span className="font-semibold text-green-600">{companiesStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Clients:</span>
                      <span className="font-semibold">{companiesStats?.totalClients || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Insurance Companies Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/insurance")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insurance Companies</CardTitle>
              <Shield className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{insuranceStats?.total || 0}</div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Active:</span>
                      <span className="font-semibold text-green-600">{insuranceStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Covered Members:</span>
                      <span className="font-semibold">{insuranceStats?.coveredMembers || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Facilities Revenue</div>
                <div className="text-2xl font-bold">£{((facilitiesStats?.active || 0) * 299).toLocaleString()}/mo</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Companies Revenue</div>
                <div className="text-2xl font-bold">£{((companiesStats?.active || 0) * 199).toLocaleString()}/mo</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Insurance Revenue</div>
                <div className="text-2xl font-bold">£{((insuranceStats?.active || 0) * 399).toLocaleString()}/mo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

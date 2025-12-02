import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, Shield, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function CommercialOverview() {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard-admin');

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
    <AdminDashboardLayout title={t('commercial.title')}>
      <div className="space-y-6">
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/admin/commercial/facilities")}>
            <Plus className="h-4 w-4 mr-2" />
            {t('commercial.addFacility')}
          </Button>
          <Button onClick={() => navigate("/dashboard/admin/commercial/companies")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('commercial.addCompany')}
          </Button>
          <Button onClick={() => navigate("/dashboard/admin/commercial/insurance")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('commercial.addInsurance')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/facilities")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('commercial.careFacilities')}</CardTitle>
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
                      <span>{t('commercial.active')}:</span>
                      <span className="font-semibold text-green-600">{facilitiesStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('commercial.trial')}:</span>
                      <span className="font-semibold text-yellow-600">{facilitiesStats?.trial || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/companies")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('commercial.careCompanies')}</CardTitle>
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
                      <span>{t('commercial.active')}:</span>
                      <span className="font-semibold text-green-600">{companiesStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('commercial.totalClients')}:</span>
                      <span className="font-semibold">{companiesStats?.totalClients || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/dashboard/admin/commercial/insurance")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('commercial.insuranceCompanies')}</CardTitle>
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
                      <span>{t('commercial.active')}:</span>
                      <span className="font-semibold text-green-600">{insuranceStats?.active || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('commercial.coveredMembers')}:</span>
                      <span className="font-semibold">{insuranceStats?.coveredMembers || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('commercial.revenueSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('commercial.facilitiesRevenue')}</div>
                <div className="text-2xl font-bold">€{((facilitiesStats?.active || 0) * 299).toLocaleString()}/mo</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('commercial.companiesRevenue')}</div>
                <div className="text-2xl font-bold">€{((companiesStats?.active || 0) * 199).toLocaleString()}/mo</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('commercial.insuranceRevenue')}</div>
                <div className="text-2xl font-bold">€{((insuranceStats?.active || 0) * 399).toLocaleString()}/mo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('commercial.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {t('commercial.noRecentActivity')}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}

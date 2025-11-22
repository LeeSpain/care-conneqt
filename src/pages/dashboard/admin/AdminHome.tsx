import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Activity, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useTranslation } from 'react-i18next';

export default function AdminHome() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation('dashboard');
  const { data: stats, isLoading, isError, error, refetch } = useAdminStats();

  const handleRefresh = () => {
    refetch();
  };

  if (isError) {
    return (
      <AdminDashboardLayout title={t('admin.title')}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error?.message || t('errors.loadFailed')}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('errors.refresh')}
            </Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={t('admin.title')}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('welcome')}, Admin</h2>
            <p className="text-muted-foreground">
              {t('admin.description')}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('common.all')} {t('labels.registered')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('status.active')} {t('nurse.myMembers')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeMembers || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('member.profile')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('nurse.title')}</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalNurses || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('careTeam.title')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('quickStats.facilities')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalFacilities || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('quickStats.facilities')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('nurse.memberDetail.quickActions')}</CardTitle>
              <CardDescription>{t('admin.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/nurses')}
                className="justify-start"
              >
                {t('actions.add')} Nurse
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/members')}
                className="justify-start"
              >
                {t('actions.add')} Member
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/facilities')}
                className="justify-start"
              >
                {t('actions.add')} Facility
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/announcements')}
                className="justify-start"
              >
                {t('actions.add')} Announcement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('quickStats.systemHealth')}</CardTitle>
              <CardDescription>{t('status.active')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">{t('common.all')} {t('status.active')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, CheckCircle, XCircle, RefreshCw, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLeadStats, useLeads } from "@/hooks/useLeads";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { AddLeadDialog } from "@/components/admin/AddLeadDialog";
import { useTranslation } from "react-i18next";

export default function LeadsDashboard() {
  const { t } = useTranslation('dashboard-admin');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useLeadStats();
  const { data: recentLeads, isLoading: leadsLoading } = useLeads({});
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleRefresh = () => {
    refetchStats();
    toast({ title: t('toast.success.saved'), description: t('leads.messages.leadUpdated') });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      qualified: "bg-purple-500",
      proposal: "bg-orange-500",
      won: "bg-green-500",
      lost: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getTypeLabel = (type: string) => {
    return t(`leads.types.${type}`, { defaultValue: type });
  };

  return (
    <AdminDashboardLayout title={t('leads.dashboard')}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('leads.title')}</h2>
            <p className="text-muted-foreground">
              {t('leads.dashboard')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('leads.addLead')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('leads.totalLeads')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.total_leads || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('supportTickets.allTime')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('leads.newToday')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.new_today || 0}</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('leads.won')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.by_status?.won || 0}</div>
                  <p className="text-xs text-muted-foreground">{t('sales.completed')}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('leads.conversionRate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.conversion_rate?.toFixed(1) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Lead to conversion</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('leads.fields.status')}</CardTitle>
              <CardDescription>Current pipeline distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats?.by_status || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                        <span className="capitalize">{t(`leads.status.${status}`, { defaultValue: status })}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('leads.fields.type')}</CardTitle>
              <CardDescription>Customer segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats?.by_type || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span>{getTypeLabel(type)}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest incoming prospects</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard/admin/leads/list')}>
              {t('leads.allLeads')}
            </Button>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.slice(0, 10).map(lead => (
                  <div 
                    key={lead.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/admin/leads/${lead.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{lead.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(lead.lead_type || 'other')}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(lead.status || 'new')}`}>
                          {t(`leads.status.${lead.status}`, { defaultValue: lead.status })}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{lead.email}</span>
                        {lead.organization_name && <span>• {lead.organization_name}</span>}
                        <span>• {format(new Date(lead.created_at || ''), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {t('supportTickets.viewDetails')}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('leads.messages.noLeads')}</p>
                <Button variant="link" onClick={() => setShowAddDialog(true)}>
                  {t('leads.addLead')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddLeadDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </AdminDashboardLayout>
  );
}

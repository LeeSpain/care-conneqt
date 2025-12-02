import { useParams, useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useLead, useUpdateLead, useAddLeadActivity, useDeleteLead } from "@/hooks/useLeads";
import { ArrowLeft, Mail, Phone, Building, Calendar, Trash2, Save, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LeadDetail() {
  const { t } = useTranslation('dashboard-admin');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading } = useLead(id!);
  const updateMutation = useUpdateLead();
  const addActivityMutation = useAddLeadActivity();
  const deleteMutation = useDeleteLead();

  const [activityType, setActivityType] = useState<string>("note");
  const [activityText, setActivityText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (adminRoles && adminRoles.length > 0) {
        const adminIds = adminRoles.map(r => r.user_id);
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', adminIds);
        
        if (profiles) {
          const users = profiles.map(profile => ({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown'
          }));
          setAdminUsers(users);
        }
      }
    };
    
    fetchAdminUsers();
  }, []);

  if (isLoading) {
    return (
      <AdminDashboardLayout title={t('leads.detail.title')}>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!data) {
    return (
      <AdminDashboardLayout title={t('leads.detail.notFound')}>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{t('leads.detail.notFound')}</p>
            <Button onClick={() => navigate('/dashboard/admin/leads/list')}>
              {t('leads.detail.backToLeads')}
            </Button>
          </CardContent>
        </Card>
      </AdminDashboardLayout>
    );
  }

  const { lead, activities } = data;

  const handleStatusChange = async (newStatus: string) => {
    await updateMutation.mutateAsync({ id: lead.id, status: newStatus });
    await addActivityMutation.mutateAsync({
      lead_id: lead.id,
      activity_type: 'status_change',
      description: `Status changed to ${newStatus}`,
      metadata: { old_status: lead.status, new_status: newStatus },
    });
  };

  const handleAddActivity = async () => {
    if (!activityText.trim()) return;
    await addActivityMutation.mutateAsync({
      lead_id: lead.id,
      activity_type: activityType,
      description: activityText,
    });
    setActivityText("");
    toast({ title: t('leads.detail.activityAdded') });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(lead.id);
    navigate('/dashboard/admin/leads/list');
  };

  return (
    <AdminDashboardLayout title={t('leads.detail.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/admin/leads/list')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold">{lead.name}</h2>
              <p className="text-muted-foreground">{lead.email}</p>
            </div>
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('leads.detail.deleteLead')}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('leads.detail.contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.organization_name && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.organization_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t('leads.detail.created')} {lead.created_at ? format(new Date(lead.created_at), 'MMM d, yyyy') : 'Unknown'}</span>
                  </div>
                </div>
                {lead.message && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">{t('leads.detail.initialMessage')}:</p>
                    <p>{lead.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('leads.detail.activityTimeline')}</CardTitle>
                <CardDescription>{t('leads.detail.activityDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={activityType === "call" ? "default" : "outline"}
                        onClick={() => setActivityType("call")}
                      >
                        {t('leads.activities.call')}
                      </Button>
                      <Button
                        size="sm"
                        variant={activityType === "email" ? "default" : "outline"}
                        onClick={() => setActivityType("email")}
                      >
                        {t('leads.activities.email')}
                      </Button>
                      <Button
                        size="sm"
                        variant={activityType === "meeting" ? "default" : "outline"}
                        onClick={() => setActivityType("meeting")}
                      >
                        {t('leads.activities.meeting')}
                      </Button>
                      <Button
                        size="sm"
                        variant={activityType === "note" ? "default" : "outline"}
                        onClick={() => setActivityType("note")}
                      >
                        {t('leads.activities.note')}
                      </Button>
                    </div>
                    <Textarea
                      placeholder={t('leads.detail.addActivityPlaceholder')}
                      value={activityText}
                      onChange={(e) => setActivityText(e.target.value)}
                    />
                    <Button onClick={handleAddActivity} disabled={!activityText.trim()}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('leads.detail.addActivity')}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {activities && activities.length > 0 ? (
                      activities.map((activity) => (
                        <div key={activity.id} className="border-l-2 pl-4 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.activity_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {activity.created_at ? format(new Date(activity.created_at), 'MMM d, yyyy HH:mm') : 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm">{activity.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        {t('leads.detail.noActivities')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('leads.detail.status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={lead.status || 'new'} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t('leads.status.new')}</SelectItem>
                    <SelectItem value="contacted">{t('leads.status.contacted')}</SelectItem>
                    <SelectItem value="qualified">{t('leads.status.qualified')}</SelectItem>
                    <SelectItem value="proposal">{t('leads.status.proposal')}</SelectItem>
                    <SelectItem value="won">{t('leads.status.won')}</SelectItem>
                    <SelectItem value="lost">{t('leads.status.lost')}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  {t('leads.detail.assignedTo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={lead.assigned_to || 'unassigned'} 
                  onValueChange={async (value) => {
                    const assignedTo = value === 'unassigned' ? null : value;
                    await updateMutation.mutateAsync({ id: lead.id, assigned_to: assignedTo });
                    
                    if (assignedTo) {
                      const assignedUser = adminUsers.find(u => u.id === assignedTo);
                      await addActivityMutation.mutateAsync({
                        lead_id: lead.id,
                        activity_type: 'note',
                        description: `Lead assigned to ${assignedUser?.name || 'admin'}`,
                      });
                    }
                    
                    toast({ title: t('leads.detail.assignmentUpdated') });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leads.detail.unassigned')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">{t('leads.detail.unassigned')}</SelectItem>
                    {adminUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('leads.detail.leadDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('leads.detail.type')}</p>
                  <Badge variant="outline">{lead.lead_type || 'personal'}</Badge>
                </div>
                {lead.source_page && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t('leads.detail.source')}</p>
                    <p className="text-sm">{lead.source_page}</p>
                  </div>
                )}
                {lead.estimated_value && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t('leads.detail.estimatedValue')}</p>
                    <p className="text-sm font-medium">€{lead.estimated_value.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('leads.detail.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('leads.detail.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('leads.detail.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('leads.detail.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

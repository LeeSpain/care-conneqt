import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

export default function InstitutionalRegistrations() {
  const { t } = useTranslation('dashboard-admin');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  const { data: registrations, isLoading, refetch } = useQuery({
    queryKey: ['institutional-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutional_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredRegistrations = registrations?.filter(reg => {
    const matchesSearch = !searchTerm || 
      reg.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: registrations?.length || 0,
    new: registrations?.filter(r => r.status === 'new').length || 0,
    contacted: registrations?.filter(r => r.status === 'contacted').length || 0,
    qualified: registrations?.filter(r => r.status === 'qualified').length || 0,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      new: { variant: "default", icon: Clock },
      contacted: { variant: "secondary", icon: Clock },
      qualified: { variant: "outline", icon: CheckCircle },
      proposal_sent: { variant: "outline", icon: CheckCircle },
      negotiating: { variant: "secondary", icon: Clock },
      closed_won: { variant: "default", icon: CheckCircle },
      closed_lost: { variant: "destructive", icon: XCircle },
    };
    const { variant, icon: Icon } = config[status] || { variant: "secondary", icon: Clock };
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('institutional_registrations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
      return;
    }

    toast.success('Status updated successfully');
    refetch();
    if (selectedRegistration?.id === id) {
      setSelectedRegistration({ ...selectedRegistration, status: newStatus });
    }
  };

  return (
    <AdminDashboardLayout title={t('institutionalRegistrations.title')}>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('institutionalRegistrations.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('institutionalRegistrations.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('institutionalRegistrations.total')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('institutionalRegistrations.new')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.new}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('institutionalRegistrations.contacted')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('institutionalRegistrations.qualified')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.qualified}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('institutionalRegistrations.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t('institutionalRegistrations.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('institutionalRegistrations.allStatus')}</SelectItem>
                  <SelectItem value="new">{t('institutionalRegistrations.new')}</SelectItem>
                  <SelectItem value="contacted">{t('institutionalRegistrations.contacted')}</SelectItem>
                  <SelectItem value="qualified">{t('institutionalRegistrations.qualified')}</SelectItem>
                  <SelectItem value="proposal_sent">{t('institutionalRegistrations.proposalSent')}</SelectItem>
                  <SelectItem value="negotiating">{t('institutionalRegistrations.negotiating')}</SelectItem>
                  <SelectItem value="closed_won">{t('institutionalRegistrations.closedWon')}</SelectItem>
                  <SelectItem value="closed_lost">{t('institutionalRegistrations.closedLost')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('institutionalRegistrations.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">{t('institutionalRegistrations.loading')}</p>
            ) : filteredRegistrations && filteredRegistrations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('institutionalRegistrations.organization')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.contact')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.type')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.residents')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.status')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.date')}</TableHead>
                    <TableHead>{t('institutionalRegistrations.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reg.organization_name}</p>
                          <p className="text-sm text-muted-foreground">{reg.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reg.contact_name}</p>
                          <p className="text-sm text-muted-foreground">{reg.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reg.organization_type}</Badge>
                      </TableCell>
                      <TableCell>{reg.resident_count || reg.employee_count || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell>{format(new Date(reg.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRegistration(reg)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('institutionalRegistrations.noRegistrations')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('institutionalRegistrations.registrationDetails')}</DialogTitle>
            </DialogHeader>
            
            {selectedRegistration && (
              <div className="space-y-6">
                {/* Status Update */}
                <div>
                  <Label>{t('institutionalRegistrations.status')}</Label>
                  <Select 
                    value={selectedRegistration.status} 
                    onValueChange={(value) => updateStatus(selectedRegistration.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organization Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('institutionalRegistrations.organizationDetails')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t('leads.fields.name')}</Label>
                      <p className="font-medium">{selectedRegistration.organization_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.type')}</Label>
                      <p className="font-medium">{selectedRegistration.organization_type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.registrationNumber')}</Label>
                      <p className="font-medium">{selectedRegistration.registration_number || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.website')}</Label>
                      <p className="font-medium">{selectedRegistration.website || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                  </div>
                  
                  {selectedRegistration.address_line1 && (
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.address')}</Label>
                      <p className="font-medium">
                        {selectedRegistration.address_line1}
                        {selectedRegistration.address_line2 && `, ${selectedRegistration.address_line2}`}
                        <br />
                        {selectedRegistration.city}, {selectedRegistration.postal_code}
                        <br />
                        {selectedRegistration.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('institutionalRegistrations.contactPerson')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t('leads.fields.name')}</Label>
                      <p className="font-medium">{selectedRegistration.contact_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.jobTitle')}</Label>
                      <p className="font-medium">{selectedRegistration.contact_job_title || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('leads.fields.email')}</Label>
                      <p className="font-medium">{selectedRegistration.contact_email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('leads.fields.phone')}</Label>
                      <p className="font-medium">{selectedRegistration.contact_phone || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                  </div>
                </div>

                {/* Service Requirements */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('institutionalRegistrations.serviceRequirements')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.residentsEmployees')}</Label>
                      <p className="font-medium">{selectedRegistration.resident_count || selectedRegistration.employee_count || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.implementationTimeline')}</Label>
                      <p className="font-medium">{selectedRegistration.implementation_timeline || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.budgetRange')}</Label>
                      <p className="font-medium">{selectedRegistration.budget_range || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.preferredAgreement')}</Label>
                      <p className="font-medium">{selectedRegistration.preferred_agreement_length || t('institutionalRegistrations.notAvailable')}</p>
                    </div>
                  </div>
                  
                  {selectedRegistration.service_interests && selectedRegistration.service_interests.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">{t('institutionalRegistrations.servicesOfInterest')}</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRegistration.service_interests.map((service: string) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {selectedRegistration.additional_notes && (
                  <div>
                    <Label className="text-muted-foreground">{t('institutionalRegistrations.additionalNotes')}</Label>
                    <Textarea value={selectedRegistration.additional_notes} readOnly className="mt-2" />
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t pt-4 text-sm text-muted-foreground">
                  <p>{t('institutionalRegistrations.created')}: {format(new Date(selectedRegistration.created_at), 'PPpp')}</p>
                  <p>{t('institutionalRegistrations.updated')}: {format(new Date(selectedRegistration.updated_at), 'PPpp')}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}

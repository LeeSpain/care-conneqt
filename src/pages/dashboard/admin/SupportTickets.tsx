import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SupportTickets() {
  const { t } = useTranslation('dashboard-admin');
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const openTickets = tickets?.filter(t => t.status === 'open') || [];
  const inProgressTickets = tickets?.filter(t => t.status === 'in_progress') || [];
  const resolvedTickets = tickets?.filter(t => t.status === 'resolved' || t.status === 'closed') || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const TicketList = ({ tickets: ticketList }: { tickets: any[] }) => (
    <div className="space-y-4">
      {ticketList.length > 0 ? (
        ticketList.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{ticket.title}</CardTitle>
                  <CardDescription>
                    {ticket.user?.first_name} {ticket.user?.last_name} • {ticket.user?.email}
                  </CardDescription>
                </div>
                <Badge variant={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {ticket.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(ticket.created_at).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm">{t('supportTickets.viewDetails')}</Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">{t('supportTickets.noTickets')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <AdminDashboardLayout title={t('supportTickets.title')}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('supportTickets.title')}</h2>
          <p className="text-muted-foreground">
            {t('supportTickets.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('supportTickets.openTickets')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('supportTickets.awaitingResponse')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('supportTickets.inProgress')}</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTickets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('supportTickets.beingAddressed')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('supportTickets.resolved')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('supportTickets.allTime')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="open" className="space-y-4">
          <TabsList>
            <TabsTrigger value="open">
              {t('supportTickets.open')} ({openTickets.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              {t('supportTickets.inProgress')} ({inProgressTickets.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              {t('supportTickets.resolved')} ({resolvedTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            <TicketList tickets={openTickets} />
          </TabsContent>

          <TabsContent value="in-progress">
            <TicketList tickets={inProgressTickets} />
          </TabsContent>

          <TabsContent value="resolved">
            <TicketList tickets={resolvedTickets} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
}

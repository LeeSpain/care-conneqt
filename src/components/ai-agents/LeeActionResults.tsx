import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Building2, UserCheck, Package, Ticket, Bell, 
  TrendingUp, DollarSign, CheckCircle, XCircle, AlertTriangle,
  Calendar, MessageSquare, ClipboardList, CreditCard, RefreshCw
} from 'lucide-react';

interface ActionResult {
  action: string;
  result: any;
  error?: string;
}

interface LeeActionResultsProps {
  results: ActionResult[];
}

export function LeeActionResults({ results }: LeeActionResultsProps) {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {results.map((item, index) => (
        <ActionResultCard key={index} item={item} />
      ))}
    </div>
  );
}

function ActionResultCard({ item }: { item: ActionResult }) {
  if (item.error) {
    return (
      <Card className="p-3 bg-destructive/10 border-destructive/30">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Error</span>
        </div>
        <p className="text-xs text-destructive/80 mt-1">{item.error}</p>
      </Card>
    );
  }

  const { action, result } = item;

  // Handle unsuccessful results
  if (result && result.success === false) {
    return (
      <Card className="p-3 bg-destructive/10 border-destructive/30">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium capitalize">{formatActionName(action)}</span>
        </div>
        <p className="text-xs text-destructive/80 mt-1">{result.error || 'Operation failed'}</p>
      </Card>
    );
  }

  // Render based on action type
  switch (action) {
    // READ actions
    case 'get_members':
      return <MembersResult result={result} />;
    case 'get_member_details':
      return <MemberDetailsResult result={result} />;
    case 'get_nurses':
      return <NursesResult result={result} />;
    case 'get_facilities':
      return <FacilitiesResult result={result} />;
    case 'get_leads':
      return <LeadsResult result={result} />;
    case 'get_products':
      return <ProductsResult result={result} />;
    case 'get_pricing_plans':
      return <PricingPlansResult result={result} />;
    case 'get_support_tickets':
      return <TicketsResult result={result} />;
    case 'get_announcements':
      return <AnnouncementsResult result={result} />;
    case 'get_analytics':
      return <AnalyticsResult result={result} />;
    case 'get_companies':
      return <CompaniesResult result={result} />;
    case 'lookup_user':
      return <UserLookupResult result={result} />;
    
    // CREATE actions
    case 'create_user':
    case 'create_facility':
    case 'create_company':
    case 'create_announcement':
      return <CreateResult action={action} result={result} />;
    
    // UPDATE actions
    case 'update_user_role':
    case 'update_member':
    case 'update_facility':
    case 'update_product':
    case 'update_ticket_status':
      return <UpdateResult action={action} result={result} />;
    
    // ASSIGNMENT actions
    case 'assign_nurse_to_member':
    case 'reassign_member':
    case 'admit_resident':
    case 'discharge_resident':
    case 'toggle_user_status':
      return <AssignmentResult action={action} result={result} />;
    
    // MESSAGING & SCHEDULING
    case 'send_message':
      return <MessageResult result={result} />;
    case 'schedule_appointment':
      return <AppointmentResult result={result} />;
    case 'create_task':
      return <TaskResult result={result} />;
    case 'create_reminder':
      return <ReminderResult result={result} />;
    case 'manage_alert':
      return <AlertResult result={result} />;
    case 'update_lead':
      return <LeadUpdateResult result={result} />;
    
    // FINANCE actions
    case 'get_revenue_stats':
      return <RevenueResult result={result} />;
    case 'get_subscription_details':
      return <SubscriptionResult result={result} />;
    case 'issue_credit':
      return <CreditResult result={result} />;
    case 'process_refund':
      return <RefundResult result={result} />;
    
    default:
      return <GenericResult action={action} result={result} />;
  }
}

function formatActionName(action: string): string {
  return action.replace(/_/g, ' ');
}

// READ RESULT COMPONENTS
function MembersResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Members ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.members?.slice(0, 10).map((m: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{m.name || 'Unknown'}</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px]">{m.care_level}</Badge>
                <Badge variant={m.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{m.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function MemberDetailsResult({ result }: { result: any }) {
  const m = result.member;
  return (
    <Card className="p-3 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Member Details</span>
      </div>
      <div className="text-xs space-y-1">
        <p><strong>Name:</strong> {m?.name || 'Unknown'}</p>
        <p><strong>Email:</strong> {m?.email || 'N/A'}</p>
        <p><strong>Care Level:</strong> {m?.care_level || 'Not set'}</p>
        <p><strong>Status:</strong> {m?.status || 'Unknown'}</p>
        {m?.location && <p><strong>Location:</strong> {m.location}</p>}
        {result.devices && <p><strong>Devices:</strong> {result.devices.length}</p>}
        {result.alerts && <p><strong>Recent Alerts:</strong> {result.alerts.length}</p>}
      </div>
    </Card>
  );
}

function NursesResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-secondary/10 border-secondary/30">
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="h-4 w-4 text-secondary" />
        <span className="text-sm font-medium">Nurses ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.nurses?.slice(0, 10).map((n: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{n.name || 'Unknown'}</span>
              <span className="text-muted-foreground">{n.assigned_members || 0} members</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function FacilitiesResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-blue-500/10 border-blue-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Facilities ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.facilities?.slice(0, 10).map((f: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{f.name}</span>
              <div className="flex gap-2">
                <span className="text-muted-foreground">{f.occupancy || 0}% full</span>
                <Badge variant={f.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{f.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function LeadsResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-amber-500/10 border-amber-500/30">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Leads ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.leads?.slice(0, 10).map((l: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{l.name || l.contact_name || 'Unknown'}</span>
              <Badge variant="outline" className="text-[10px]">{l.status}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function ProductsResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-purple-500/10 border-purple-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Package className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium">Products ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.products?.slice(0, 10).map((p: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground">€{p.price}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function PricingPlansResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-emerald-500/10 border-emerald-500/30">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium">Pricing Plans ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.plans?.slice(0, 10).map((p: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground">€{p.monthly_price}/mo</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function TicketsResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-orange-500/10 border-orange-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Ticket className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Support Tickets ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.tickets?.slice(0, 10).map((t: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium truncate max-w-[150px]">{t.subject || t.title}</span>
              <Badge variant={t.priority === 'urgent' ? 'destructive' : 'outline'} className="text-[10px]">{t.status}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function AnnouncementsResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-indigo-500/10 border-indigo-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium">Announcements ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.announcements?.slice(0, 5).map((a: any, i: number) => (
            <div key={i} className="text-xs py-1 border-b border-border/50 last:border-0">
              <p className="font-medium">{a.title}</p>
              <p className="text-muted-foreground truncate">{a.content?.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function AnalyticsResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Platform Analytics</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">Total Members</p>
          <p className="font-bold text-lg">{result.members || 0}</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">Active Today</p>
          <p className="font-bold text-lg">{result.active_today || result.newMembers || 0}</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">Nurses</p>
          <p className="font-bold text-lg">{result.nurses || 0}</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">Facilities</p>
          <p className="font-bold text-lg">{result.facilities || 0}</p>
        </div>
        {result.alerts !== undefined && (
          <div className="bg-background/50 rounded p-2">
            <p className="text-muted-foreground">Active Alerts</p>
            <p className="font-bold text-lg">{result.alerts}</p>
          </div>
        )}
        {result.leads !== undefined && (
          <div className="bg-background/50 rounded p-2">
            <p className="text-muted-foreground">New Leads</p>
            <p className="font-bold text-lg">{result.leads}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function CompaniesResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-cyan-500/10 border-cyan-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="h-4 w-4 text-cyan-500" />
        <span className="text-sm font-medium">Companies ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.companies?.slice(0, 10).map((c: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{c.name}</span>
              <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function UserLookupResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">User Lookup ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.users?.slice(0, 10).map((u: any, i: number) => (
            <div key={i} className="text-xs py-1 border-b border-border/50 last:border-0">
              <p className="font-medium">{u.name || `${u.first_name} ${u.last_name}`}</p>
              <p className="text-muted-foreground">{u.email}</p>
              {u.roles && <p className="text-muted-foreground">Roles: {u.roles.join(', ')}</p>}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

// CREATE RESULT
function CreateResult({ action, result }: { action: string; result: any }) {
  return (
    <Card className="p-3 bg-success/10 border-success/30">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <span className="text-sm font-medium capitalize">{formatActionName(action)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Created successfully'}
      </p>
      {result.id && <p className="text-xs mt-1"><strong>ID:</strong> {result.id}</p>}
    </Card>
  );
}

// UPDATE RESULT
function UpdateResult({ action, result }: { action: string; result: any }) {
  return (
    <Card className="p-3 bg-blue-500/10 border-blue-500/30">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium capitalize">{formatActionName(action)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Updated successfully'}
      </p>
    </Card>
  );
}

// ASSIGNMENT RESULT
function AssignmentResult({ action, result }: { action: string; result: any }) {
  return (
    <Card className="p-3 bg-secondary/10 border-secondary/30">
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-secondary" />
        <span className="text-sm font-medium capitalize">{formatActionName(action)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Assignment completed'}
      </p>
    </Card>
  );
}

// MESSAGING RESULTS
function MessageResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-success/10 border-success/30">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-success" />
        <span className="text-sm font-medium">Message Sent</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Message delivered successfully'}
      </p>
    </Card>
  );
}

function AppointmentResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-purple-500/10 border-purple-500/30">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-medium">Appointment Scheduled</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || result.title || 'Appointment created'}
      </p>
      {result.start_time && (
        <p className="text-xs mt-1">
          <strong>Time:</strong> {new Date(result.start_time).toLocaleString()}
        </p>
      )}
    </Card>
  );
}

function TaskResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-amber-500/10 border-amber-500/30">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Task Created</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || result.title || 'Task created successfully'}
      </p>
    </Card>
  );
}

function ReminderResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-indigo-500/10 border-indigo-500/30">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium">Reminder Set</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Reminder created successfully'}
      </p>
    </Card>
  );
}

function AlertResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-orange-500/10 border-orange-500/30">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Alert Updated</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Alert status updated'}
      </p>
    </Card>
  );
}

function LeadUpdateResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-amber-500/10 border-amber-500/30">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Lead Updated</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Lead status updated'}
      </p>
    </Card>
  );
}

// FINANCE RESULTS
function RevenueResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-emerald-500/10 border-emerald-500/30">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium">Revenue Statistics</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">MRR</p>
          <p className="font-bold">€{result.mrr?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-background/50 rounded p-2">
          <p className="text-muted-foreground">ARR</p>
          <p className="font-bold">€{result.arr?.toLocaleString() || 0}</p>
        </div>
        {result.total_revenue !== undefined && (
          <div className="bg-background/50 rounded p-2 col-span-2">
            <p className="text-muted-foreground">Total Revenue</p>
            <p className="font-bold">€{result.total_revenue?.toLocaleString() || 0}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function SubscriptionResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Subscriptions ({result.count})</span>
      </div>
      <ScrollArea className="max-h-40">
        <div className="space-y-1">
          {result.subscriptions?.slice(0, 10).map((s: any, i: number) => (
            <div key={i} className="text-xs flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="font-medium">{s.member_name || 'Unknown'}</span>
              <div className="flex gap-2">
                <span className="text-muted-foreground">€{s.amount}/mo</span>
                <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{s.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function CreditResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-success/10 border-success/30">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-success" />
        <span className="text-sm font-medium">Credit Issued</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || `€${result.amount} credit issued`}
      </p>
    </Card>
  );
}

function RefundResult({ result }: { result: any }) {
  return (
    <Card className="p-3 bg-amber-500/10 border-amber-500/30">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Refund Processed</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || `€${result.amount} refunded`}
      </p>
    </Card>
  );
}

// Generic fallback
function GenericResult({ action, result }: { action: string; result: any }) {
  return (
    <Card className="p-3 bg-muted">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium capitalize">{formatActionName(action)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {result.message || 'Action completed'}
      </p>
    </Card>
  );
}

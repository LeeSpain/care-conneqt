import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLeads, useDeleteLead, useUpdateLead, type Lead } from "@/hooks/useLeads";
import { Search, Plus, Filter, Download, MoreVertical, Eye, Edit, Trash, UserCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AddLeadDialog } from "@/components/admin/AddLeadDialog";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";

export default function LeadsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);

  const { data: leads, isLoading } = useLeads({
    search,
    status: statusFilter || undefined,
    lead_type: typeFilter || undefined,
  });

  const deleteMutation = useDeleteLead();
  const updateMutation = useUpdateLead();

  // Fetch admin users
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

  const handleDelete = async () => {
    if (!deleteLeadId) return;
    await deleteMutation.mutateAsync(deleteLeadId);
    setDeleteLeadId(null);
  };

  const handleAssign = async (leadId: string, userId: string | null) => {
    await updateMutation.mutateAsync({ 
      id: leadId, 
      assigned_to: userId 
    });
    toast({ title: "Lead assignment updated" });
  };

  const getAssignedUserName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    const user = adminUsers.find(u => u.id === userId);
    return user?.name || "Unknown";
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
    const labels: Record<string, string> = {
      personal: "Personal",
      facility: "Facility",
      care_company: "Care Co.",
      insurance: "Insurance",
      other: "Other",
    };
    return labels[type] || type;
  };

  return (
    <AdminDashboardLayout title="All Leads">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Leads</h2>
            <p className="text-muted-foreground">
              Manage and track all sales prospects
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, org..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="care_company">Care Company</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : leads && leads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="border-b">
                    <tr className="text-left text-sm">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Organization</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Assigned To</th>
                      <th className="p-4 font-medium">Source</th>
                      <th className="p-4 font-medium">Created</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: Lead) => (
                      <tr 
                        key={lead.id} 
                        className="border-b hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/dashboard/admin/leads/${lead.id}`)}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {lead.organization_name || '-'}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(lead.lead_type || 'other')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`text-xs ${getStatusColor(lead.status || 'new')}`}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {getAssignedUserName(lead.assigned_to)}
                        </td>
                        <td className="p-4 text-sm">
                          {lead.source_page?.replace('/','') || '-'}
                        </td>
                        <td className="p-4 text-sm">
                          {format(new Date(lead.created_at || ''), 'MMM d, yyyy')}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/leads/${lead.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setAssigningLeadId(lead.id)}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeleteLeadId(lead.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No leads found</p>
                <Button variant="link" onClick={() => setShowAddDialog(true)}>
                  Add a lead
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddLeadDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Assign Dialog */}
      <AlertDialog open={!!assigningLeadId} onOpenChange={(open) => !open && setAssigningLeadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Select an admin user to assign this lead to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select 
              onValueChange={async (value) => {
                if (assigningLeadId) {
                  await handleAssign(assigningLeadId, value === 'unassigned' ? null : value);
                  setAssigningLeadId(null);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {adminUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteLeadId} onOpenChange={(open) => !open && setDeleteLeadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead and all associated activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

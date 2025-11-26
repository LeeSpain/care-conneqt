import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, MoreVertical, UserPlus, Download, Users as UsersIcon, Shield, Stethoscope, Building2, Heart, Mail, Phone, Filter, UserCog, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { RoleManagementDialog } from "@/components/admin/RoleManagementDialog";

interface UserWithRole {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string | null;
  role: string;
  role_display: string;
  status?: string;
  stats?: {
    members?: number;
    devices?: number;
    alerts?: number;
  };
}

export default function Users() {
  const { t } = useTranslation('dashboard-admin');
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; roles: string[] } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: allUsers, isLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get unique user IDs
      const userIds = [...new Set(userRoles.map(r => r.user_id))];

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Map roles to display names
      const roleDisplayMap: Record<string, string> = {
        admin: "Administrator",
        nurse: "Nurse",
        member: "Care Member",
        family_carer: "Family Carer",
        facility_admin: "Facility Admin",
      };

      // Combine user data with roles
      const users: UserWithRole[] = profiles.map(profile => {
        const userRolesList = userRoles
          .filter(r => r.user_id === profile.id)
          .map(r => r.role);
        
        // Use primary role (first one or most important)
        const primaryRole = userRolesList.includes("admin") ? "admin" :
                          userRolesList.includes("nurse") ? "nurse" :
                          userRolesList.includes("facility_admin") ? "facility_admin" :
                          userRolesList.includes("member") ? "member" :
                          userRolesList[0] || "member";

        return {
          ...profile,
          role: primaryRole,
          role_display: roleDisplayMap[primaryRole] || primaryRole,
        };
      });

      return users;
    },
  });

  // Get role statistics
  const roleStats = allUsers?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredUsers = allUsers?.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    if (sortBy === "name") {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "role") {
      return a.role.localeCompare(b.role);
    }
    if (sortBy === "date") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    return 0;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "nurse": return "secondary";
      case "member": return "outline";
      case "family_carer": return "outline";
      case "facility_admin": return "secondary";
      default: return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Shield;
      case "nurse": return Stethoscope;
      case "member": return Heart;
      case "family_carer": return UsersIcon;
      case "facility_admin": return UserCog;
      default: return UsersIcon;
    }
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Delete user profile and related data
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Delete user roles
      const { error: rolesError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      // Note: The actual auth.users deletion should be done via admin API
      // For now, we're just removing from our tables
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
      toast.success(t('toast.success.userDeleted'));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast.error(t('toast.error.deleteFailed', { error: error.message }));
    },
  });

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
      const key = variables.newStatus === "active" ? 'toast.success.userActivated' : 'toast.success.userDeactivated';
      toast.success(t(key));
    },
    onError: (error: any) => {
      toast.error(t('toast.error.updateFailed', { error: error.message }));
    },
  });

  const handleViewProfile = (userId: string) => {
    navigate(`/dashboard/admin/users/${userId}`);
  };

  const handleSendMessage = (userId: string, userName: string) => {
    toast.info(t('toast.info.messagingComingSoon', { name: userName }));
  };

  const handleResetPassword = async (userEmail: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      toast.success(t('toast.success.passwordResetSent'));
    } catch (error: any) {
      toast.error(t('toast.error.resetFailed', { error: error.message }));
    }
  };

  const handleToggleStatus = (user: UserWithRole) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    toggleUserStatusMutation.mutate({ userId: user.id, newStatus });
  };

  const handleDeleteUser = (user: UserWithRole) => {
    if (user.id === currentUser?.id) {
      toast.error(t('toast.error.cannotDeleteSelf'));
      return;
    }
    setUserToDelete({ id: user.id, name: `${user.first_name} ${user.last_name}` });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  return (
    <AdminDashboardLayout title={t('users.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('users.title')}</h2>
            <p className="text-muted-foreground">
              {t('users.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('users.export')}
            </Button>
            <Button onClick={() => setAddUserOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              {t('users.addUser')}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.totalUsers')}</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.admins')}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleStats?.admin || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.nurses')}</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleStats?.nurse || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.members')}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleStats?.member || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('users.familyCarers')}</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roleStats?.family_carer || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('users.searchPlaceholder')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('users.filterByRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('users.allRoles')}</SelectItem>
              <SelectItem value="admin">{t('users.administrators')}</SelectItem>
              <SelectItem value="nurse">{t('users.nurses')}</SelectItem>
              <SelectItem value="member">{t('users.careMembers')}</SelectItem>
              <SelectItem value="family_carer">{t('users.familyCarers')}</SelectItem>
              <SelectItem value="facility_admin">{t('users.facilityAdmins')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('users.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t('users.nameAZ')}</SelectItem>
              <SelectItem value="role">{t('users.role')}</SelectItem>
              <SelectItem value="date">{t('users.dateAdded')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="h-16 bg-muted rounded" />
                  </div>
                ))
              ) : filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback>
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">
                              {user.first_name} {user.last_name}
                            </p>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                              <RoleIcon className="h-3 w-3" />
                              {user.role_display}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('users.actions.title', { defaultValue: 'Actions' })}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                            {t('users.actions.viewProfile')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser({
                                id: user.id,
                                name: `${user.first_name} ${user.last_name}`,
                                roles: [user.role],
                              });
                              setRoleDialogOpen(true);
                            }}
                          >
                            {t('users.actions.manageRoles')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSendMessage(user.id, `${user.first_name} ${user.last_name}`)}>
                            {t('users.actions.sendMessage')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                            {t('users.actions.resetPassword')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(user)}
                            className="text-warning"
                          >
                            {user.status === "active" ? t('users.actions.deactivate') : t('users.actions.activate')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            disabled={user.id === currentUser?.id}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('users.actions.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center">
                  <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('users.noUsers')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
      
      {selectedUser && (
        <RoleManagementDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          currentRoles={selectedUser.roles}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteDialog.description', { name: userToDelete?.name }).replace(/<strong>/g, '').replace(/<\/strong>/g, userToDelete?.name || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('users.deleteDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('users.deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}

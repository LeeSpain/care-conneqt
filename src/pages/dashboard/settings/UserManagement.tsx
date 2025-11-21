import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Users, Shield } from 'lucide-react';

type AppRole = 'admin' | 'member' | 'family_carer' | 'nurse' | 'facility_admin';

interface UserWithRoles {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  roles: AppRole[];
}

const AVAILABLE_ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access and user management' },
  { value: 'member', label: 'Member', description: 'Care recipient with access to personal dashboard' },
  { value: 'family_carer', label: 'Family Carer', description: 'Family member providing care support' },
  { value: 'nurse', label: 'Nurse', description: 'Healthcare professional managing members' },
  { value: 'facility_admin', label: 'Facility Admin', description: 'Administrator of care facility' },
];

export default function UserManagement() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { roles, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!loading && !roles.includes('admin')) {
      navigate('/dashboard');
    }
  }, [roles, loading, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('email');

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (userRoles || [])
          .filter(ur => ur.user_id === profile.id)
          .map(ur => ur.role as AppRole),
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openRoleDialog = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles);
    setIsDialogOpen(true);
  };

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const saveRoles = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      setSaving(true);

      // Get current roles
      const currentRoles = selectedUser.roles;
      
      // Roles to add
      const rolesToAdd = selectedRoles.filter(r => !currentRoles.includes(r));
      
      // Roles to remove
      const rolesToRemove = currentRoles.filter(r => !selectedRoles.includes(r));

      // Add new roles
      if (rolesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(
            rolesToAdd.map(role => ({
              user_id: selectedUser.id,
              role,
              assigned_by: currentUser.id,
            }))
          );

        if (insertError) throw insertError;
      }

      // Remove old roles
      if (rolesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id)
          .in('role', rolesToRemove);

        if (deleteError) throw deleteError;
      }

      toast.success('Roles updated successfully');
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update roles');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="User Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>User Management</CardTitle>
            </div>
            <CardDescription>
              Manage user roles and permissions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : 'No name'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.length > 0 ? (
                          user.roles.map(role => (
                            <Badge key={role} variant="secondary">
                              {AVAILABLE_ROLES.find(r => r.value === role)?.label || role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(user)}
                        disabled={user.id === currentUser?.id}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Manage Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Assign roles to {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {AVAILABLE_ROLES.map(role => (
              <div key={role.value} className="flex items-start space-x-3">
                <Checkbox
                  id={role.value}
                  checked={selectedRoles.includes(role.value)}
                  onCheckedChange={() => handleRoleToggle(role.value)}
                />
                <div className="flex-1">
                  <label
                    htmlFor={role.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {role.label}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRoles} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

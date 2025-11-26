import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddInsuranceStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
}

export function AddInsuranceStaffDialog({
  open,
  onOpenChange,
  companyId,
}: AddInsuranceStaffDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiredAt, setHiredAt] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["available-users-insurance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .order("first_name");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !staffRole) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: staffError } = await supabase
        .from("insurance_staff")
        .insert([{
          insurance_company_id: companyId,
          user_id: selectedUserId,
          staff_role: staffRole,
          is_admin: isAdmin,
          hired_at: hiredAt || null,
        }]);

      if (staffError) throw staffError;

      // Add insurance_admin role if is_admin is true
      if (isAdmin) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{
            user_id: selectedUserId,
            role: "insurance_admin",
          }]);

        if (roleError && roleError.code !== "23505") throw roleError;
      }

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["insurance-staff", companyId] });
      queryClient.invalidateQueries({ queryKey: ["insurance-company", companyId] });
      
      setSelectedUserId("");
      setStaffRole("");
      setIsAdmin(false);
      setHiredAt("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Add a new staff member to this insurance company
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Select User *</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff_role">Role *</Label>
            <Input
              id="staff_role"
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              placeholder="e.g., Claims Manager, Underwriter"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hired_at">Hired Date</Label>
            <Input
              id="hired_at"
              type="date"
              value={hiredAt}
              onChange={(e) => setHiredAt(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_admin">Company Admin</Label>
            <Switch
              id="is_admin"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Staff Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

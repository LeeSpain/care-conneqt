import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCompanyStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
}

export function AddCompanyStaffDialog({
  open,
  onOpenChange,
  companyId,
}: AddCompanyStaffDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["available-users"],
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
      const { error } = await supabase
        .from("company_staff")
        .insert([{
          company_id: companyId,
          user_id: selectedUserId,
          staff_role: staffRole,
          is_company_admin: isCompanyAdmin,
        }]);

      if (error) throw error;

      // Update total_staff count
      const { data: currentStaff } = await supabase
        .from("company_staff")
        .select("id")
        .eq("company_id", companyId);

      await supabase
        .from("care_companies")
        .update({ total_staff: currentStaff?.length || 0 })
        .eq("id", companyId);

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["company-staff", companyId] });
      queryClient.invalidateQueries({ queryKey: ["care-company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["care-companies"] });
      
      setSelectedUserId("");
      setStaffRole("");
      setIsCompanyAdmin(false);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Add a staff member to this care company
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
            <Label htmlFor="staff_role">Staff Role *</Label>
            <Input
              id="staff_role"
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              placeholder="e.g., Care Coordinator, Manager"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_company_admin"
              checked={isCompanyAdmin}
              onCheckedChange={(checked) => setIsCompanyAdmin(checked as boolean)}
            />
            <Label htmlFor="is_company_admin" className="text-sm font-normal">
              Company Administrator
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Staff
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

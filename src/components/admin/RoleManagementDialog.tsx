import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RoleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRoles: string[];
}

const roleOptions = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "nurse", label: "Nurse", description: "Care delivery and member management" },
  { value: "facility_admin", label: "Facility Admin", description: "Facility management" },
  { value: "family_carer", label: "Family Carer", description: "Family member access" },
  { value: "member", label: "Care Member", description: "Care recipient" },
];

export const RoleManagementDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentRoles,
}: RoleManagementDialogProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Remove all current roles
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Add new roles
      if (selectedRoles.length > 0) {
        const roleInserts = selectedRoles.map((role) => ({
          user_id: userId,
          role: role as "admin" | "nurse" | "facility_admin" | "family_carer" | "member",
        }));

        const { error: insertError } = await supabase
          .from("user_roles")
          .insert(roleInserts);

        if (insertError) throw insertError;
      }

      toast.success("Roles updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating roles:", error);
      toast.error(error.message || "Failed to update roles");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles for {userName}</DialogTitle>
          <DialogDescription>
            Select the roles you want to assign to this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {roleOptions.map((role) => (
            <div key={role.value} className="flex items-start space-x-3">
              <Checkbox
                id={role.value}
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRoles([...selectedRoles, role.value]);
                  } else {
                    setSelectedRoles(selectedRoles.filter((r) => r !== role.value));
                  }
                }}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor={role.value} className="font-medium cursor-pointer">
                  {role.label}
                </Label>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

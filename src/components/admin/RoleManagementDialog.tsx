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
import { useTranslation } from "react-i18next";

interface RoleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentRoles: string[];
}

export const RoleManagementDialog = ({
  open,
  onOpenChange,
  userId,
  userName,
  currentRoles,
}: RoleManagementDialogProps) => {
  const { t } = useTranslation('dashboard-admin');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const roleOptions = [
    { value: "admin", label: t('dialogs.addUser.roleOptions.admin'), description: t('dialogs.addUser.roleOptions.adminDesc') },
    { value: "nurse", label: t('dialogs.addUser.roleOptions.nurse'), description: t('dialogs.addUser.roleOptions.nurseDesc') },
    { value: "facility_admin", label: t('dialogs.addUser.roleOptions.facilityAdmin'), description: t('dialogs.addUser.roleOptions.facilityAdminDesc') },
    { value: "family_carer", label: t('dialogs.addUser.roleOptions.familyCarer'), description: t('dialogs.addUser.roleOptions.familyCarerDesc') },
    { value: "member", label: t('dialogs.addUser.roleOptions.member'), description: t('dialogs.addUser.roleOptions.memberDesc') },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

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

      toast.success(t('dialogs.roleManagement.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating roles:", error);
      toast.error(error.message || t('dialogs.roleManagement.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialogs.roleManagement.title')} {userName}</DialogTitle>
          <DialogDescription>
            {t('dialogs.roleManagement.description')}
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
            {t('dialogs.common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('dialogs.roleManagement.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
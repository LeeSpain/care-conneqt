import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  staff_role: z.string().min(1, "Staff role is required"),
  is_facility_admin: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStaffRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMember: any;
  facilityId: string;
}

export const EditStaffRoleDialog = ({ open, onOpenChange, staffMember, facilityId }: EditStaffRoleDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staff_role: staffMember?.staff_role || "",
      is_facility_admin: staffMember?.is_facility_admin || false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facility_staff")
        .update({
          staff_role: values.staff_role,
          is_facility_admin: values.is_facility_admin,
        })
        .eq("id", staffMember.id);

      if (error) throw error;

      // Update user_roles if admin status changed
      if (values.is_facility_admin !== staffMember.is_facility_admin) {
        if (values.is_facility_admin) {
          await supabase.from("user_roles").insert({
            user_id: staffMember.user_id,
            role: "facility_admin",
          });
        } else {
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", staffMember.user_id)
            .eq("role", "facility_admin");
        }
      }

      toast.success("Staff role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["facility-staff", facilityId] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating staff role:", error);
      toast.error(error.message || "Failed to update staff role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Role</DialogTitle>
          <DialogDescription>
            Update role for {staffMember?.profile?.first_name} {staffMember?.profile?.last_name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staff_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Care Assistant">Care Assistant</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Cook">Cook</SelectItem>
                      <SelectItem value="Cleaner">Cleaner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_facility_admin"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Facility Administrator</FormLabel>
                    <FormDescription>
                      Grant administrative privileges for this facility
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Role
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
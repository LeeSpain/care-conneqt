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
import { Input } from "@/components/ui/input";
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
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  user_id: z.string().min(1, "Please select a user"),
  staff_role: z.string().min(1, "Staff role is required"),
  is_facility_admin: z.boolean().default(false),
  hired_at: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFacilityStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilityId: string;
}

export const AddFacilityStaffDialog = ({ open, onOpenChange, facilityId }: AddFacilityStaffDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available users (those not already staff at this facility)
  const { data: availableUsers } = useQuery({
    queryKey: ["available-facility-users", facilityId],
    queryFn: async () => {
      const { data: allProfiles, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email");

      if (error) throw error;

      // Get users already assigned to this facility
      const { data: existingStaff } = await supabase
        .from("facility_staff")
        .select("user_id")
        .eq("facility_id", facilityId);

      const existingIds = new Set(existingStaff?.map(s => s.user_id) || []);
      return allProfiles.filter(p => !existingIds.has(p.id));
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      staff_role: "",
      is_facility_admin: false,
      hired_at: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facility_staff")
        .insert({
          facility_id: facilityId,
          user_id: values.user_id,
          staff_role: values.staff_role,
          is_facility_admin: values.is_facility_admin,
          hired_at: values.hired_at || null,
        });

      if (error) throw error;

      // Add facility_admin role if checked
      if (values.is_facility_admin) {
        await supabase.from("user_roles").insert({
          user_id: values.user_id,
          role: "facility_admin",
        });
      }

      toast.success("Staff member added successfully!");
      queryClient.invalidateQueries({ queryKey: ["facility-staff", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast.error(error.message || "Failed to add staff member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>
            Assign a user to this facility as a staff member
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers?.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only users not already assigned to this facility are shown
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="staff_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
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
                name="hired_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      Grant this staff member administrative privileges for this facility
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
                Add Staff Member
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
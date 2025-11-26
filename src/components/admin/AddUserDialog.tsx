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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  sendInvitation: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "nurse", label: "Nurse", description: "Care delivery and member management" },
  { value: "facility_admin", label: "Facility Admin", description: "Facility management" },
  { value: "family_carer", label: "Family Carer", description: "Family member access" },
  { value: "member", label: "Care Member", description: "Care recipient" },
];

export const AddUserDialog = ({ open, onOpenChange }: AddUserDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      roles: [],
      sendInvitation: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Create auth user (they'll need to set password via invitation)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        email_confirm: true,
        user_metadata: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
      });

      if (authError) throw authError;

      // Update profile with additional info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: values.phone,
          status: values.sendInvitation ? "pending" : "active",
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      // Assign roles
      const roleInserts = values.roles.map((role) => ({
        user_id: authData.user.id,
        role: role as "admin" | "nurse" | "facility_admin" | "family_carer" | "member",
      }));

      const { error: rolesError } = await supabase
        .from("user_roles")
        .insert(roleInserts);

      if (rolesError) throw rolesError;

      // If member role, create member record
      if (values.roles.includes("member")) {
        await supabase.from("members").insert({
          user_id: authData.user.id,
        });
      }

      // If family_carer role, create family_carers record
      if (values.roles.includes("family_carer")) {
        await supabase.from("family_carers").insert({
          user_id: authData.user.id,
          relationship_to_member: "Family Member",
        });
      }

      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account and assign roles
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <FormField
                        key={role.value}
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, role.value])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== role.value)
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">{role.label}</FormLabel>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendInvitation"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Send email invitation</FormLabel>
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
                Create User
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  member_id: z.string().min(1, "Please select a member"),
  room_number: z.string().min(1, "Room number is required"),
  admission_date: z.string().min(1, "Admission date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AdmitResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilityId: string;
}

export const AdmitResidentDialog = ({ open, onOpenChange, facilityId }: AdmitResidentDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available members (those not currently admitted to any facility)
  const { data: availableMembers } = useQuery({
    queryKey: ["available-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(`
          id,
          user_id,
          profiles!inner (
            id,
            first_name,
            last_name,
            email
          )
        `);

      if (error) throw error;

      // Filter out members who are already admitted to a facility
      const { data: admittedMembers } = await supabase
        .from("facility_residents")
        .select("member_id")
        .is("discharge_date", null);

      const admittedIds = new Set(admittedMembers?.map(r => r.member_id) || []);
      return data.filter(m => !admittedIds.has(m.id));
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: "",
      room_number: "",
      admission_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facility_residents")
        .insert({
          facility_id: facilityId,
          member_id: values.member_id,
          room_number: values.room_number,
          admission_date: values.admission_date,
        });

      if (error) throw error;

      toast.success("Resident admitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["facility-residents", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error admitting resident:", error);
      toast.error(error.message || "Failed to admit resident");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admit Resident</DialogTitle>
          <DialogDescription>
            Add a new resident to this facility
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Member</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a care member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableMembers?.map((member: any) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.profiles.first_name} {member.profiles.last_name} ({member.profiles.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only members not currently admitted to any facility are shown
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="101" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admission_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                Admit Resident
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
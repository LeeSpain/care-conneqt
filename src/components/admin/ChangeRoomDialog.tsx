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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ChangeRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: any;
  facilityId: string;
}

export const ChangeRoomDialog = ({ open, onOpenChange, resident, facilityId }: ChangeRoomDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_number: resident?.room_number || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facility_residents")
        .update({ room_number: values.room_number })
        .eq("id", resident.id);

      if (error) throw error;

      toast.success("Room changed successfully");
      queryClient.invalidateQueries({ queryKey: ["facility-residents", facilityId] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error changing room:", error);
      toast.error(error.message || "Failed to change room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Room</DialogTitle>
          <DialogDescription>
            Change room for {resident?.member?.profile?.first_name} {resident?.member?.profile?.last_name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="room_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Room Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="102" />
                  </FormControl>
                  <FormMessage />
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
                Change Room
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
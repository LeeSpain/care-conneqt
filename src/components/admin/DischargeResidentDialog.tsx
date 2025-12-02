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
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  discharge_date: z.string().min(1, "Discharge date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface DischargeResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident: any;
  facilityId: string;
}

export const DischargeResidentDialog = ({ open, onOpenChange, resident, facilityId }: DischargeResidentDialogProps) => {
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discharge_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facility_residents")
        .update({ discharge_date: values.discharge_date })
        .eq("id", resident.id);

      if (error) throw error;

      toast.success(t('dialogs.dischargeResident.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ["facility-residents", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error discharging resident:", error);
      toast.error(error.message || t('dialogs.dischargeResident.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dialogs.dischargeResident.title')}</DialogTitle>
          <DialogDescription>
            {t('dialogs.dischargeResident.description')} {resident?.member?.profile?.first_name} {resident?.member?.profile?.last_name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="discharge_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dialogs.dischargeResident.dischargeDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                {t('dialogs.common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('dialogs.dischargeResident.discharge')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
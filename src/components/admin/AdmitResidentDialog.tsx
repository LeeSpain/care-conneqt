import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: availableMembers } = useQuery({
    queryKey: ["available-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select(`id, user_id, profiles!inner (id, first_name, last_name, email)`);
      if (error) throw error;
      const { data: admittedMembers } = await supabase.from("facility_residents").select("member_id").is("discharge_date", null);
      const admittedIds = new Set(admittedMembers?.map(r => r.member_id) || []);
      return data.filter(m => !admittedIds.has(m.id));
    },
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { member_id: "", room_number: "", admission_date: new Date().toISOString().split("T")[0] },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("facility_residents").insert({ facility_id: facilityId, member_id: values.member_id, room_number: values.room_number, admission_date: values.admission_date });
      if (error) throw error;
      toast.success(t('dialogs.admitResident.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ["facility-residents", facilityId] });
      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || t('dialogs.admitResident.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('dialogs.admitResident.title')}</DialogTitle>
          <DialogDescription>{t('dialogs.admitResident.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="member_id" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dialogs.admitResident.selectMember')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t('dialogs.admitResident.selectMemberPlaceholder')} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {availableMembers?.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>{member.profiles.first_name} {member.profiles.last_name} ({member.profiles.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t('dialogs.admitResident.selectMemberHelp')}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="room_number" render={({ field }) => (
                <FormItem><FormLabel>{t('dialogs.admitResident.roomNumber')}</FormLabel><FormControl><Input {...field} placeholder="101" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="admission_date" render={({ field }) => (
                <FormItem><FormLabel>{t('dialogs.admitResident.admissionDate')}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{t('dialogs.common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t('dialogs.admitResident.admitResident')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
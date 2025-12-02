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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  facility_type: z.string().min(1, "Facility type is required"),
  license_number: z.string().optional(),
  bed_capacity: z.coerce.number().min(1, "Bed capacity must be at least 1"),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  subscription_status: z.enum(["trial", "active", "past_due", "cancelled", "incomplete"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: any;
}

export const AddFacilityDialog = ({ open, onOpenChange, facility }: AddFacilityDialogProps) => {
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = !!facility;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: facility?.name || "",
      facility_type: facility?.facility_type || "",
      license_number: facility?.license_number || "",
      bed_capacity: facility?.bed_capacity || 10,
      address_line1: facility?.address_line1 || "",
      address_line2: facility?.address_line2 || "",
      city: facility?.city || "",
      postal_code: facility?.postal_code || "",
      country: facility?.country || "GB",
      email: facility?.email || "",
      phone: facility?.phone || "",
      subscription_status: facility?.subscription_status || "trial",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const facilityData = {
        ...values,
        email: values.email || null,
        phone: values.phone || null,
        license_number: values.license_number || null,
        address_line2: values.address_line2 || null,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("facilities")
          .update(facilityData as any)
          .eq("id", facility.id);

        if (error) throw error;
        toast.success(t('dialogs.addFacility.updateSuccess'));
      } else {
        const { error } = await supabase
          .from("facilities")
          .insert(facilityData as any);

        if (error) throw error;
        toast.success(t('dialogs.addFacility.createSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ["admin-facilities"] });
      queryClient.invalidateQueries({ queryKey: ["facility", facility?.id] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving facility:", error);
      toast.error(error.message || t('dialogs.addFacility.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('dialogs.addFacility.editTitle') : t('dialogs.addFacility.title')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('dialogs.addFacility.editDescription') : t('dialogs.addFacility.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.addFacility.facilityName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('dialogs.addFacility.facilityNamePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facility_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.addFacility.facilityType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('dialogs.addFacility.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="care_home">{t('dialogs.addFacility.types.careHome')}</SelectItem>
                        <SelectItem value="nursing_home">{t('dialogs.addFacility.types.nursingHome')}</SelectItem>
                        <SelectItem value="assisted_living">{t('dialogs.addFacility.types.assistedLiving')}</SelectItem>
                        <SelectItem value="residential_care">{t('dialogs.addFacility.types.residentialCare')}</SelectItem>
                        <SelectItem value="memory_care">{t('dialogs.addFacility.types.memoryCare')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.addFacility.licenseNumber')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('dialogs.addFacility.licenseNumberPlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bed_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.addFacility.bedCapacity')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dialogs.addFacility.addressLine1')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('dialogs.addFacility.addressLine1Placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dialogs.addFacility.addressLine2')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('dialogs.addFacility.addressLine2Placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.common.city')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('dialogs.addFacility.cityPlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.common.postalCode')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('dialogs.addFacility.postalCodePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.common.country')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GB">{t('dialogs.addFacility.countries.gb')}</SelectItem>
                        <SelectItem value="IE">{t('dialogs.addFacility.countries.ie')}</SelectItem>
                        <SelectItem value="US">{t('dialogs.addFacility.countries.us')}</SelectItem>
                        <SelectItem value="NL">{t('dialogs.addFacility.countries.nl')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dialogs.common.emailOptional')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder={t('dialogs.addFacility.emailPlaceholder')} />
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
                    <FormLabel>{t('dialogs.common.phoneOptional')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('dialogs.addFacility.phonePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subscription_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dialogs.common.subscriptionStatus')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="trial">{t('dialogs.addFacility.status.trial')}</SelectItem>
                      <SelectItem value="active">{t('dialogs.addFacility.status.active')}</SelectItem>
                      <SelectItem value="past_due">{t('dialogs.addFacility.status.pastDue')}</SelectItem>
                      <SelectItem value="cancelled">{t('dialogs.addFacility.status.cancelled')}</SelectItem>
                      <SelectItem value="incomplete">{t('dialogs.addFacility.status.incomplete')}</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isEdit ? t('dialogs.addFacility.updateFacility') : t('dialogs.addFacility.createFacility')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
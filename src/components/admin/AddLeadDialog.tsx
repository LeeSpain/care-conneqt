import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead, type LeadInsert } from "@/hooks/useLeads";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  lead_type: z.enum(["personal", "facility", "care_company", "insurance", "other"]).default("personal"),
  organization_name: z.string().optional(),
  organization_type: z.string().optional(),
  estimated_value: z.string().optional(),
  interest_type: z.string().default("general"),
  message: z.string().optional(),
  source_page: z.string().optional(),
  status: z.string().default("new"),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const { t } = useTranslation('dashboard-admin');
  const createMutation = useCreateLead();
  const [showOrgFields, setShowOrgFields] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      lead_type: "personal",
      organization_name: "",
      organization_type: "",
      estimated_value: "",
      interest_type: "general",
      message: "",
      source_page: "manual",
      status: "new",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    const leadData: LeadInsert = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      lead_type: data.lead_type,
      organization_name: data.organization_name || null,
      organization_type: data.organization_type || null,
      estimated_value: data.estimated_value ? parseFloat(data.estimated_value) : null,
      interest_type: data.interest_type,
      message: data.message || null,
      source_page: data.source_page || "manual",
      status: data.status || "new",
    };

    await createMutation.mutateAsync(leadData);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('leads.addLead')}</DialogTitle>
          <DialogDescription>
            Manually create a new lead record
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.name')} *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.email')} *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
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
                    <FormLabel>{t('leads.fields.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder="+31 6 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lead_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.type')}</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowOrgFields(value !== "personal");
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">{t('leads.types.personal')}</SelectItem>
                        <SelectItem value="facility">{t('leads.types.facility')}</SelectItem>
                        <SelectItem value="care_company">{t('leads.types.care_company')}</SelectItem>
                        <SelectItem value="insurance">{t('leads.types.insurance')}</SelectItem>
                        <SelectItem value="other">{t('leads.types.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showOrgFields && (
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organization_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('leads.fields.organization')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('facilities.filterByType')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Care home, Insurance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimated_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.estimatedValue')} (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="1000.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.source')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                        <SelectItem value="/personal-care">Personal Care Page</SelectItem>
                        <SelectItem value="/institutional-care">Institutional Page</SelectItem>
                        <SelectItem value="clara_ai">Clara AI</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('leads.fields.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">{t('leads.status.new')}</SelectItem>
                        <SelectItem value="contacted">{t('leads.status.contacted')}</SelectItem>
                        <SelectItem value="qualified">{t('leads.status.qualified')}</SelectItem>
                        <SelectItem value="proposal">{t('leads.status.proposal')}</SelectItem>
                        <SelectItem value="won">{t('leads.status.won')}</SelectItem>
                        <SelectItem value="lost">{t('leads.status.lost')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('leads.fields.notes')} / {t('leads.fields.message')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this lead..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('users.deleteDialog.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : t('leads.addLead')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

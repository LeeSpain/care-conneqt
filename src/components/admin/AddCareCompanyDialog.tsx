import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Database } from "@/integrations/supabase/types";

interface AddCareCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: any;
}

export function AddCareCompanyDialog({
  open,
  onOpenChange,
  company,
}: AddCareCompanyDialogProps) {
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<{
    name: string;
    company_type: string;
    registration_number: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postal_code: string;
    country: string;
    phone: string;
    email: string;
    subscription_status: Database["public"]["Enums"]["subscription_status"];
  }>({
    name: "",
    company_type: "home_care",
    registration_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    country: "GB",
    phone: "",
    email: "",
    subscription_status: "trial",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        company_type: company.company_type || "home_care",
        registration_number: company.registration_number || "",
        address_line1: company.address_line1 || "",
        address_line2: company.address_line2 || "",
        city: company.city || "",
        postal_code: company.postal_code || "",
        country: company.country || "GB",
        phone: company.phone || "",
        email: company.email || "",
        subscription_status: company.subscription_status || "trial",
      });
    } else {
      setFormData({
        name: "",
        company_type: "home_care",
        registration_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        postal_code: "",
        country: "GB",
        phone: "",
        email: "",
        subscription_status: "trial",
      });
    }
  }, [company, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (company) {
        const { error } = await supabase
          .from("care_companies")
          .update(formData)
          .eq("id", company.id);

        if (error) throw error;

        toast({
          title: t('dialogs.common.success'),
          description: t('dialogs.addCareCompany.updateSuccess'),
        });
      } else {
        const { error } = await supabase
          .from("care_companies")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: t('dialogs.common.success'),
          description: t('dialogs.addCareCompany.createSuccess'),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["care-companies"] });
      queryClient.invalidateQueries({ queryKey: ["care-companies-stats"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('dialogs.common.error'),
        description: error.message || t('dialogs.addCareCompany.createError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{company ? t('dialogs.addCareCompany.editTitle') : t('dialogs.addCareCompany.title')}</DialogTitle>
          <DialogDescription>
            {company
              ? t('dialogs.addCareCompany.editDescription')
              : t('dialogs.addCareCompany.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('dialogs.addCareCompany.companyName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_type">{t('dialogs.addCareCompany.companyType')} *</Label>
              <Select
                value={formData.company_type}
                onValueChange={(value) => setFormData({ ...formData, company_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_care">{t('dialogs.addCareCompany.types.homeCare')}</SelectItem>
                  <SelectItem value="domiciliary">{t('dialogs.addCareCompany.types.domiciliary')}</SelectItem>
                  <SelectItem value="agency">{t('dialogs.addCareCompany.types.agency')}</SelectItem>
                  <SelectItem value="other">{t('dialogs.addCareCompany.types.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration_number">{t('dialogs.addCareCompany.registrationNumber')}</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={(e) =>
                  setFormData({ ...formData, registration_number: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription_status">{t('dialogs.addCareCompany.subscriptionStatus')}</Label>
              <Select
                value={formData.subscription_status}
                onValueChange={(value: Database["public"]["Enums"]["subscription_status"]) =>
                  setFormData({ ...formData, subscription_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">{t('dialogs.addCareCompany.status.trial')}</SelectItem>
                  <SelectItem value="active">{t('dialogs.addCareCompany.status.active')}</SelectItem>
                  <SelectItem value="expired">{t('dialogs.addCareCompany.status.expired')}</SelectItem>
                  <SelectItem value="cancelled">{t('dialogs.addCareCompany.status.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">{t('dialogs.addCareCompany.addressLine1')}</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">{t('dialogs.addCareCompany.addressLine2')}</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t('dialogs.addCareCompany.city')}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">{t('dialogs.addCareCompany.postalCode')}</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t('dialogs.addCareCompany.country')}</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('dialogs.addCareCompany.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('dialogs.addCareCompany.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('dialogs.common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {company ? t('dialogs.common.update') : t('dialogs.common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
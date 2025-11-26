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
        // Update existing company
        const { error } = await supabase
          .from("care_companies")
          .update(formData)
          .eq("id", company.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Care company updated successfully",
        });
      } else {
        // Create new company
        const { error } = await supabase
          .from("care_companies")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Care company created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["care-companies"] });
      queryClient.invalidateQueries({ queryKey: ["care-companies-stats"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save care company",
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
          <DialogTitle>{company ? "Edit Care Company" : "Add Care Company"}</DialogTitle>
          <DialogDescription>
            {company
              ? "Update the care company information below"
              : "Enter the details for the new care company"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_type">Company Type *</Label>
              <Select
                value={formData.company_type}
                onValueChange={(value) => setFormData({ ...formData, company_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_care">Home Care</SelectItem>
                  <SelectItem value="domiciliary">Domiciliary</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={(e) =>
                  setFormData({ ...formData, registration_number: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription_status">Subscription Status</Label>
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
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input
              id="address_line2"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {company ? "Update Company" : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

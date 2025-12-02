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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddInsurancePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  policy?: any;
}

export function AddInsurancePolicyDialog({
  open,
  onOpenChange,
  companyId,
  policy,
}: AddInsurancePolicyDialogProps) {
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [coverageType, setCoverageType] = useState("");
  const [premiumRange, setPremiumRange] = useState("");
  const [coveredServices, setCoveredServices] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (policy) {
      setPolicyName(policy.policy_name || "");
      setCoverageType(policy.coverage_type || "");
      setPremiumRange(policy.premium_range || "");
      setCoveredServices(
        Array.isArray(policy.covered_services)
          ? policy.covered_services.join(", ")
          : ""
      );
      setIsActive(policy.is_active ?? true);
    } else {
      setPolicyName("");
      setCoverageType("");
      setPremiumRange("");
      setCoveredServices("");
      setIsActive(true);
    }
  }, [policy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName) {
      toast({
        title: t('dialogs.common.error'),
        description: t('dialogs.addInsurancePolicy.policyNameRequired'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const servicesArray = coveredServices
        ? coveredServices.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const policyData = {
        insurance_company_id: companyId,
        policy_name: policyName,
        coverage_type: coverageType || null,
        premium_range: premiumRange || null,
        covered_services: servicesArray,
        is_active: isActive,
      };

      if (policy) {
        const { error } = await supabase
          .from("insurance_policies")
          .update(policyData)
          .eq("id", policy.id);

        if (error) throw error;

        toast({
          title: t('dialogs.common.success'),
          description: t('dialogs.addInsurancePolicy.updateSuccess'),
        });
      } else {
        const { error } = await supabase
          .from("insurance_policies")
          .insert([policyData]);

        if (error) throw error;

        const { data: currentPolicies } = await supabase
          .from("insurance_policies")
          .select("id")
          .eq("insurance_company_id", companyId);

        await supabase
          .from("insurance_companies")
          .update({ total_policies: currentPolicies?.length || 0 })
          .eq("id", companyId);

        toast({
          title: t('dialogs.common.success'),
          description: t('dialogs.addInsurancePolicy.createSuccess'),
        });
      }

      queryClient.invalidateQueries({ queryKey: ["insurance-policies", companyId] });
      queryClient.invalidateQueries({ queryKey: ["insurance-company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["insurance-companies"] });

      setPolicyName("");
      setCoverageType("");
      setPremiumRange("");
      setCoveredServices("");
      setIsActive(true);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('dialogs.common.error'),
        description: error.message || t('dialogs.addInsurancePolicy.createError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{policy ? t('dialogs.addInsurancePolicy.editTitle') : t('dialogs.addInsurancePolicy.title')}</DialogTitle>
          <DialogDescription>
            {policy ? t('dialogs.addInsurancePolicy.editDescription') : t('dialogs.addInsurancePolicy.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy_name">{t('dialogs.addInsurancePolicy.policyName')} *</Label>
            <Input
              id="policy_name"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder={t('dialogs.addInsurancePolicy.policyNamePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverage_type">{t('dialogs.addInsurancePolicy.coverageType')}</Label>
            <Select value={coverageType} onValueChange={setCoverageType}>
              <SelectTrigger>
                <SelectValue placeholder={t('dialogs.addInsurancePolicy.selectCoverageType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">{t('dialogs.addInsurancePolicy.types.basic')}</SelectItem>
                <SelectItem value="standard">{t('dialogs.addInsurancePolicy.types.standard')}</SelectItem>
                <SelectItem value="premium">{t('dialogs.addInsurancePolicy.types.premium')}</SelectItem>
                <SelectItem value="comprehensive">{t('dialogs.addInsurancePolicy.types.comprehensive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="premium_range">{t('dialogs.addInsurancePolicy.premiumRange')}</Label>
            <Input
              id="premium_range"
              value={premiumRange}
              onChange={(e) => setPremiumRange(e.target.value)}
              placeholder={t('dialogs.addInsurancePolicy.premiumRangePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="covered_services">{t('dialogs.addInsurancePolicy.coveredServices')}</Label>
            <Textarea
              id="covered_services"
              value={coveredServices}
              onChange={(e) => setCoveredServices(e.target.value)}
              placeholder={t('dialogs.addInsurancePolicy.coveredServicesPlaceholder')}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {t('dialogs.addInsurancePolicy.coveredServicesHelp')}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">{t('dialogs.addInsurancePolicy.activePolicy')}</Label>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('dialogs.common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {policy ? t('dialogs.addInsurancePolicy.updatePolicy') : t('dialogs.addInsurancePolicy.addPolicy')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
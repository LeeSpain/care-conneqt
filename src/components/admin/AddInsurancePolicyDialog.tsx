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
        title: "Error",
        description: "Please provide a policy name",
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
          title: "Success",
          description: "Policy updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("insurance_policies")
          .insert([policyData]);

        if (error) throw error;

        // Update total_policies count
        const { data: currentPolicies } = await supabase
          .from("insurance_policies")
          .select("id")
          .eq("insurance_company_id", companyId);

        await supabase
          .from("insurance_companies")
          .update({ total_policies: currentPolicies?.length || 0 })
          .eq("id", companyId);

        toast({
          title: "Success",
          description: "Policy added successfully",
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
        title: "Error",
        description: error.message || "Failed to save policy",
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
          <DialogTitle>{policy ? "Edit" : "Add"} Insurance Policy</DialogTitle>
          <DialogDescription>
            {policy ? "Update" : "Create"} an insurance policy for this company
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy_name">Policy Name *</Label>
            <Input
              id="policy_name"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="e.g., Comprehensive Care Plan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverage_type">Coverage Type</Label>
            <Select value={coverageType} onValueChange={setCoverageType}>
              <SelectTrigger>
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="premium_range">Premium Range</Label>
            <Input
              id="premium_range"
              value={premiumRange}
              onChange={(e) => setPremiumRange(e.target.value)}
              placeholder="e.g., €50-€150/month"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="covered_services">Covered Services</Label>
            <Textarea
              id="covered_services"
              value={coveredServices}
              onChange={(e) => setCoveredServices(e.target.value)}
              placeholder="Enter services separated by commas"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Separate services with commas (e.g., "Home care, Medical equipment, Nurse visits")
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active Policy</Label>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {policy ? "Update" : "Add"} Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

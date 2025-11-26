import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
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

interface AddCoveredMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
}

export function AddCoveredMemberDialog({
  open,
  onOpenChange,
  companyId,
}: AddCoveredMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverageStart, setCoverageStart] = useState("");
  const [coverageEnd, setCoverageEnd] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["available-members-insurance"],
    queryFn: async () => {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, user_id")
        .order("created_at");

      if (membersError) throw membersError;

      const userIds = membersData?.map(m => m.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      return membersData?.map(member => ({
        ...member,
        profile: profilesData?.find(p => p.id === member.user_id)
      }));
    },
  });

  const { data: policies } = useQuery({
    queryKey: ["insurance-policies", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_policies")
        .select("id, policy_name, is_active")
        .eq("insurance_company_id", companyId)
        .eq("is_active", true)
        .order("policy_name");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      toast({
        title: "Error",
        description: "Please select a member",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("covered_members")
        .insert([{
          insurance_company_id: companyId,
          member_id: selectedMemberId,
          policy_id: selectedPolicyId || null,
          policy_number: policyNumber || null,
          coverage_start: coverageStart || null,
          coverage_end: coverageEnd || null,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Covered member added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["covered-members", companyId] });
      queryClient.invalidateQueries({ queryKey: ["insurance-company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["insurance-policies", companyId] });
      
      setSelectedMemberId("");
      setSelectedPolicyId("");
      setPolicyNumber("");
      setCoverageStart("");
      setCoverageEnd("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add covered member",
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
          <DialogTitle>Add Covered Member</DialogTitle>
          <DialogDescription>
            Add a member to be covered by an insurance policy
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member *</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.profile?.first_name} {member.profile?.last_name} ({member.profile?.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy">Insurance Policy</Label>
            <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a policy (optional)" />
              </SelectTrigger>
              <SelectContent>
                {policies?.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id}>
                    {policy.policy_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy_number">Policy Number</Label>
            <Input
              id="policy_number"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              placeholder="e.g., POL-2024-001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverage_start">Coverage Start</Label>
              <Input
                id="coverage_start"
                type="date"
                value={coverageStart}
                onChange={(e) => setCoverageStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage_end">Coverage End</Label>
              <Input
                id="coverage_end"
                type="date"
                value={coverageEnd}
                onChange={(e) => setCoverageEnd(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Covered Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

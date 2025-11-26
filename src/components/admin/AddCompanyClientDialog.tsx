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

interface AddCompanyClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
}

export function AddCompanyClientDialog({
  open,
  onOpenChange,
  companyId,
}: AddCompanyClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["available-members"],
    queryFn: async () => {
      // First get members with their user_ids
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, user_id")
        .order("created_at");

      if (membersError) throw membersError;

      // Then get profiles for those user_ids
      const userIds = membersData?.map(m => m.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      return membersData?.map(member => ({
        ...member,
        profile: profilesData?.find(p => p.id === member.user_id)
      }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !serviceType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("company_clients")
        .insert([{
          company_id: companyId,
          member_id: selectedMemberId,
          service_type: serviceType,
          start_date: startDate || null,
        }]);

      if (error) throw error;

      // Update total_clients count
      const { data: currentClients } = await supabase
        .from("company_clients")
        .select("id")
        .eq("company_id", companyId);

      await supabase
        .from("care_companies")
        .update({ total_clients: currentClients?.length || 0 })
        .eq("id", companyId);

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["company-clients", companyId] });
      queryClient.invalidateQueries({ queryKey: ["care-company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["care-companies"] });
      
      setSelectedMemberId("");
      setServiceType("");
      setStartDate("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            Add a member as a client to this care company
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
            <Label htmlFor="service_type">Service Type *</Label>
            <Input
              id="service_type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g., Home Care, Personal Care"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('dashboard-admin');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["available-members"],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !serviceType) {
      toast({
        title: t('dialogs.common.error'),
        description: t('dialogs.common.fillRequired'),
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

      const { data: currentClients } = await supabase
        .from("company_clients")
        .select("id")
        .eq("company_id", companyId);

      await supabase
        .from("care_companies")
        .update({ total_clients: currentClients?.length || 0 })
        .eq("id", companyId);

      toast({
        title: t('dialogs.common.success'),
        description: t('dialogs.addCompanyClient.createSuccess'),
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
        title: t('dialogs.common.error'),
        description: error.message || t('dialogs.addCompanyClient.createError'),
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
          <DialogTitle>{t('dialogs.addCompanyClient.title')}</DialogTitle>
          <DialogDescription>
            {t('dialogs.addCompanyClient.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">{t('dialogs.addCompanyClient.selectMember')} *</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder={t('dialogs.addCompanyClient.selectMemberPlaceholder')} />
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
            <Label htmlFor="service_type">{t('dialogs.addCompanyClient.serviceType')} *</Label>
            <Input
              id="service_type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder={t('dialogs.addCompanyClient.serviceTypePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">{t('dialogs.addCompanyClient.startDate')}</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('dialogs.common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('dialogs.addCompanyClient.addClient')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
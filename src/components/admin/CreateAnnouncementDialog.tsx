import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
}

const ROLES = [
  { id: "member", label: "Members" },
  { id: "family_carer", label: "Family Carers" },
  { id: "nurse", label: "Nurses" },
  { id: "facility_admin", label: "Facility Admins" },
  { id: "company_admin", label: "Company Admins" },
  { id: "insurance_admin", label: "Insurance Admins" },
];

export function CreateAnnouncementDialog({
  open,
  onOpenChange,
  editData,
}: CreateAnnouncementDialogProps) {
  const { t } = useTranslation("dashboard-admin");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(editData?.title || "");
  const [content, setContent] = useState(editData?.content || "");
  const [priority, setPriority] = useState(editData?.priority || "normal");
  const [isActive, setIsActive] = useState(editData?.is_active ?? true);
  const [targetRoles, setTargetRoles] = useState<string[]>(
    editData?.target_roles || ROLES.map((r) => r.id)
  );
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    editData?.published_at ? new Date(editData.published_at) : undefined
  );
  const [expiresDate, setExpiresDate] = useState<Date | undefined>(
    editData?.expires_at ? new Date(editData.expires_at) : undefined
  );

  const isEditing = !!editData;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const { error } = await supabase
          .from("platform_announcements")
          .update(data)
          .eq("id", editData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("platform_announcements")
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-announcements"] });
      toast({
        title: isEditing
          ? t("announcements.updateSuccess")
          : t("announcements.createSuccess"),
        description: isEditing
          ? t("announcements.updateSuccessDesc")
          : t("announcements.createSuccessDesc"),
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: t("common:error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("platform_announcements")
        .delete()
        .eq("id", editData.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-announcements"] });
      toast({
        title: t("announcements.deleteSuccess"),
        description: t("announcements.deleteSuccessDesc"),
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t("common:error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPriority("normal");
    setIsActive(true);
    setTargetRoles(ROLES.map((r) => r.id));
    setPublishDate(undefined);
    setExpiresDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      content,
      priority,
      is_active: isActive,
      target_roles: targetRoles,
      published_at: publishDate?.toISOString() || new Date().toISOString(),
      expires_at: expiresDate?.toISOString() || null,
    });
  };

  const toggleRole = (roleId: string) => {
    setTargetRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("announcements.editAnnouncement")
              : t("announcements.createAnnouncement")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("announcements.titleLabel")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("announcements.titlePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("announcements.contentLabel")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("announcements.contentPlaceholder")}
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("announcements.priority")}</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("announcements.priorityLow")}</SelectItem>
                  <SelectItem value="normal">{t("announcements.priorityNormal")}</SelectItem>
                  <SelectItem value="high">{t("announcements.priorityHigh")}</SelectItem>
                  <SelectItem value="urgent">{t("announcements.priorityUrgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="is-active">{t("announcements.activeStatus")}</Label>
              <Switch
                id="is-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("announcements.publishDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !publishDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? format(publishDate, "PPP") : t("announcements.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={setPublishDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("announcements.expiresDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiresDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresDate ? format(expiresDate, "PPP") : t("announcements.noExpiry")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiresDate}
                    onSelect={setExpiresDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t("announcements.targetRoles")}</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.id}
                    checked={targetRoles.includes(role.id)}
                    onCheckedChange={() => toggleRole(role.id)}
                  />
                  <Label htmlFor={role.id} className="text-sm font-normal cursor-pointer">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("announcements.delete")}
              </Button>
            )}
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? t("announcements.update") : t("announcements.publish")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

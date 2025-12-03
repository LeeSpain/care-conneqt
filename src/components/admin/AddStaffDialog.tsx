import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Building2, Loader2 } from "lucide-react";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Facility {
  id: string;
  name: string;
}

export function AddStaffDialog({ open, onOpenChange }: AddStaffDialogProps) {
  const { t } = useTranslation("dashboard-admin");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [staffType, setStaffType] = useState<"nurse" | "facility">("nurse");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [isFacilityAdmin, setIsFacilityAdmin] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setFacilityId("");
    setStaffRole("");
    setIsFacilityAdmin(false);
  };

  const loadFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setFacilities(data || []);
    } catch (error) {
      console.error("Error loading facilities:", error);
    } finally {
      setLoadingFacilities(false);
    }
  };

  const handleTabChange = (value: string) => {
    setStaffType(value as "nurse" | "facility");
    if (value === "facility" && facilities.length === 0) {
      loadFacilities();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if a user with this email already exists in profiles
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      let userId: string;

      if (existingProfile) {
        // User already exists, use their ID
        userId = existingProfile.id;
      } else {
        // Create a new profile with a generated UUID
        // In production, this would typically be handled via invitation flow
        const newId = crypto.randomUUID();
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: newId,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || null,
          });

        if (profileError) throw profileError;
        userId = newId;
      }

      if (staffType === "nurse") {
        // Check if nurse role already exists
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .eq("role", "nurse")
          .maybeSingle();

        if (!existingRole) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: userId,
              role: "nurse",
            });

          if (roleError) throw roleError;
        }

        toast.success(t("staff.nurseAdded", { name: `${firstName} ${lastName}` }));
      } else {
        // Check if facility staff already exists
        const { data: existingStaff } = await supabase
          .from("facility_staff")
          .select("id")
          .eq("user_id", userId)
          .eq("facility_id", facilityId)
          .maybeSingle();

        if (existingStaff) {
          toast.error(t("staff.alreadyAssigned"));
          setLoading(false);
          return;
        }

        const { error: staffError } = await supabase
          .from("facility_staff")
          .insert({
            facility_id: facilityId,
            user_id: userId,
            staff_role: staffRole,
            is_facility_admin: isFacilityAdmin,
            hired_at: new Date().toISOString(),
          });

        if (staffError) throw staffError;

        toast.success(t("staff.facilityStaffAdded", { name: `${firstName} ${lastName}` }));
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["staff-nurses"] });
      queryClient.invalidateQueries({ queryKey: ["staff-facility"] });

      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast.error(error.message || t("staff.addError"));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const baseValid = firstName.trim() && lastName.trim() && email.trim();
    if (staffType === "facility") {
      return baseValid && facilityId && staffRole;
    }
    return baseValid;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("staff.addStaff")}</DialogTitle>
          <DialogDescription>
            {t("staff.addStaffDescription")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={staffType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nurse" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              {t("staff.nurse")}
            </TabsTrigger>
            <TabsTrigger value="facility" className="gap-2">
              <Building2 className="h-4 w-4" />
              {t("staff.facilityStaff")}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Common fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("staff.firstName")} *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("staff.firstNamePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("staff.lastName")} *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("staff.lastNamePlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("staff.email")} *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("staff.emailPlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("staff.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("staff.phonePlaceholder")}
              />
            </div>

            <TabsContent value="nurse" className="mt-0 space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                {t("staff.nurseInfo")}
              </div>
            </TabsContent>

            <TabsContent value="facility" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facility">{t("staff.facility")} *</Label>
                <Select value={facilityId} onValueChange={setFacilityId}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingFacilities ? t("common.loading") : t("staff.selectFacility")} />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffRole">{t("staff.role")} *</Label>
                <Select value={staffRole} onValueChange={setStaffRole}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("staff.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Care Manager">{t("staff.roles.careManager")}</SelectItem>
                    <SelectItem value="Care Coordinator">{t("staff.roles.careCoordinator")}</SelectItem>
                    <SelectItem value="Nurse">{t("staff.roles.nurse")}</SelectItem>
                    <SelectItem value="Care Assistant">{t("staff.roles.careAssistant")}</SelectItem>
                    <SelectItem value="Administrator">{t("staff.roles.administrator")}</SelectItem>
                    <SelectItem value="Receptionist">{t("staff.roles.receptionist")}</SelectItem>
                    <SelectItem value="Other">{t("staff.roles.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isAdmin">{t("staff.facilityAdmin")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("staff.facilityAdminDescription")}
                  </p>
                </div>
                <Switch
                  id="isAdmin"
                  checked={isFacilityAdmin}
                  onCheckedChange={setIsFacilityAdmin}
                />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading || !isFormValid()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("staff.addStaff")}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

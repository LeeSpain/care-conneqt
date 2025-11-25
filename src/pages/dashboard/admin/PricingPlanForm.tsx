import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save, Languages } from "lucide-react";

type PricingPlanFormData = {
  slug: string;
  monthly_price: string;
  devices_included: string;
  family_dashboards: string;
  is_active: boolean;
  is_popular: boolean;
  sort_order: string;
  translations: {
    [key: string]: {
      name: string;
      description: string;
      features: string;
    };
  };
};

export default function PricingPlanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PricingPlanFormData>({
    slug: "",
    monthly_price: "",
    devices_included: "1",
    family_dashboards: "0",
    is_active: true,
    is_popular: false,
    sort_order: "0",
    translations: {
      en: { name: "", description: "", features: "" },
      es: { name: "", description: "", features: "" },
      nl: { name: "", description: "", features: "" },
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    if (!id) return;

    const { data: plan, error: planError } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (planError) {
      toast.error("Failed to load pricing plan");
      return;
    }

    const { data: translations } = await supabase
      .from("plan_translations")
      .select("*")
      .eq("plan_id", id);

    const translationsMap: any = { en: {}, es: {}, nl: {} };
    translations?.forEach((t: any) => {
      translationsMap[t.language] = {
        name: t.name || "",
        description: t.description || "",
        features: Array.isArray(t.features) ? t.features.join("\n") : "",
      };
    });

    setFormData({
      slug: plan.slug,
      monthly_price: plan.monthly_price?.toString() || "",
      devices_included: plan.devices_included?.toString() || "1",
      family_dashboards: plan.family_dashboards?.toString() || "0",
      is_active: plan.is_active,
      is_popular: plan.is_popular,
      sort_order: plan.sort_order?.toString() || "0",
      translations: translationsMap,
    });
  };

  const translateContent = async (text: string, targetLang: string): Promise<string> => {
    const response = await fetch("https://xuyokixtlmchqwibntep.supabase.co/functions/v1/ai-translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage: targetLang === "es" ? "Spanish" : "Dutch",
      }),
    });
    
    const data = await response.json();
    return data.translation || text;
  };

  const autoTranslate = async () => {
    try {
      setLoading(true);
      const enTrans = formData.translations.en;
      
      // Translate to Spanish
      const [esName, esDescription] = await Promise.all([
        translateContent(enTrans.name, "es"),
        enTrans.description ? translateContent(enTrans.description, "es") : Promise.resolve(""),
      ]);
      
      const esFeatures = enTrans.features
        ? await Promise.all(
            enTrans.features.split("\n").filter(f => f.trim()).map(f => translateContent(f, "es"))
          ).then(features => features.join("\n"))
        : "";
      
      // Translate to Dutch
      const [nlName, nlDescription] = await Promise.all([
        translateContent(enTrans.name, "nl"),
        enTrans.description ? translateContent(enTrans.description, "nl") : Promise.resolve(""),
      ]);
      
      const nlFeatures = enTrans.features
        ? await Promise.all(
            enTrans.features.split("\n").filter(f => f.trim()).map(f => translateContent(f, "nl"))
          ).then(features => features.join("\n"))
        : "";

      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          es: {
            name: esName,
            description: esDescription,
            features: esFeatures,
          },
          nl: {
            name: nlName,
            description: nlDescription,
            features: nlFeatures,
          },
        },
      }));

      toast.success("Translations generated successfully");
    } catch (error) {
      console.error("Error translating:", error);
      toast.error("Failed to generate translations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const planData = {
        slug: formData.slug,
        monthly_price: formData.monthly_price ? parseFloat(formData.monthly_price) : 0,
        devices_included: formData.devices_included ? parseInt(formData.devices_included) : 1,
        family_dashboards: formData.family_dashboards ? parseInt(formData.family_dashboards) : 0,
        is_active: formData.is_active,
        is_popular: formData.is_popular,
        sort_order: parseInt(formData.sort_order) || 0,
      };

      let planId = id;

      if (isEdit) {
        const { error } = await supabase
          .from("pricing_plans")
          .update(planData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("pricing_plans")
          .insert(planData)
          .select()
          .single();

        if (error) throw error;
        planId = data.id;
      }

      // Save translations
      for (const [lang, trans] of Object.entries(formData.translations)) {
        const features = trans.features
          .split("\n")
          .filter((f) => f.trim())
          .map((f) => f.trim());

        const translationData = {
          plan_id: planId,
          language: lang,
          name: trans.name,
          description: trans.description || null,
          features,
        };

        if (isEdit) {
          await supabase
            .from("plan_translations")
            .upsert(translationData, { onConflict: "plan_id,language" });
        } else {
          await supabase.from("plan_translations").insert(translationData);
        }
      }

      toast.success(isEdit ? "Pricing plan updated successfully" : "Pricing plan created successfully");
      navigate("/dashboard/admin/pricing-plans");
    } catch (error) {
      console.error("Error saving pricing plan:", error);
      toast.error("Failed to save pricing plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout title={isEdit ? "Edit Pricing Plan" : "Add Pricing Plan"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/admin/pricing-plans")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing Plans
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Plan"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="base, independent, chronic, mental"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.monthly_price}
                  onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value })}
                  placeholder="49.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devices">Devices Included</Label>
                <Input
                  id="devices"
                  type="number"
                  value={formData.devices_included}
                  onChange={(e) => setFormData({ ...formData, devices_included: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashboards">Family Dashboards (-1 for unlimited)</Label>
                <Input
                  id="dashboards"
                  type="number"
                  value={formData.family_dashboards}
                  onChange={(e) => setFormData({ ...formData, family_dashboards: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">Sort Order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
                <Label>Popular</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Translations</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={autoTranslate}
                disabled={!formData.translations.en.name || loading}
              >
                <Languages className="mr-2 h-4 w-4" />
                Auto-Translate to ES & NL
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English (Primary)</TabsTrigger>
                <TabsTrigger value="es">Spanish</TabsTrigger>
                <TabsTrigger value="nl">Dutch</TabsTrigger>
              </TabsList>

              {["en", "es", "nl"].map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      required
                      value={formData.translations[lang].name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], name: e.target.value },
                          },
                        })
                      }
                      placeholder="Base Membership"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.translations[lang].description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], description: e.target.value },
                          },
                        })
                      }
                      rows={2}
                      placeholder="Perfect for those who need basic monitoring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Features (one per line)</Label>
                    <Textarea
                      value={formData.translations[lang].features}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], features: e.target.value },
                          },
                        })
                      }
                      rows={8}
                      placeholder="24/7 monitoring&#10;SOS alerts&#10;AI Guardian"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </AdminDashboardLayout>
  );
}

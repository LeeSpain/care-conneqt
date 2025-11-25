import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save, Languages } from "lucide-react";

type ProductFormData = {
  slug: string;
  category: string;
  monthly_price: string;
  image_url: string;
  icon_name: string;
  color_class: string;
  gradient_class: string;
  is_active: boolean;
  is_popular: boolean;
  is_base_device: boolean;
  sort_order: string;
  translations: {
    [key: string]: {
      name: string;
      tagline: string;
      description: string;
      price_display: string;
      features: string;
      specs: string;
    };
  };
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    slug: "",
    category: "wearable",
    monthly_price: "",
    image_url: "",
    icon_name: "",
    color_class: "text-primary",
    gradient_class: "from-primary/10 to-primary/5",
    is_active: true,
    is_popular: false,
    is_base_device: false,
    sort_order: "0",
    translations: {
      en: { name: "", tagline: "", description: "", price_display: "", features: "", specs: "" },
      es: { name: "", tagline: "", description: "", price_display: "", features: "", specs: "" },
      nl: { name: "", tagline: "", description: "", price_display: "", features: "", specs: "" },
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (productError) {
      toast.error("Failed to load product");
      return;
    }

    const { data: translations } = await supabase
      .from("product_translations")
      .select("*")
      .eq("product_id", id);

    const translationsMap: any = { en: {}, es: {}, nl: {} };
    translations?.forEach((t: any) => {
      translationsMap[t.language] = {
        name: t.name || "",
        tagline: t.tagline || "",
        description: t.description || "",
        price_display: t.price_display || "",
        features: Array.isArray(t.features) ? t.features.join("\n") : "",
        specs: typeof t.specs === "object" ? JSON.stringify(t.specs, null, 2) : "",
      };
    });

    setFormData({
      slug: product.slug,
      category: product.category,
      monthly_price: product.monthly_price?.toString() || "",
      image_url: product.image_url || "",
      icon_name: product.icon_name || "",
      color_class: product.color_class,
      gradient_class: product.gradient_class,
      is_active: product.is_active,
      is_popular: product.is_popular,
      is_base_device: product.is_base_device,
      sort_order: product.sort_order.toString(),
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
      const [esName, esTagline, esDescription, esPriceDisplay] = await Promise.all([
        translateContent(enTrans.name, "es"),
        enTrans.tagline ? translateContent(enTrans.tagline, "es") : Promise.resolve(""),
        enTrans.description ? translateContent(enTrans.description, "es") : Promise.resolve(""),
        enTrans.price_display ? translateContent(enTrans.price_display, "es") : Promise.resolve(""),
      ]);
      
      const esFeatures = enTrans.features
        ? await Promise.all(
            enTrans.features.split("\n").filter(f => f.trim()).map(f => translateContent(f, "es"))
          ).then(features => features.join("\n"))
        : "";
      
      // Translate to Dutch
      const [nlName, nlTagline, nlDescription, nlPriceDisplay] = await Promise.all([
        translateContent(enTrans.name, "nl"),
        enTrans.tagline ? translateContent(enTrans.tagline, "nl") : Promise.resolve(""),
        enTrans.description ? translateContent(enTrans.description, "nl") : Promise.resolve(""),
        enTrans.price_display ? translateContent(enTrans.price_display, "nl") : Promise.resolve(""),
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
            ...prev.translations.es,
            name: esName,
            tagline: esTagline,
            description: esDescription,
            price_display: esPriceDisplay,
            features: esFeatures,
          },
          nl: {
            ...prev.translations.nl,
            name: nlName,
            tagline: nlTagline,
            description: nlDescription,
            price_display: nlPriceDisplay,
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
      const productData = {
        slug: formData.slug,
        category: formData.category,
        monthly_price: formData.monthly_price ? parseFloat(formData.monthly_price) : null,
        image_url: formData.image_url || null,
        icon_name: formData.icon_name || null,
        color_class: formData.color_class,
        gradient_class: formData.gradient_class,
        is_active: formData.is_active,
        is_popular: formData.is_popular,
        is_base_device: formData.is_base_device,
        sort_order: parseInt(formData.sort_order) || 0,
      };

      let productId = id;

      if (isEdit) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Save translations
      for (const [lang, trans] of Object.entries(formData.translations)) {
        const features = trans.features
          .split("\n")
          .filter((f) => f.trim())
          .map((f) => f.trim());

        let specs = {};
        try {
          specs = trans.specs ? JSON.parse(trans.specs) : {};
        } catch (e) {
          console.error("Invalid JSON in specs:", e);
        }

        const translationData = {
          product_id: productId,
          language: lang,
          name: trans.name,
          tagline: trans.tagline || null,
          description: trans.description || null,
          price_display: trans.price_display || null,
          features,
          specs,
        };

        if (isEdit) {
          await supabase
            .from("product_translations")
            .upsert(translationData, { onConflict: "product_id,language" });
        } else {
          await supabase.from("product_translations").insert(translationData);
        }
      }

      toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout title={isEdit ? "Edit Product" : "Add Product"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/admin/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
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
                  placeholder="vivago-watch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wearable">Wearable</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="cognitive">Cognitive</SelectItem>
                    <SelectItem value="home-monitoring">Home Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Monthly Price (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.monthly_price}
                  onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value })}
                  placeholder="19.99"
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
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  placeholder="Watch, Pill, Calendar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
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
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_base_device}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_base_device: checked })}
                />
                <Label>Base Device</Label>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={formData.translations[lang].tagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], tagline: e.target.value },
                          },
                        })
                      }
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
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Display</Label>
                    <Input
                      value={formData.translations[lang].price_display}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], price_display: e.target.value },
                          },
                        })
                      }
                      placeholder="Included in Base Package or +€19.99/month"
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
                      rows={5}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specs (JSON format)</Label>
                    <Textarea
                      value={formData.translations[lang].specs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [lang]: { ...formData.translations[lang], specs: e.target.value },
                          },
                        })
                      }
                      rows={5}
                      placeholder='{"batteryLife": "7 days", "connectivity": "Bluetooth 5.0"}'
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

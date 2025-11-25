import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export type Product = {
  id: string;
  slug: string;
  category: string;
  monthly_price: number | null;
  image_url: string | null;
  icon_name: string | null;
  color_class: string;
  gradient_class: string;
  is_active: boolean;
  is_popular: boolean;
  is_base_device: boolean;
  sort_order: number;
  translation?: {
    name: string;
    tagline: string | null;
    description: string | null;
    price_display: string | null;
    features: string[];
    specs: Record<string, string>;
  };
};

export const useProducts = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return useQuery({
    queryKey: ["products", language],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;

      // Fetch translations for current language
      const productIds = products?.map((p) => p.id) || [];
      
      const { data: translations } = await supabase
        .from("product_translations")
        .select("*")
        .in("product_id", productIds)
        .eq("language", language);

      // Merge translations with products
      const productsWithTranslations = products?.map((product) => {
        const translation = translations?.find((t) => t.product_id === product.id);
        return {
          ...product,
          translation: translation
            ? {
                name: translation.name,
                tagline: translation.tagline,
                description: translation.description,
                price_display: translation.price_display,
                features: (translation.features as string[]) || [],
                specs: (translation.specs as Record<string, string>) || {},
              }
            : undefined,
        };
      });

      return productsWithTranslations as Product[];
    },
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_translations(*)")
        .order("sort_order");

      if (error) throw error;
      return data;
    },
  });
};

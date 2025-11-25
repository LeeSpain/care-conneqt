import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export type PricingPlan = {
  id: string;
  slug: string;
  monthly_price: number;
  devices_included: number;
  family_dashboards: number;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  translation?: {
    name: string;
    description: string | null;
    features: string[];
  };
};

export const usePricingPlans = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return useQuery({
    queryKey: ["pricing-plans", language],
    queryFn: async () => {
      const { data: plans, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;

      // Fetch translations for current language
      const planIds = plans?.map((p) => p.id) || [];
      
      const { data: translations } = await supabase
        .from("plan_translations")
        .select("*")
        .in("plan_id", planIds)
        .eq("language", language);

      // Merge translations with plans
      const plansWithTranslations = plans?.map((plan) => {
        const translation = translations?.find((t) => t.plan_id === plan.id);
        return {
          ...plan,
          translation: translation
            ? {
                name: translation.name,
                description: translation.description,
                features: (translation.features as string[]) || [],
              }
            : undefined,
        };
      });

      return plansWithTranslations as PricingPlan[];
    },
  });
};

export const useAllPricingPlans = () => {
  return useQuery({
    queryKey: ["pricing-plans", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*, plan_translations(*)")
        .order("sort_order");

      if (error) throw error;
      return data;
    },
  });
};

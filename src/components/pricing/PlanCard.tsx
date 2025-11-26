import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/intl";
import { useTranslation } from "react-i18next";
import type { PricingPlan } from "@/hooks/usePricingPlans";

interface PlanCardProps {
  plan: PricingPlan;
  isSelected: boolean;
  onSelect: () => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  const { t, i18n } = useTranslation('pricing');
  
  return (
    <Card 
      className={`relative transition-all cursor-pointer ${
        isSelected
          ? 'border-2 border-secondary shadow-xl scale-105'
          : 'border hover:border-secondary/50 hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      {plan.is_popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white">
          {t('planSelection.mostPopular')}
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl font-['Poppins']">
          {plan.translation?.name}
        </CardTitle>
        <CardDescription>{plan.translation?.description}</CardDescription>
        
        <div className="pt-4">
          <span className="text-4xl font-bold text-primary">
            {formatCurrency(plan.monthly_price, 'EUR', i18n.language)}
          </span>
          <span className="text-muted-foreground">{t('planSelection.perMonth')}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {plan.translation?.features && plan.translation.features.length > 0 && (
          <ul className="space-y-3">
            {plan.translation.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        <Button 
          className={`w-full ${
            isSelected
              ? 'bg-secondary hover:bg-secondary/90'
              : 'bg-primary hover:bg-primary/90'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? <Check className="mr-2 h-4 w-4" /> : null}
          {t('planSelection.selectPlan')}
        </Button>
      </CardContent>
    </Card>
  );
};
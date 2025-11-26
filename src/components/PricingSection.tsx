import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/intl";
import { usePricingPlans } from "@/hooks/usePricingPlans";

export const PricingSection = () => {
  const { t, i18n } = useTranslation('home');
  const { data: plans, isLoading } = usePricingPlans();

  if (isLoading) {
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans?.map((plan) => {
            const features = plan.translation?.features || [];
            
            return (
              <Card 
                key={plan.id}
                className={`relative ${
                  plan.is_popular
                    ? 'border-2 border-secondary shadow-xl scale-105' 
                    : 'border hover:border-secondary/50'
                } transition-all duration-300`}
              >
                {plan.is_popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white">
                    Popular
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
                    <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.length > 0 && (
                    <ul className="space-y-3">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button 
                    className={`w-full ${
                      plan.is_popular
                        ? 'bg-secondary hover:bg-secondary/90' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    onClick={() => window.location.href = `/pricing?plan=${plan.id}`}
                  >
                    {t('common:buttons.getStarted')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

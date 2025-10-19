import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/intl";

export const PricingSection = () => {
  const { t, i18n } = useTranslation('home');

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
          {['base', 'independent', 'chronic', 'mental'].map((tier) => (
            <Card 
              key={tier}
              className={`relative ${
                tier === 'independent'
                  ? 'border-2 border-secondary shadow-xl scale-105' 
                  : 'border hover:border-secondary/50'
              } transition-all duration-300`}
            >
              {tier === 'independent' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white">
                  {t(`pricing.tiers.${tier}.popular`)}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-['Poppins']">
                  {t(`pricing.tiers.${tier}.name`)}
                </CardTitle>
                <CardDescription>{t(`pricing.tiers.${tier}.description`)}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-primary">
                    {formatCurrency(parseFloat(t(`pricing.tiers.${tier}.price`)), 'EUR', i18n.language)}
                  </span>
                  <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {(t(`pricing.tiers.${tier}.features`, { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    tier === 'independent'
                      ? 'bg-secondary hover:bg-secondary/90' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {t('common:buttons.getStarted')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t('pricing.addons.title')} <span className="font-semibold text-secondary">{formatCurrency(2.99, 'EUR', i18n.language)}{t('pricing.perMonth')}</span> {t('pricing.addons.subtitle')}
          </p>
          <Button variant="outline" size="lg">
            {t('common:buttons.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

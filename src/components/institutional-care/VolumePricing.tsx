import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Building2, Factory, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const VolumePricing = () => {
  const { t } = useTranslation('institutional-care');
  
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tiers = [
    {
      icon: Building,
      name: t('volumePricing.small.name'),
      range: t('volumePricing.small.range'),
      description: t('volumePricing.small.description'),
      features: t('volumePricing.small.features', { returnObjects: true }) as string[],
      savings: t('volumePricing.small.savings'),
      badge: undefined
    },
    {
      icon: Building2,
      name: t('volumePricing.medium.name'),
      range: t('volumePricing.medium.range'),
      badge: t('volumePricing.medium.badge'),
      description: t('volumePricing.medium.description'),
      features: t('volumePricing.medium.features', { returnObjects: true }) as string[],
      savings: t('volumePricing.medium.savings')
    },
    {
      icon: Factory,
      name: t('volumePricing.large.name'),
      range: t('volumePricing.large.range'),
      description: t('volumePricing.large.description'),
      features: t('volumePricing.large.features', { returnObjects: true }) as string[],
      savings: t('volumePricing.large.savings'),
      badge: undefined
    },
    {
      icon: Network,
      name: t('volumePricing.enterprise.name'),
      range: t('volumePricing.enterprise.range'),
      badge: t('volumePricing.enterprise.badge'),
      description: t('volumePricing.enterprise.description'),
      features: t('volumePricing.enterprise.features', { returnObjects: true }) as string[],
      savings: t('volumePricing.enterprise.savings')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('volumePricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('volumePricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {tiers.map((tier, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <tier.icon className="h-6 w-6 text-secondary" />
                  </div>
                  {tier.badge && (
                    <Badge variant="secondary">{tier.badge}</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-lg font-bold text-primary">{tier.range}</div>
                <CardDescription className="text-base">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{tier.savings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('volumePricing.cta.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('volumePricing.cta.description')}
            </p>
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90"
              onClick={scrollToContact}
            >
              {t('volumePricing.cta.button')}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{t('volumePricing.benefits.noSetup')}</div>
            <div className="text-sm text-muted-foreground">{t('volumePricing.benefits.noSetupDesc')}</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{t('volumePricing.benefits.transparent')}</div>
            <div className="text-sm text-muted-foreground">{t('volumePricing.benefits.transparentDesc')}</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">{t('volumePricing.benefits.flexible')}</div>
            <div className="text-sm text-muted-foreground">{t('volumePricing.benefits.flexibleDesc')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

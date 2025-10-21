import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Rocket, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const ContractFlexibility = () => {
  const { t } = useTranslation('institutional-care');
  
  const options = [
    {
      icon: Rocket,
      title: t('contractFlexibility.pilot.title'),
      duration: t('contractFlexibility.pilot.duration'),
      badge: t('contractFlexibility.pilot.badge'),
      description: t('contractFlexibility.pilot.description'),
      features: t('contractFlexibility.pilot.features', { returnObjects: true }) as string[],
      ideal: t('contractFlexibility.pilot.ideal')
    },
    {
      icon: Calendar,
      title: t('contractFlexibility.standard.title'),
      duration: t('contractFlexibility.standard.duration'),
      badge: t('contractFlexibility.standard.badge'),
      description: t('contractFlexibility.standard.description'),
      features: t('contractFlexibility.standard.features', { returnObjects: true }) as string[],
      ideal: t('contractFlexibility.standard.ideal')
    },
    {
      icon: Users,
      title: t('contractFlexibility.preferred.title'),
      duration: t('contractFlexibility.preferred.duration'),
      badge: t('contractFlexibility.preferred.badge'),
      description: t('contractFlexibility.preferred.description'),
      features: t('contractFlexibility.preferred.features', { returnObjects: true }) as string[],
      ideal: t('contractFlexibility.preferred.ideal')
    },
    {
      icon: TrendingUp,
      title: t('contractFlexibility.enterprise.title'),
      duration: t('contractFlexibility.enterprise.duration'),
      badge: t('contractFlexibility.enterprise.badge'),
      description: t('contractFlexibility.enterprise.description'),
      features: t('contractFlexibility.enterprise.features', { returnObjects: true }) as string[],
      ideal: t('contractFlexibility.enterprise.ideal')
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('contractFlexibility.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('contractFlexibility.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{option.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <div className="text-2xl font-bold text-primary mb-2">{option.duration}</div>
                <CardDescription className="text-base">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2 text-foreground">Includes:</div>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Ideal for:</div>
                  <div className="text-sm text-foreground">{option.ideal}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {t('contractFlexibility.footer')}
          </p>
        </div>
      </div>
    </section>
  );
};

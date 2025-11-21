import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, BarChart3, Puzzle, Headphones, FileCheck, Zap } from 'lucide-react';
import facilityDashboard from '@/assets/facility-dashboard.jpg';
import { useTranslation } from 'react-i18next';

export const EnterpriseFeatures = () => {
  const { t } = useTranslation('institutional-care');
  
  const features = [
    {
      icon: LayoutDashboard,
      title: t('enterpriseFeatures.dashboard.title'),
      description: t('enterpriseFeatures.dashboard.description'),
      highlights: Array.isArray(t('enterpriseFeatures.dashboard.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.dashboard.highlights', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: BarChart3,
      title: t('enterpriseFeatures.analytics.title'),
      description: t('enterpriseFeatures.analytics.description'),
      highlights: Array.isArray(t('enterpriseFeatures.analytics.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.analytics.highlights', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Puzzle,
      title: t('enterpriseFeatures.integration.title'),
      description: t('enterpriseFeatures.integration.description'),
      highlights: Array.isArray(t('enterpriseFeatures.integration.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.integration.highlights', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Headphones,
      title: t('enterpriseFeatures.support.title'),
      description: t('enterpriseFeatures.support.description'),
      highlights: Array.isArray(t('enterpriseFeatures.support.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.support.highlights', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: FileCheck,
      title: t('enterpriseFeatures.sla.title'),
      description: t('enterpriseFeatures.sla.description'),
      highlights: Array.isArray(t('enterpriseFeatures.sla.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.sla.highlights', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Zap,
      title: t('enterpriseFeatures.onboarding.title'),
      description: t('enterpriseFeatures.onboarding.description'),
      highlights: Array.isArray(t('enterpriseFeatures.onboarding.highlights', { returnObjects: true }))
        ? t('enterpriseFeatures.onboarding.highlights', { returnObjects: true }) as string[]
        : []
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('enterpriseFeatures.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('enterpriseFeatures.subtitle')}
          </p>
        </div>

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
          <img 
            src={facilityDashboard} 
            alt="Care Conneqt Facility Dashboard" 
            className="w-full h-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SolutionTypes = () => {
  const { t } = useTranslation('institutional-care');
  
  const solutions = [
    {
      icon: Building2,
      title: t('solutionTypes.careHomes.title'),
      description: t('solutionTypes.careHomes.description'),
      features: Array.isArray(t('solutionTypes.careHomes.features', { returnObjects: true })) 
        ? t('solutionTypes.careHomes.features', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Users,
      title: t('solutionTypes.municipalities.title'),
      description: t('solutionTypes.municipalities.description'),
      features: Array.isArray(t('solutionTypes.municipalities.features', { returnObjects: true }))
        ? t('solutionTypes.municipalities.features', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Shield,
      title: t('solutionTypes.insurers.title'),
      description: t('solutionTypes.insurers.description'),
      features: Array.isArray(t('solutionTypes.insurers.features', { returnObjects: true }))
        ? t('solutionTypes.insurers.features', { returnObjects: true }) as string[]
        : []
    },
    {
      icon: Briefcase,
      title: t('solutionTypes.employers.title'),
      description: t('solutionTypes.employers.description'),
      features: Array.isArray(t('solutionTypes.employers.features', { returnObjects: true }))
        ? t('solutionTypes.employers.features', { returnObjects: true }) as string[]
        : []
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('solutionTypes.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('solutionTypes.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
                <CardDescription className="text-base">{solution.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

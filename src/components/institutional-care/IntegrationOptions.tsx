import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Plug, Database, Globe, Lock, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const IntegrationOptions = () => {
  const { t } = useTranslation('institutional-care');
  
  const integrations = [
    {
      icon: Database,
      title: t('integrationOptions.careManagement.title'),
      description: t('integrationOptions.careManagement.description'),
      examples: t('integrationOptions.careManagement.examples', { returnObjects: true }) as string[]
    },
    {
      icon: Plug,
      title: t('integrationOptions.ehr.title'),
      description: t('integrationOptions.ehr.description'),
      examples: t('integrationOptions.ehr.examples', { returnObjects: true }) as string[]
    },
    {
      icon: Globe,
      title: t('integrationOptions.localAuthority.title'),
      description: t('integrationOptions.localAuthority.description'),
      examples: t('integrationOptions.localAuthority.examples', { returnObjects: true }) as string[]
    },
    {
      icon: Zap,
      title: t('integrationOptions.api.title'),
      description: t('integrationOptions.api.description'),
      examples: t('integrationOptions.api.examples', { returnObjects: true }) as string[]
    }
  ];

  const whiteLabel = [
    {
      icon: Palette,
      title: t('integrationOptions.whiteLabel.branding.title'),
      description: t('integrationOptions.whiteLabel.branding.description'),
      features: t('integrationOptions.whiteLabel.branding.features', { returnObjects: true }) as string[]
    },
    {
      icon: Lock,
      title: t('integrationOptions.whiteLabel.deployment.title'),
      description: t('integrationOptions.whiteLabel.deployment.description'),
      features: t('integrationOptions.whiteLabel.deployment.features', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Integration Options */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('integrationOptions.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('integrationOptions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {integrations.map((integration, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <integration.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{integration.title}</CardTitle>
                  <CardDescription className="text-sm">{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {integration.examples.map((example, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* White Label Options */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('integrationOptions.whiteLabel.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('integrationOptions.whiteLabel.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {whiteLabel.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <option.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-3">{t('integrationOptions.whiteLabel.why.title')}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{t('integrationOptions.whiteLabel.why.insurers')}</p>
                <p>{t('integrationOptions.whiteLabel.why.careGroups')}</p>
                <p>{t('integrationOptions.whiteLabel.why.resellers')}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm font-semibold text-foreground mb-2">{t('integrationOptions.whiteLabel.why.availableFor')}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    {t('integrationOptions.whiteLabel.why.enterprise')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    {t('integrationOptions.whiteLabel.why.insurance')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    {t('integrationOptions.whiteLabel.why.multiSite')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

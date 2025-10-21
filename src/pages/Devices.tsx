import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer, Shield, Zap, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Devices() {
  const { t } = useTranslation(['devices', 'home', 'common']);
  
  const deviceKeys = [
    'vivagoWatch', 'sosPendant', 'vivagoDomi', 'dosellDispenser', 
    'bbrainClock', 'healthMonitors', 'smartScale', 'smartThermometer'
  ];
  
  const deviceIcons = [Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer];
  const deviceColors = [
    'text-secondary', 'text-coral', 'text-primary', 'text-lilac',
    'text-secondary', 'text-coral', 'text-primary', 'text-lilac'
  ];
  const deviceGradients = [
    'from-secondary/10 to-secondary/5', 'from-coral/10 to-coral/5',
    'from-primary/10 to-primary/5', 'from-lilac/10 to-lilac/5',
    'from-secondary/10 to-secondary/5', 'from-coral/10 to-coral/5',
    'from-primary/10 to-primary/5', 'from-lilac/10 to-lilac/5'
  ];
  
  const devices = deviceKeys.map((key, index) => ({
    icon: deviceIcons[index],
    name: t(`devices.${key}.name`),
    tagline: t(`devices.${key}.tagline`),
    description: t(`devices.${key}.description`),
    price: t(`devices.${key}.price`),
    features: t(`devices.${key}.features`, { returnObjects: true }) as string[],
    specs: t(`devices.${key}.specs`, { returnObjects: true }) as Record<string, string>,
    color: deviceColors[index],
    gradient: deviceGradients[index]
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">{t('hero.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
              <span className="block text-primary mt-2">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>{t('hero.features.medicalGrade')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                <span>{t('hero.features.plugPlay')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-secondary" />
                <span>{t('hero.features.support')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Devices Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 max-w-7xl mx-auto">
            {devices.map((device, index) => (
              <Card key={device.name} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-br ${device.gradient} p-8`}>
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-background flex items-center justify-center flex-shrink-0">
                          <device.icon className={`h-8 w-8 ${device.color}`} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{device.name}</h2>
                          <p className={`text-lg font-medium ${device.color}`}>{device.tagline}</p>
                        </div>
                      </div>

                      <p className="text-base text-muted-foreground leading-relaxed">
                        {device.description}
                      </p>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{device.price}</span>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-semibold mb-3">{t('cta.keyFeatures')}</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {device.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Specs */}
                    <div className="lg:pl-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">{t('cta.technicalSpecs')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(device.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start border-b border-border pb-2 last:border-0">
                              <span className="text-sm font-medium text-muted-foreground">{key}:</span>
                              <span className="text-sm font-semibold text-right">{value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <div className="mt-6 space-y-3">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" asChild>
                          <a href="/auth/signup">{t('cta.addToPackage')}</a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="/personal-care">{t('cta.viewPlans')}</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('included.title')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    {t('included.deviceProtection.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {(t('included.deviceProtection.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    {t('included.easySetup.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {(t('included.easySetup.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-secondary" />
                    {t('included.integration.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {(t('included.integration.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-secondary" />
                    {t('included.qualityGuarantee.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {(t('included.qualityGuarantee.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">{t('home:cta.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('home:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/personal-care">{t('common:buttons.learnMore')}</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/auth/signup">{t('common:buttons.getStarted')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

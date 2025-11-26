import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Check, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DeviceCard } from '@/components/devices/DeviceCard';
import { Link } from 'react-router-dom';
import { ClaraWidget } from '@/components/ai-agents/ClaraWidget';
import { useProducts } from '@/hooks/useProducts';
import { getProductImageSync } from '@/lib/productImages';
import { getProductIcon } from '@/lib/productIcons';

export default function Devices() {
  const { t } = useTranslation(['devices', 'home', 'common']);
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading devices...</p>
      </div>
    );
  }

  const devices = products?.map(product => ({
    icon: getProductIcon(product.icon_name),
    image: getProductImageSync(product.slug, product.image_url),
    name: product.translation?.name || product.slug,
    tagline: product.translation?.tagline || '',
    description: product.translation?.description || '',
    price: product.translation?.price_display || `€${product.monthly_price}/mo`,
    features: product.translation?.features || [],
    specs: product.translation?.specs || {},
    color: product.color_class || 'text-primary',
    gradient: product.gradient_class || 'from-primary/10 to-primary/5',
    popular: product.is_popular,
  })) || [];

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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {devices.map((device) => (
              <DeviceCard
                key={device.name}
                name={device.name}
                tagline={device.tagline}
                description={device.description}
                price={device.price}
                features={device.features}
                specs={device.specs}
                image={device.image}
                icon={device.icon}
                color={device.color}
                gradient={device.gradient}
                popular={device.popular}
              />
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
                  {(() => {
                    const items = t('included.deviceProtection.items', { returnObjects: true });
                    const safeItems = Array.isArray(items) ? items : [];
                    return safeItems.map((item: string, idx: number) => (
                      <p key={idx}>• {item}</p>
                    ));
                  })()}
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
                  {(() => {
                    const items = t('included.easySetup.items', { returnObjects: true });
                    const safeItems = Array.isArray(items) ? items : [];
                    return safeItems.map((item: string, idx: number) => (
                      <p key={idx}>• {item}</p>
                    ));
                  })()}
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
                  {(() => {
                    const items = t('included.integration.items', { returnObjects: true });
                    const safeItems = Array.isArray(items) ? items : [];
                    return safeItems.map((item: string, idx: number) => (
                      <p key={idx}>• {item}</p>
                    ));
                  })()}
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
                  {(() => {
                    const items = t('included.qualityGuarantee.items', { returnObjects: true });
                    const safeItems = Array.isArray(items) ? items : [];
                    return safeItems.map((item: string, idx: number) => (
                      <p key={idx}>• {item}</p>
                    ));
                  })()}
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
                  <Link to="/personal-care">{t('common:buttons.learnMore')}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">{t('common:buttons.getStarted')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <ClaraWidget />
    </div>
  );
}

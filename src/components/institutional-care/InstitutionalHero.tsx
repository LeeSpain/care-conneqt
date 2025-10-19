import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Shield, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const InstitutionalHero = () => {
  const { t } = useTranslation('institutional-care');
  
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: TrendingUp, value: '40%', label: 'emergencyReduction' },
    { icon: Shield, value: '100%', label: 'gdprCompliant' },
    { icon: Award, value: '24/7', label: 'support' }
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-lg px-8"
              onClick={scrollToContact}
            >
              {t('hero.getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#solutions">{t('hero.exploreSolutions')}</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-8 w-8 text-secondary mb-2" />
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">
                  {t(`hero.stats.${label}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

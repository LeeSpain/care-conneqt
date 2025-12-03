import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatNumber } from "@/lib/intl";
import heroImage from "@/assets/personal-care-hero.jpg";

export const PersonalCareHero = () => {
  const { t, i18n } = useTranslation('personal-care');

  const benefits = ['agreement', 'noSetup', 'protection'];
  const stats = [
    { key: 'members', value: 10000 },
    { key: 'satisfaction', value: 98, suffix: '%' },
    { key: 'countries', value: 3 }
  ];

  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/5 via-background to-emerald-green/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold font-['Poppins'] text-primary leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap gap-4">
              {benefits.map((benefit, idx) => (
                <div 
                  key={benefit}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    idx === 0 ? 'bg-secondary/10' : idx === 1 ? 'bg-primary/10' : 'bg-coral/10'
                  }`}
                >
                  {idx === 0 ? <Shield className="h-4 w-4 text-secondary" /> : 
                   idx === 1 ? <DollarSign className="h-4 w-4 text-primary" /> : 
                   <Shield className="h-4 w-4 text-coral" />}
                  <span className="text-sm font-medium">
                    {t(`hero.benefits.${benefit}`)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold group"
                asChild
              >
                <Link to="/pricing">
                  {t('hero.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 flex-wrap">
              {stats.map((stat) => (
                <div key={stat.key}>
                  <div className="text-3xl font-bold text-primary">
                    {formatNumber(stat.value, i18n.language)}{stat.suffix || '+'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`hero.stats.${stat.key}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-lilac/20 rounded-3xl transform rotate-3" />
            <img
              src={heroImage}
              alt={t('hero.imageAlt')}
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
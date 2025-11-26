import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-care.jpg";

export const HeroSection = () => {
  const { t } = useTranslation('home');
  
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              <Shield className="h-4 w-4" />
              {t('hero.benefits.agreement')} • {t('hero.benefits.noSetup')}
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold font-['Poppins'] text-primary leading-tight">
              {t('hero.title')}<br />
              <span className="text-secondary">{t('hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-secondary" />
                <span className="text-foreground/80">{t('trust.factors.support.title')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-foreground/80">{t('ai.agents.guardian.name')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-foreground/80">{t('solutions.families.features.dashboard')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold group"
                asChild
              >
                <a href="/pricing">
                  {t('hero.benefits.getStarted', { defaultValue: 'Get Started' })}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                asChild
              >
                <a href="/institutional-care">{t('common:nav.forInstitutions')}</a>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">{t('hero.activeMembers')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">{t('hero.satisfaction')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">{t('hero.countries')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-3" />
            <img
              src={heroImage}
              alt={t('trust.enterprise.imageAlt')}
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

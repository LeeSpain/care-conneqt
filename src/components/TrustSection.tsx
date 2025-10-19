import { Shield, Globe, Lock, Award, Phone, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/lib/intl";
import facilityImage from "@/assets/facility-dashboard.jpg";

export const TrustSection = () => {
  const { t, i18n } = useTranslation('home');
  
  const factorIcons = {
    compliant: Shield,
    multiCountry: Globe,
    encrypted: Lock,
    medical: Award,
    support: Phone,
    nurseLed: Users
  };

  const factors = ['compliant', 'multiCountry', 'encrypted', 'medical', 'support', 'nurseLed'];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('trust.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('trust.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {factors.map((factor) => {
              const Icon = factorIcons[factor as keyof typeof factorIcons];
              return (
                <div 
                  key={factor}
                  className="p-6 rounded-xl bg-background border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <Icon className="h-8 w-8 text-secondary mb-3" />
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {t(`trust.factors.${factor}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`trust.factors.${factor}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={facilityImage}
                alt={t('trust.enterprise.imageAlt')}
                className="w-full"
              />
            </div>
            <div className="p-6 rounded-xl bg-background border-2 border-primary/20">
              <h3 className="text-xl font-semibold text-primary mb-3">
                {t('trust.enterprise.title')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('trust.enterprise.description')}
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {formatNumber(500, i18n.language)}+
                  </div>
                  <div className="text-muted-foreground">
                    {t('trust.enterprise.stats.facilities')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {formatNumber(50000, i18n.language)}+
                  </div>
                  <div className="text-muted-foreground">
                    {t('trust.enterprise.stats.residents')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">99.9%</div>
                  <div className="text-muted-foreground">
                    {t('trust.enterprise.stats.uptime')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

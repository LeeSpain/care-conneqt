import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PricingWizard } from "@/components/pricing/PricingWizard";
import { useTranslation } from "react-i18next";
import { Shield, Users, Heart } from "lucide-react";

const Pricing = () => {
  const { t } = useTranslation('pricing');

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              <span>Secure & GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              <span>{t('hero.trustBadge')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Wizard */}
      <PricingWizard />

      <Footer />
    </div>
  );
};

export default Pricing;
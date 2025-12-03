import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PricingWizard } from "@/components/pricing/PricingWizard";
import { useTranslation } from "react-i18next";
import { Shield, Users, Heart, Package, Puzzle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PricingType = 'subscription' | 'pickAndMix';

const Pricing = () => {
  const { t } = useTranslation('pricing');
  const [pricingType, setPricingType] = useState<PricingType>('subscription');

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
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

      {/* Pricing Type Selector */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
            {t('pricingType.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Subscription Option */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                pricingType === 'subscription' 
                  ? "border-2 border-secondary shadow-lg scale-[1.02]" 
                  : "border hover:border-secondary/50"
              )}
              onClick={() => setPricingType('subscription')}
            >
              <Badge className="absolute -top-3 left-4 bg-secondary text-secondary-foreground">
                {t('pricingType.subscription.badge')}
              </Badge>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Package className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {t('pricingType.subscription.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('pricingType.subscription.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pick & Mix Option */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                pricingType === 'pickAndMix' 
                  ? "border-2 border-primary shadow-lg scale-[1.02]" 
                  : "border hover:border-primary/50"
              )}
              onClick={() => setPricingType('pickAndMix')}
            >
              <Badge className="absolute -top-3 left-4 bg-primary text-primary-foreground">
                {t('pricingType.pickAndMix.badge')}
              </Badge>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Puzzle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {t('pricingType.pickAndMix.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('pricingType.pickAndMix.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditional Content */}
      {pricingType === 'subscription' ? (
        <PricingWizard />
      ) : (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                <Puzzle className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('pricingType.pickAndMix.title')}
              </h2>
              <Badge variant="outline" className="mb-4">
                {t('pricingType.pickAndMix.comingSoon')}
              </Badge>
              <p className="text-muted-foreground">
                {t('pricingType.pickAndMix.description')}
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Pricing;
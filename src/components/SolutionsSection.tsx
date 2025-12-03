import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Heart, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const SolutionsSection = () => {
  const { t } = useTranslation('home');
  
  return (
    <section id="solutions" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('solutions.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('solutions.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* B2C Card */}
          <Card className="relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-bl-full" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-['Poppins']">{t('solutions.families.title')}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {t('solutions.families.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('solutions.families.tagline')}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-coral mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.families.features.aiTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.families.features.ai')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.families.features.nursesTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.families.features.nurses')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-lilac mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.families.features.dashboardTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.families.features.dashboard')}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">€49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <Button className="w-full bg-secondary hover:bg-secondary/90 group" asChild>
                <Link to="/personal-care">
                  {t('solutions.families.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-['Poppins']">{t('solutions.institutions.title')}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {t('solutions.institutions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('solutions.institutions.tagline')}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.institutions.features.facilityTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.institutions.features.facilityDesc')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.institutions.features.complianceTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.institutions.features.compliance')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-lilac mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{t('solutions.institutions.features.whiteLabel')}</div>
                    <div className="text-sm text-muted-foreground">{t('solutions.institutions.features.whiteLabelDesc')}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <div className="text-lg font-semibold text-primary">{t('solutions.institutions.pricingTitle')}</div>
                <div className="text-sm text-muted-foreground">{t('solutions.institutions.pricingDesc')}</div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 group" asChild>
                <Link to="/institutional-care">
                  {t('solutions.institutions.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
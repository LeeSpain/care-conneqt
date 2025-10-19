import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FinalCTA = () => {
  const { t } = useTranslation('personal-care');
  const handleScrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-calculator');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep-blue via-primary to-secondary p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-green/20 rounded-full blur-3xl" />
            
            <div className="relative text-center space-y-8">
              <h2 className="text-4xl font-bold font-['Poppins']">
                {t('finalCTA.title')}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t('howItWorks.step1.title')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('howItWorks.step1.description')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t('howItWorks.step2.title')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('howItWorks.step2.description')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t('howItWorks.step3.title')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('howItWorks.step3.description')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold group"
                  onClick={handleScrollToPricing}
                >
                  {t('finalCTA.button')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t('common:buttons.bookDemo')}
                </Button>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  {t('guarantee.agreement')}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  {t('guarantee.noSetup')}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  {t('guarantee.protection')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

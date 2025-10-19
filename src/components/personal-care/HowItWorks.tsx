import { Card, CardContent } from "@/components/ui/card";
import { Package, Brain, HeartPulse } from "lucide-react";
import { useTranslation } from "react-i18next";

export const HowItWorks = () => {
  const { t } = useTranslation('personal-care');
  
  const stepIcons = [Package, Brain, HeartPulse];
  const stepColors = ["primary", "secondary", "coral"];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((step, idx) => {
            const Icon = stepIcons[idx];
            const color = stepColors[idx];
            
            return (
              <div key={step} className="relative">
                <Card className="h-full border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
                  <CardContent className="pt-6 text-center">
                    <div className={`inline-flex p-4 rounded-full bg-${color}/10 mb-6`}>
                      <Icon className={`h-10 w-10 text-${color}`} />
                    </div>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color} text-white font-bold text-xl mb-4`}>
                      {step}
                    </div>
                    <h3 className="text-2xl font-bold font-['Poppins'] mb-4">
                      {t(`howItWorks.step${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`howItWorks.step${step}.description`)}
                    </p>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-secondary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

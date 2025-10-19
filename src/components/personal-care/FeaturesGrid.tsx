import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Activity, HeartPulse, Users, Phone, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturesGrid = () => {
  const { t } = useTranslation('personal-care');
  
  const featureIcons = {
    aiGuardian: MessageCircle,
    devices: Activity,
    nurseSupport: HeartPulse,
    familyDashboard: Users,
    emergency: Phone,
    peaceOfMind: Shield
  };

  const featureColors = {
    aiGuardian: "secondary",
    devices: "primary",
    nurseSupport: "coral",
    familyDashboard: "lilac",
    emergency: "secondary",
    peaceOfMind: "primary"
  };

  const features = Object.keys(featureIcons);

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = featureIcons[feature as keyof typeof featureIcons];
            const color = featureColors[feature as keyof typeof featureColors];
            
            return (
              <Card key={feature} className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className={`inline-flex p-3 rounded-lg bg-${color}/10 mb-4`}>
                    <Icon className={`h-8 w-8 text-${color}`} />
                  </div>
                  <h3 className="text-xl font-bold font-['Poppins'] mb-3">
                    {t(`features.items.${feature}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`features.items.${feature}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/intl";

export const DevicesSection = () => {
  const { t, i18n } = useTranslation('home');
  
  const deviceIcons = {
    watch: Watch,
    pendant: Radio,
    domi: Home,
    dispenser: Pill,
    calendar: Calendar,
    monitors: Activity,
    scale: Scale,
    thermometer: Thermometer
  };

  const deviceColors = {
    watch: "text-secondary",
    pendant: "text-coral",
    domi: "text-primary",
    dispenser: "text-lilac",
    calendar: "text-secondary",
    monitors: "text-coral",
    scale: "text-primary",
    thermometer: "text-lilac"
  };

  const devices = ['watch', 'pendant', 'domi', 'dispenser', 'calendar', 'monitors', 'scale', 'thermometer'];

  return (
    <section id="devices" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('devices.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('devices.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {devices.map((deviceKey) => {
            const Icon = deviceIcons[deviceKey as keyof typeof deviceIcons];
            return (
              <Card key={deviceKey} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/50">
                <CardHeader>
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-background to-muted w-fit mb-3`}>
                    <Icon className={`h-8 w-8 ${deviceColors[deviceKey as keyof typeof deviceColors]}`} />
                  </div>
                  <CardTitle className="text-lg font-['Poppins']">
                    {t(`devices.items.${deviceKey}.name`)}
                  </CardTitle>
                  <CardDescription className="min-h-[48px]">
                    {t(`devices.items.${deviceKey}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-base font-semibold text-primary">
                    {t(`devices.items.${deviceKey}.price`)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong>{t('devices.allInclude')}</strong> {t('devices.includeDetails')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('devices.quality')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/intl";

// Import device images
import vivagoWatchImg from '@/assets/devices/vivago-watch.jpg';
import sosPendantImg from '@/assets/devices/sos-pendant.jpg';
import vivagoDomiImg from '@/assets/devices/vivago-domi.jpg';
import dosellDispenserImg from '@/assets/devices/dosell-dispenser.jpg';
import calendarClockImg from '@/assets/devices/calendar-clock.jpg';
import healthMonitorsImg from '@/assets/devices/health-monitors.jpg';
import smartScaleImg from '@/assets/devices/smart-scale.jpg';
import smartThermometerImg from '@/assets/devices/smart-thermometer.jpg';

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

  const deviceGradients = {
    watch: "from-secondary/10 to-secondary/5",
    pendant: "from-coral/10 to-coral/5",
    domi: "from-primary/10 to-primary/5",
    dispenser: "from-lilac/10 to-lilac/5",
    calendar: "from-secondary/10 to-secondary/5",
    monitors: "from-coral/10 to-coral/5",
    scale: "from-primary/10 to-primary/5",
    thermometer: "from-lilac/10 to-lilac/5"
  };

  const deviceImages = {
    watch: vivagoWatchImg,
    pendant: sosPendantImg,
    domi: vivagoDomiImg,
    dispenser: dosellDispenserImg,
    calendar: calendarClockImg,
    monitors: healthMonitorsImg,
    scale: smartScaleImg,
    thermometer: smartThermometerImg
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
            const image = deviceImages[deviceKey as keyof typeof deviceImages];
            const gradient = deviceGradients[deviceKey as keyof typeof deviceGradients];
            return (
              <Card key={deviceKey} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-secondary/50">
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                  <img 
                    src={image} 
                    alt={t(`devices.items.${deviceKey}.name`)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Care Connect Badge */}
                  <div className="absolute bottom-2 right-2 bg-background/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-primary/20 shadow-lg">
                    <span className="text-[10px] font-semibold text-primary">Care Connect</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} w-fit`}>
                      <Icon className={`h-5 w-5 ${deviceColors[deviceKey as keyof typeof deviceColors]}`} />
                    </div>
                    <CardTitle className="text-base font-['Poppins'] leading-tight flex-1">
                      {t(`devices.items.${deviceKey}.name`)}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs min-h-[36px] leading-snug">
                    {t(`devices.items.${deviceKey}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary">
                      {t(`devices.items.${deviceKey}.price`)}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs hover:text-secondary"
                      asChild
                    >
                      <a href="/devices">Details →</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-primary">{t('devices.allInclude')}</strong> {t('devices.includeDetails')}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {t('devices.quality')}
              </p>
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90"
                asChild
              >
                <a href="/devices">Explore All Devices</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

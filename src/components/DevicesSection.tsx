import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Radio, Home, Pill, Calendar, Activity, Scale, Thermometer } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DevicesSection = () => {
  const { t } = useTranslation('home');
  
  const devices = [
    {
      icon: Watch,
      name: "Vivago Smart Watch",
      description: "24/7 activity and wellness monitoring with fall detection",
      price: "Included in Base / +€19.99",
      color: "text-secondary"
    },
    {
      icon: Radio,
      name: "SOS Pendant",
      description: "One-touch emergency alert system with GPS",
      price: "Alternative Base / +€19.99",
      color: "text-coral"
    },
    {
      icon: Home,
      name: "Vivago Domi",
      description: "Home movement and safety sensors",
      price: "+€29.99/month",
      color: "text-primary"
    },
    {
      icon: Pill,
      name: "Dosell Smart Dispenser",
      description: "Automated medication reminders and tracking",
      price: "+€34.99/month",
      color: "text-lilac"
    },
    {
      icon: Calendar,
      name: "BBrain Calendar Clock",
      description: "Memory support with visual reminders",
      price: "+€19.99/month",
      color: "text-secondary"
    },
    {
      icon: Activity,
      name: "Health Monitors",
      description: "Blood pressure, glucose, and vital signs tracking",
      price: "+€14.99/month each",
      color: "text-coral"
    },
    {
      icon: Scale,
      name: "Smart Weight Scale",
      description: "Body composition tracking with automatic sync",
      price: "+€14.99/month",
      color: "text-primary"
    },
    {
      icon: Thermometer,
      name: "Smart Thermometer",
      description: "Contactless temperature monitoring",
      price: "+€14.99/month",
      color: "text-lilac"
    }
  ];

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
          {devices.map((device) => (
            <Card key={device.name} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/50">
              <CardHeader>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-background to-muted w-fit mb-3`}>
                  <device.icon className={`h-8 w-8 ${device.color}`} />
                </div>
                <CardTitle className="text-lg font-['Poppins']">{device.name}</CardTitle>
                <CardDescription className="min-h-[48px]">{device.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-base font-semibold text-primary">{device.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong>All devices include:</strong> 12-month lease, free shipping, setup support, 24/7 technical assistance, 
                automatic replacement, and seamless integration with your AI Guardian and nurse dashboard.
              </p>
              <p className="text-sm text-muted-foreground">
                Medical-grade quality • GDPR compliant • No purchase required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

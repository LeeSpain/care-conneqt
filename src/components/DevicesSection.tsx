import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Radio, Home, Pill, Calendar, Activity } from "lucide-react";

export const DevicesSection = () => {
  const devices = [
    {
      icon: Watch,
      name: "Vivago Watch",
      description: "24/7 activity and wellness monitoring",
      price: "Included in Base / +€19.99",
      color: "text-secondary"
    },
    {
      icon: Radio,
      name: "SOS Pendant",
      description: "One-touch emergency alert system",
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
      description: "Automated medication reminders",
      price: "+€34.99/month",
      color: "text-lilac"
    },
    {
      icon: Calendar,
      name: "BBrain Calendar Clock",
      description: "Memory support with reminders",
      price: "+€19.99/month",
      color: "text-secondary"
    },
    {
      icon: Activity,
      name: "Health Monitors",
      description: "Glucose, BP, scale, thermometer",
      price: "+€14.99/month each",
      color: "text-coral"
    }
  ];

  return (
    <section id="devices" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Connected Device Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Medical-grade devices that seamlessly integrate with our AI-powered platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {devices.map((device) => (
            <Card key={device.name} className="hover:shadow-lg transition-shadow duration-300 border hover:border-secondary/50">
              <CardHeader>
                <div className={`p-3 rounded-lg bg-gradient-to-br from-background to-muted w-fit mb-3`}>
                  <device.icon className={`h-8 w-8 ${device.color}`} />
                </div>
                <CardTitle className="text-xl font-['Poppins']">{device.name}</CardTitle>
                <CardDescription>{device.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-primary">{device.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All devices include 12-month lease, setup support, and integration with your AI Guardian
          </p>
        </div>
      </div>
    </section>
  );
};

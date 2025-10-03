import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Activity, HeartPulse, Users, Phone, Shield } from "lucide-react";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Guardian",
      description: "24/7 multilingual companion (EN/ES/NL) for daily check-ins, medication reminders, and proactive health monitoring",
      color: "secondary"
    },
    {
      icon: Activity,
      title: "Health Monitoring Devices",
      description: "Vivago watches, BBrain sleep monitors, medication dispensers, and vital sign trackers that sync automatically",
      color: "primary"
    },
    {
      icon: HeartPulse,
      title: "24/7 Nurse Support",
      description: "Emergency call center + scheduled check-ins (monthly, weekly, or daily depending on your plan)",
      color: "coral"
    },
    {
      icon: Users,
      title: "Family Dashboard",
      description: "Real-time updates, activity reports, and instant alerts shared with designated family members and carers",
      color: "lilac"
    },
    {
      icon: Phone,
      title: "Emergency Response",
      description: "Priority escalation protocols with GPS tracking, fall detection, and direct nurse communication",
      color: "secondary"
    },
    {
      icon: Shield,
      title: "Peace of Mind",
      description: "GDPR compliant, medical-grade devices, encrypted data, and nurse-led care you can trust",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Everything You Need for Independent Living
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive care features designed to keep seniors safe, healthy, and connected
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className={`inline-flex p-3 rounded-lg bg-${feature.color}/10 mb-4`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold font-['Poppins'] mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

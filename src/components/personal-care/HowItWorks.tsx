import { Card, CardContent } from "@/components/ui/card";
import { Package, Brain, HeartPulse } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Package,
      step: "1",
      title: "Choose Your Devices",
      description: "Select from smart watches, SOS pendants, medication dispensers, and health monitors. Devices arrive pre-configured and ready to use in 3-5 days.",
      color: "primary"
    },
    {
      icon: Brain,
      step: "2",
      title: "AI Guardian Learns Your Routine",
      description: "Our multilingual AI companion (English, Spanish, Dutch) monitors activity patterns 24/7, provides daily check-ins, and alerts nurses to any concerning changes.",
      color: "secondary"
    },
    {
      icon: HeartPulse,
      step: "3",
      title: "Nurses Respond When Needed",
      description: "When alerts trigger or emergencies occur, our 24/7 nurse-led call center responds immediately. Family dashboards keep everyone informed in real-time.",
      color: "coral"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <Card className="h-full border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-${step.color}/10 mb-6`}>
                    <step.icon className={`h-10 w-10 text-${step.color}`} />
                  </div>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${step.color} text-white font-bold text-xl mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold font-['Poppins'] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Activity, Home } from "lucide-react";

export const WhoItsFor = () => {
  const personas = [
    {
      icon: Users,
      title: "Aging Parents Living Alone",
      age: "65-85 years",
      description: "Seniors who want to maintain independence while giving their adult children peace of mind. Perfect for those living far from family or in isolated locations.",
      benefits: ["Daily AI check-ins", "Fall detection", "Family dashboard access"]
    },
    {
      icon: Heart,
      title: "Chronic Disease Management",
      conditions: "Diabetes, COPD, Heart Conditions",
      description: "Patients requiring regular monitoring of vital signs, medication adherence, and quick access to nursing support for symptom management.",
      benefits: ["Vital sign tracking", "Medication reminders", "Daily nurse monitoring"]
    },
    {
      icon: Activity,
      title: "Post-Surgery Recovery",
      needs: "Temporary monitoring",
      description: "Patients recovering from surgery who need short-term monitoring and support during the critical recovery period at home instead of extended hospital stays.",
      benefits: ["24/7 emergency access", "Activity monitoring", "Weekly check-ins"]
    },
    {
      icon: Home,
      title: "Family Peace of Mind",
      concern: "Adult children living far away",
      description: "Families who worry about elderly parents but can't provide in-person care daily. Stay connected with real-time updates and instant alerts.",
      benefits: ["Real-time dashboard", "Instant alerts", "Care coordination"]
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Who Is Care Conneqt For?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our care solutions serve diverse needs and life situations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {personas.map((persona, idx) => (
            <Card key={idx} className="border-2 hover:border-secondary/50 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10 flex-shrink-0">
                    <persona.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-['Poppins'] mb-2">
                      {persona.title}
                    </h3>
                    <div className="text-sm text-muted-foreground font-semibold mb-3">
                      {'age' in persona && persona.age}
                      {'conditions' in persona && persona.conditions}
                      {'needs' in persona && persona.needs}
                      {'concern' in persona && persona.concern}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {persona.description}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-secondary mb-2">Key Benefits:</div>
                  {persona.benefits.map((benefit, bidx) => (
                    <div key={bidx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

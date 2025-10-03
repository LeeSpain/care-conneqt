import { Card, CardContent } from "@/components/ui/card";
import { Shield, DollarSign, X, CheckCircle } from "lucide-react";

export const GuaranteeSection = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "30-Day Money-Back Guarantee",
      description: "Try Care Conneqt completely risk-free. If you're not satisfied within 30 days, we'll refund 100% of your first month. No questions asked.",
      color: "secondary"
    },
    {
      icon: DollarSign,
      title: "No Setup Fees",
      description: "All devices are shipped pre-configured and ready to use. No installation charges, no activation fees, no hidden costs. What you see is what you pay.",
      color: "primary"
    },
    {
      icon: X,
      title: "Cancel Anytime",
      description: "No long-term contracts. No cancellation fees. Month-to-month billing means you're in control. Stop whenever you want with zero penalties.",
      color: "coral"
    },
    {
      icon: CheckCircle,
      title: "Service Level Guarantee",
      description: "We guarantee 99.9% uptime for our AI Guardian and nurse monitoring systems. If we fall short, you'll receive service credits automatically.",
      color: "lilac"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Our Commitment to You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We stand behind our service with guarantees that protect your investment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {guarantees.map((guarantee, idx) => (
            <Card key={idx} className="border-2 hover:border-secondary/50 transition-all">
              <CardContent className="pt-6">
                <div className={`inline-flex p-4 rounded-full bg-${guarantee.color}/10 mb-4`}>
                  <guarantee.icon className={`h-8 w-8 text-${guarantee.color}`} />
                </div>
                <h3 className="text-2xl font-bold font-['Poppins'] mb-3">
                  {guarantee.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/10">
            <Shield className="h-5 w-5 text-secondary" />
            <span className="font-semibold">
              GDPR Compliant • ISO 27001 Certified • Medical-Grade Devices
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

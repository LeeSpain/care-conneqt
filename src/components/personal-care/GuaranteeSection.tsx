import { Shield, DollarSign, X, CheckCircle } from "lucide-react";

export const GuaranteeSection = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "24-Month Agreement",
      description: "Best value pricing on devices",
      color: "secondary"
    },
    {
      icon: DollarSign,
      title: "No Setup Fees",
      description: "Devices pre-configured and ready",
      color: "primary"
    },
    {
      icon: Shield,
      title: "Device Protection",
      description: "Full coverage included in plan",
      color: "coral"
    },
    {
      icon: CheckCircle,
      title: "99.9% Uptime",
      description: "Service credits if we fall short",
      color: "lilac"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Poppins'] text-primary mb-3">
              Our Commitment to You
            </h2>
            <p className="text-base text-muted-foreground">
              Transparent pricing. Risk-free guarantee. Your peace of mind.
            </p>
          </div>

          {/* Guarantees Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {guarantees.map((guarantee, idx) => (
              <div 
                key={idx}
                className="text-center space-y-3 p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-secondary/30 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-full bg-${guarantee.color}/10 group-hover:scale-110 transition-transform`}>
                  <guarantee.icon className={`h-6 w-6 text-${guarantee.color}`} />
                </div>
                <h3 className="font-bold text-base">
                  {guarantee.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <Shield className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">
                GDPR Compliant • ISO 27001 • Medical-Grade
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

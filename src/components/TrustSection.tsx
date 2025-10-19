import { Shield, Globe, Lock, Award, Phone, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import facilityImage from "@/assets/facility-dashboard.jpg";

export const TrustSection = () => {
  const { t } = useTranslation('home');
  
  const trustFactors = [
    {
      icon: Shield,
      title: t('trust.compliant'),
      description: "Full EU data protection compliance"
    },
    {
      icon: Globe,
      title: "Multi-Country",
      description: t('footer.operating')
    },
    {
      icon: Lock,
      title: t('trust.encrypted'),
      description: "EU-based encrypted infrastructure"
    },
    {
      icon: Award,
      title: t('trust.medical'),
      description: "CE certified devices and protocols"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Always-on emergency response"
    },
    {
      icon: Users,
      title: "Nurse-Led Care",
      description: "Qualified healthcare professionals"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('trust.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security and healthcare compliance you can rely on
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {trustFactors.map((factor) => (
              <div 
                key={factor.title}
                className="p-6 rounded-xl bg-background border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg"
              >
                <factor.icon className="h-8 w-8 text-secondary mb-3" />
                <h3 className="text-lg font-semibold text-primary mb-2">{factor.title}</h3>
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={facilityImage}
                alt="Care Conneqt facility dashboard monitoring"
                className="w-full"
              />
            </div>
            <div className="p-6 rounded-xl bg-background border-2 border-primary/20">
              <h3 className="text-xl font-semibold text-primary mb-3">Enterprise Ready</h3>
              <p className="text-muted-foreground mb-4">
                Our platform is trusted by care facilities, insurers, and municipalities 
                across Europe. With white-label options, dedicated account management, 
                and comprehensive API integrations, we scale with your organization.
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-muted-foreground">Facilities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">50k+</div>
                  <div className="text-muted-foreground">Residents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">99.9%</div>
                  <div className="text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

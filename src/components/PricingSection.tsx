import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PricingSection = () => {
  const packages = [
    {
      name: "Base Membership",
      price: "49.99",
      description: "Essential care for independent living",
      features: [
        "1 Device (Vivago Watch or SOS Pendant)",
        "AI Guardian (EN/ES/NL)",
        "Member Dashboard",
        "Monthly Nurse Check-in",
        "24/7 Emergency Call Center",
        "Clinical notes & family notifications"
      ],
      popular: false
    },
    {
      name: "Independent Living",
      price: "69.99",
      description: "Enhanced monitoring and emergency response",
      features: [
        "Everything in Base Membership",
        "2 Devices included",
        "Weekly Nurse Check-ins",
        "Priority Emergency Response",
        "Advanced Activity Monitoring",
        "Family Dashboard (2 users)"
      ],
      popular: true
    },
    {
      name: "Chronic Disease Mgmt",
      price: "119.99",
      description: "Comprehensive health monitoring",
      features: [
        "Everything in Independent Living",
        "4 Devices (health monitoring suite)",
        "Daily Nurse Monitoring",
        "Medication Management",
        "Vital Signs Tracking",
        "Care Coordinator",
        "Unlimited Family Dashboards"
      ],
      popular: false
    },
    {
      name: "Mental Health & Wellness",
      price: "159.99",
      description: "Complete support with therapy access",
      features: [
        "Everything in Chronic Disease Mgmt",
        "Weekly Therapy Sessions",
        "Mental Health Specialist",
        "Social Wellness Activities",
        "Mood & Anxiety Tracking",
        "Crisis Intervention Support",
        "Caregiver Support Programs"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Flexible Pricing Plans
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the right level of care for your needs. All plans include multilingual support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.name}
              className={`relative ${
                pkg.popular 
                  ? 'border-2 border-secondary shadow-xl scale-105' 
                  : 'border hover:border-secondary/50'
              } transition-all duration-300`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-['Poppins']">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-primary">€{pkg.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    pkg.popular 
                      ? 'bg-secondary hover:bg-secondary/90' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Add Family/Carer Dashboards for just <span className="font-semibold text-secondary">€2.99/month</span> per user
          </p>
          <Button variant="outline" size="lg">
            View All Add-ons & Devices
          </Button>
        </div>
      </div>
    </section>
  );
};

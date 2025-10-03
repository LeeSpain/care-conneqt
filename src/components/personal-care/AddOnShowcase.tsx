import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Watch, Bell, Pill, Moon, Heart, Droplet, Users } from "lucide-react";
import { addOns } from "@/data/pricing";

const iconMap: Record<string, any> = {
  'family-dashboard': Users,
  'vivago-watch': Watch,
  'sos-pendant': Bell,
  'medication-dispenser': Pill,
  'bbrain-monitor': Moon,
  'blood-pressure': Heart,
  'glucose-monitor': Droplet,
};

export const AddOnShowcase = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Available Add-Ons & Devices
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your package with additional devices and services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {addOns.map((addon) => {
            const Icon = iconMap[addon.id] || Plus;
            return (
              <Card key={addon.id} className="border-2 hover:border-secondary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-lg bg-secondary/10 mb-4">
                    <Icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold font-['Poppins'] mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                    {addon.description}
                  </p>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">€{addon.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-secondary text-secondary hover:bg-secondary/10"
                    onClick={() => {
                      const calculatorSection = document.getElementById('pricing-calculator');
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Package
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            All devices include free shipping, setup support, and 24/7 technical assistance
          </p>
          <p className="text-sm text-muted-foreground">
            Device lease, maintenance, and replacement included • No purchase required
          </p>
        </div>
      </div>
    </section>
  );
};

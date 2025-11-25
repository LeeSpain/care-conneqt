import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Watch, Bell, Home, Pill, Calendar, Heart, Droplet, Scale, Thermometer, Users } from "lucide-react";
import { addOns } from "@/data/pricing";

const iconMap: Record<string, any> = {
  'family-dashboard': Users,
  'vivago-watch': Watch,
  'sos-pendant': Bell,
  'vivago-domi': Home,
  'medication-dispenser': Pill,
  'bbrain-calendar': Calendar,
  'blood-pressure': Heart,
  'glucose-monitor': Droplet,
  'weight-scale': Scale,
  'thermometer': Thermometer,
};

export const AddOnShowcase = () => {
  // Separate devices by category
  const services = addOns.filter(addon => addon.category === 'service');
  const devices = addOns.filter(addon => addon.category === 'device');

  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('pricing-calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Complete Device Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Medical-grade devices and services to customize your care package
          </p>
        </div>

        {/* Services Section */}
        {services.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-6 text-center">Additional Services</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {services.map((addon) => {
                const Icon = iconMap[addon.id] || Plus;
                return (
                  <Card key={addon.id} className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg">
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
                        <div>
                          <span className="text-2xl font-bold text-primary">€{addon.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-secondary text-secondary hover:bg-secondary/10"
                        onClick={scrollToCalculator}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Package
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Devices Section */}
        <div>
          <h3 className="text-2xl font-bold font-['Poppins'] mb-6 text-center">Connected Health Devices</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {devices.map((addon) => {
              const Icon = iconMap[addon.id] || Plus;
              const isPopular = ['vivago-watch', 'sos-pendant', 'medication-dispenser'].includes(addon.id);
              
              return (
                <Card key={addon.id} className={`border-2 hover:border-secondary/50 transition-all hover:shadow-lg relative ${isPopular ? 'border-secondary/30' : ''}`}>
                  {isPopular && (
                    <Badge className="absolute -top-2 -right-2 bg-secondary">Popular</Badge>
                  )}
                  <CardContent className="pt-6">
                    <div className="inline-flex p-3 rounded-lg bg-secondary/10 mb-4">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-base font-bold font-['Poppins'] mb-2 min-h-[40px]">
                      {addon.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 min-h-[60px] leading-relaxed">
                      {addon.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">€{addon.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Device lease included
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-secondary text-secondary hover:bg-secondary/10"
                      onClick={scrollToCalculator}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-bold mb-4">All Devices Include:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">24-Month Lease</div>
                    <div className="text-muted-foreground">No purchase required</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">Free Shipping & Setup</div>
                    <div className="text-muted-foreground">Pre-configured devices</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">24/7 Tech Support</div>
                    <div className="text-muted-foreground">Remote assistance</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">Automatic Replacement</div>
                    <div className="text-muted-foreground">If device fails</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">AI Integration</div>
                    <div className="text-muted-foreground">Syncs with Guardian</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-1.5" />
                  <div className="text-left">
                    <div className="font-semibold">Maintenance Included</div>
                    <div className="text-muted-foreground">Regular updates</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

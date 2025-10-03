import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Building2, Factory, Network } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const VolumePricing = () => {
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tiers = [
    {
      icon: Building,
      name: 'Small Facilities',
      range: '5-25 Residents',
      description: 'Perfect for boutique care homes and small residential facilities',
      features: [
        'Full platform access',
        'Standard device allocation',
        'Email & phone support',
        'Monthly reporting',
        'Pilot program eligible'
      ],
      savings: 'Volume discounts available'
    },
    {
      icon: Building2,
      name: 'Medium Facilities',
      range: '26-100 Residents',
      badge: 'Popular',
      description: 'Ideal for established care homes and multi-unit facilities',
      features: [
        'Everything in Small +',
        'Priority support access',
        'Bi-weekly business reviews',
        'Custom reporting',
        'Staff training included',
        'API access available'
      ],
      savings: 'Significant per-resident savings'
    },
    {
      icon: Factory,
      name: 'Large Facilities',
      range: '100-500 Residents',
      description: 'For large care organizations and municipal programs',
      features: [
        'Everything in Medium +',
        'Dedicated account manager',
        'Weekly performance reviews',
        'Advanced analytics',
        'White-label options',
        'Custom integrations',
        'SLA guarantees'
      ],
      savings: 'Maximum volume discounts'
    },
    {
      icon: Network,
      name: 'Enterprise',
      range: '500+ or Multi-Site',
      badge: 'Best Value',
      description: 'Multi-location operators and enterprise organizations',
      features: [
        'Everything in Large +',
        'Strategic partnership',
        'Custom feature development',
        'Executive account team',
        'Multi-site management tools',
        'Flexible deployment models',
        'Enterprise SLAs',
        'Preferred pricing structure'
      ],
      savings: 'Custom enterprise pricing'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Volume-Based Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pricing that scales with your organization. The more residents or employees you cover, 
            the better your per-unit economics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {tiers.map((tier, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <tier.icon className="h-6 w-6 text-secondary" />
                  </div>
                  {tier.badge && (
                    <Badge variant="secondary">{tier.badge}</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-lg font-bold text-primary">{tier.range}</div>
                <CardDescription className="text-base">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{tier.savings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Discuss Your Needs?</h3>
            <p className="text-muted-foreground mb-6">
              Every organization is unique. We'll work with you to create a custom quote based on your 
              specific requirements, resident count, contract term, and integration needs.
            </p>
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90"
              onClick={scrollToContact}
            >
              Request Custom Quote
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">No Setup Fees</div>
            <div className="text-sm text-muted-foreground">Implementation and training included</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">Transparent</div>
            <div className="text-sm text-muted-foreground">No hidden costs or surprise charges</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-secondary mb-2">Flexible</div>
            <div className="text-sm text-muted-foreground">Scale up or down as needs change</div>
          </div>
        </div>
      </div>
    </section>
  );
};

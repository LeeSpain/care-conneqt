import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Rocket, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ContractFlexibility = () => {
  const options = [
    {
      icon: Rocket,
      title: 'Pilot Programs',
      duration: '3-6 Months',
      badge: 'Trial Period',
      description: 'Test Care Conneqt with a small group before full deployment. Perfect for proof of concept and stakeholder buy-in.',
      features: [
        'Limited deployment (5-15 residents)',
        'Full feature access',
        'Dedicated implementation support',
        'Performance reporting',
        'Option to expand'
      ],
      ideal: 'Organizations evaluating new technology or seeking board approval'
    },
    {
      icon: Calendar,
      title: 'Standard Agreement',
      duration: '12 Months',
      badge: 'Flexible',
      description: 'Annual agreements provide flexibility while ensuring quality care. Renewable with improved terms based on usage.',
      features: [
        'Annual commitment',
        'Competitive pricing',
        'Quarterly business reviews',
        'Standard support',
        'Renewal discounts available'
      ],
      ideal: 'Organizations wanting shorter commitments with renewal flexibility'
    },
    {
      icon: Users,
      title: 'Preferred Partnership',
      duration: '24 Months',
      badge: 'Most Popular',
      description: 'Two-year partnerships offer optimal pricing and priority support. Best value for growing organizations.',
      features: [
        '24-month commitment',
        'Preferred pricing tier',
        'Priority support access',
        'Free quarterly training',
        'Feature preview access'
      ],
      ideal: 'Established facilities looking for long-term stability and best value'
    },
    {
      icon: TrendingUp,
      title: 'Enterprise Partnership',
      duration: '36 Months',
      badge: 'Maximum Value',
      description: 'Long-term partnerships unlock maximum benefits including custom development and strategic account management.',
      features: [
        '36-month commitment',
        'Maximum pricing discount',
        'Dedicated account manager',
        'Custom feature development',
        'Strategic partnership benefits',
        'Executive quarterly reviews'
      ],
      ideal: 'Large organizations and multi-site operators seeking maximum value'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Flexible Agreement Options
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the contract term that matches your organization's needs, budget cycle, and strategic planning horizon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow relative">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{option.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <div className="text-2xl font-bold text-primary mb-2">{option.duration}</div>
                <CardDescription className="text-base">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-2 text-foreground">Includes:</div>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Ideal for:</div>
                  <div className="text-sm text-foreground">{option.ideal}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All agreements include full access to our platform, 24/7 monitoring services, regular system updates, 
            and the ability to scale up or down based on your needs. Contact us to discuss custom terms.
          </p>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Plug, Database, Globe, Lock, Zap } from 'lucide-react';

export const IntegrationOptions = () => {
  const integrations = [
    {
      icon: Database,
      title: 'Care Management Systems',
      description: 'Seamless integration with leading care management platforms including Person Centred Software, Care Vision, and others.',
      examples: ['Person Centred Software', 'Care Vision', 'Log my Care', 'eMAR systems']
    },
    {
      icon: Plug,
      title: 'EHR/EMR Integration',
      description: 'Connect with electronic health record systems for comprehensive care documentation and clinical workflows.',
      examples: ['FHIR-compatible APIs', 'HL7 support', 'NHS integration', 'Custom connectors']
    },
    {
      icon: Globe,
      title: 'Local Authority Platforms',
      description: 'Direct integration with council and social care systems for reporting, referrals, and funding management.',
      examples: ['ContrOCC', 'Adult Social Care systems', 'Reporting portals', 'Funding platforms']
    },
    {
      icon: Zap,
      title: 'RESTful API Access',
      description: 'Full API access for custom integrations, data exports, and building your own applications on our platform.',
      examples: ['REST API', 'Webhook support', 'Real-time data', 'Custom endpoints']
    }
  ];

  const whiteLabel = [
    {
      icon: Palette,
      title: 'Complete Branding',
      description: 'Replace all Care Conneqt branding with your organization\'s logo, colors, and visual identity across the entire platform.',
      features: [
        'Custom logo & colors',
        'Branded mobile apps',
        'Custom domain name',
        'Personalized communications'
      ]
    },
    {
      icon: Lock,
      title: 'Private Deployment',
      description: 'Dedicated infrastructure with your branding, giving the appearance of a completely proprietary solution.',
      features: [
        'Isolated environment',
        'Custom URL structure',
        'Branded login pages',
        'Your terms & policies'
      ]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Integration Options */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Seamless Integrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect Care Conneqt with your existing systems for unified care management and data flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {integrations.map((integration, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <integration.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{integration.title}</CardTitle>
                  <CardDescription className="text-sm">{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {integration.examples.map((example, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* White Label Options */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              White-Label Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              For insurance providers, large care groups, and organizations wanting to offer Care Conneqt 
              as their own branded solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {whiteLabel.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <option.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-3">Why White-Label?</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">For Insurance Providers:</strong> Offer Care Conneqt as your own preventive care benefit, 
                  reducing claims while strengthening member relationships and brand loyalty.
                </p>
                <p>
                  <strong className="text-foreground">For Care Groups:</strong> Create a unified technology experience across all your facilities 
                  with your branding, improving staff adoption and family confidence.
                </p>
                <p>
                  <strong className="text-foreground">For Resellers:</strong> Build your care technology business without development costs, 
                  leveraging our proven platform under your brand.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm font-semibold text-foreground mb-2">Available for:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    Enterprise (500+ residents)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    Insurance Providers
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                    Multi-Site Operators
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, BarChart3, Puzzle, Headphones, FileCheck, Zap } from 'lucide-react';
import facilityDashboard from '@/assets/facility-dashboard.jpg';

export const EnterpriseFeatures = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Advanced Admin Dashboard',
      description: 'Comprehensive control center with real-time monitoring, alerts management, and multi-location oversight.',
      highlights: ['Multi-site management', 'Role-based access', 'Custom views', 'Mobile app']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Deep insights into care quality, resource utilization, and outcome metrics with exportable reports.',
      highlights: ['Custom reports', 'KPI tracking', 'Trend analysis', 'API data export']
    },
    {
      icon: Puzzle,
      title: 'API Integration',
      description: 'Connect seamlessly with your existing care management systems, EHR, and local authority platforms.',
      highlights: ['RESTful API', 'Webhook support', 'FHIR compatible', 'Custom integrations']
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: 'Enterprise-grade support with dedicated account management, priority response, and training programs.',
      highlights: ['Account manager', 'Priority support', 'Training included', 'Quarterly reviews']
    },
    {
      icon: FileCheck,
      title: 'SLA Guarantees',
      description: '99.9% uptime guarantee with comprehensive service level agreements and incident response protocols.',
      highlights: ['99.9% uptime', 'Response SLAs', 'Incident reporting', 'Performance metrics']
    },
    {
      icon: Zap,
      title: 'Custom Onboarding',
      description: 'Tailored implementation process with data migration, staff training, and gradual rollout options.',
      highlights: ['Data migration', 'Staff training', 'Phased rollout', 'Change management']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools and support designed for organizations managing care at scale.
          </p>
        </div>

        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
          <img 
            src={facilityDashboard} 
            alt="Care Conneqt Facility Dashboard" 
            className="w-full h-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {highlight}
                    </span>
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

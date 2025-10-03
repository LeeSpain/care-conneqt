import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, Briefcase } from 'lucide-react';

export const SolutionTypes = () => {
  const solutions = [
    {
      icon: Building2,
      title: 'Care Homes & Facilities',
      description: 'Multi-resident monitoring with centralized dashboards, staff alerts, and comprehensive reporting for enhanced care quality.',
      features: [
        'Centralized admin dashboard',
        'Staff mobile alerts',
        'Fall detection & prevention',
        'Medication reminders',
        'Family portal access',
        'CQC compliance reporting'
      ]
    },
    {
      icon: Users,
      title: 'Municipalities & Social Care',
      description: 'Community-wide programs enabling independent living with real-time monitoring and resource optimization.',
      features: [
        'Population health analytics',
        'Resource allocation tools',
        'Multi-site management',
        'Local authority integration',
        'Risk stratification',
        'Budget optimization'
      ]
    },
    {
      icon: Shield,
      title: 'Insurance Providers',
      description: 'Risk mitigation and preventive care solutions that reduce claims while improving member outcomes.',
      features: [
        'Claims reduction analytics',
        'Risk assessment tools',
        'Member engagement portal',
        'Preventive care tracking',
        'ROI reporting',
        'White-label options'
      ]
    },
    {
      icon: Briefcase,
      title: 'Corporate Wellness',
      description: 'Employee care programs for aging workforce or executive care packages with professional monitoring.',
      features: [
        'Employee care benefits',
        'Executive protection',
        'Aging workforce support',
        'HR dashboard integration',
        'Wellness ROI tracking',
        'Flexible coverage options'
      ]
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Solutions for Every Organization
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tailored care technology solutions designed for your specific organizational needs and objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{solution.title}</CardTitle>
                <CardDescription className="text-base">{solution.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

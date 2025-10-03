import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileCheck, Lock, Eye, AlertTriangle, Award } from 'lucide-react';

export const ComplianceSection = () => {
  const compliance = [
    {
      icon: Shield,
      title: 'GDPR Compliant',
      description: 'Full compliance with EU General Data Protection Regulation, including data subject rights and privacy by design.',
      certifications: ['ISO 27001', 'Data Protection Officer', 'Privacy Impact Assessments', 'Right to erasure']
    },
    {
      icon: FileCheck,
      title: 'CQC Alignment',
      description: 'Tools and reporting designed to support Care Quality Commission requirements and inspection readiness.',
      certifications: ['Safe', 'Effective', 'Caring', 'Responsive', 'Well-led domains']
    },
    {
      icon: Lock,
      title: 'Data Security',
      description: 'Enterprise-grade security with encryption at rest and in transit, regular penetration testing, and SOC 2 compliance.',
      certifications: ['AES-256 encryption', 'TLS 1.3', 'Regular pen testing', 'Vulnerability scanning']
    },
    {
      icon: Eye,
      title: 'Audit Trail',
      description: 'Complete audit logging of all data access, changes, and system events for compliance and investigation purposes.',
      certifications: ['Access logs', 'Change tracking', 'Event monitoring', 'Exportable reports']
    },
    {
      icon: AlertTriangle,
      title: 'Risk Management',
      description: 'Built-in risk assessment tools and escalation protocols aligned with social care safeguarding requirements.',
      certifications: ['Risk stratification', 'Safeguarding alerts', 'Incident reporting', 'Duty of care tracking']
    },
    {
      icon: Award,
      title: 'Industry Standards',
      description: 'Compliance with NHS Digital standards, local authority requirements, and care sector best practices.',
      certifications: ['NHS compatible', 'Council integration', 'Care standards', 'Best practice guidelines']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Compliance & Security
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with regulatory compliance and data security at the core. Meeting and exceeding 
            industry standards to protect your organization and residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {compliance.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Security Certifications</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">ISO 27001 Information Security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">SOC 2 Type II Compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">Cyber Essentials Plus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">Annual Penetration Testing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Data Protection</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">UK-based data centers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">Encrypted backups (daily)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">Disaster recovery plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                    <span className="text-sm text-muted-foreground">99.9% uptime SLA</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

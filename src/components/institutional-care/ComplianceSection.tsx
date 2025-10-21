import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileCheck, Lock, Eye, AlertTriangle, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ComplianceSection = () => {
  const { t } = useTranslation('institutional-care');
  
  const compliance = [
    {
      icon: Shield,
      title: t('complianceSection.gdpr.title'),
      description: t('complianceSection.gdpr.description'),
      certifications: t('complianceSection.gdpr.certifications', { returnObjects: true }) as string[]
    },
    {
      icon: FileCheck,
      title: t('complianceSection.cqc.title'),
      description: t('complianceSection.cqc.description'),
      certifications: t('complianceSection.cqc.certifications', { returnObjects: true }) as string[]
    },
    {
      icon: Lock,
      title: t('complianceSection.security.title'),
      description: t('complianceSection.security.description'),
      certifications: t('complianceSection.security.certifications', { returnObjects: true }) as string[]
    },
    {
      icon: Eye,
      title: t('complianceSection.audit.title'),
      description: t('complianceSection.audit.description'),
      certifications: t('complianceSection.audit.certifications', { returnObjects: true }) as string[]
    },
    {
      icon: AlertTriangle,
      title: t('complianceSection.risk.title'),
      description: t('complianceSection.risk.description'),
      certifications: t('complianceSection.risk.certifications', { returnObjects: true }) as string[]
    },
    {
      icon: Award,
      title: t('complianceSection.standards.title'),
      description: t('complianceSection.standards.description'),
      certifications: t('complianceSection.standards.certifications', { returnObjects: true }) as string[]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('complianceSection.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('complianceSection.subtitle')}
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
                <h3 className="text-xl font-bold mb-4">{t('complianceSection.certifications.title')}</h3>
                <ul className="space-y-2">
                  {(t('complianceSection.certifications.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">{t('complianceSection.dataProtection.title')}</h3>
                <ul className="space-y-2">
                  {(t('complianceSection.dataProtection.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-2" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

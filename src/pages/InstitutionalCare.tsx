import { InstitutionalHero } from '@/components/institutional-care/InstitutionalHero';
import { SolutionTypes } from '@/components/institutional-care/SolutionTypes';
import { EnterpriseFeatures } from '@/components/institutional-care/EnterpriseFeatures';
import { ContractFlexibility } from '@/components/institutional-care/ContractFlexibility';
import { VolumePricing } from '@/components/institutional-care/VolumePricing';
import { ComplianceSection } from '@/components/institutional-care/ComplianceSection';
import { IntegrationOptions } from '@/components/institutional-care/IntegrationOptions';
import { InstitutionalRegistrationForm } from '@/components/institutional-care/InstitutionalRegistrationForm';
import { InstitutionalFAQ } from '@/components/institutional-care/InstitutionalFAQ';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ClaraWidget } from '@/components/ai-agents/ClaraWidget';

export default function InstitutionalCare() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <InstitutionalHero />
      <SolutionTypes />
      <EnterpriseFeatures />
      <ContractFlexibility />
      <VolumePricing />
      <IntegrationOptions />
      <ComplianceSection />
      <InstitutionalRegistrationForm />
      <InstitutionalFAQ />
      <Footer />
      <ClaraWidget />
    </div>
  );
}

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PersonalCareHero } from "@/components/personal-care/PersonalCareHero";
import { ProblemSolution } from "@/components/personal-care/ProblemSolution";
import { HowItWorks } from "@/components/personal-care/HowItWorks";
import { FeaturesGrid } from "@/components/personal-care/FeaturesGrid";
import { ComparisonTable } from "@/components/personal-care/ComparisonTable";
import { PricingSection } from "@/components/PricingSection";
import { WhoItsFor } from "@/components/personal-care/WhoItsFor";
import { Testimonials } from "@/components/personal-care/Testimonials";
import { DevicesSection } from "@/components/DevicesSection";
import { PackageCalculator } from "@/components/personal-care/PackageCalculator";
import { AddOnShowcase } from "@/components/personal-care/AddOnShowcase";
import { FAQ } from "@/components/personal-care/FAQ";
import { GuaranteeSection } from "@/components/personal-care/GuaranteeSection";
import { FinalCTA } from "@/components/personal-care/FinalCTA";

const PersonalCare = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <PersonalCareHero />
      <ProblemSolution />
      <HowItWorks />
      <FeaturesGrid />
      <ComparisonTable />
      
      {/* Pricing Section with Calculator */}
      <section id="pricing-calculator" className="scroll-mt-16">
        <PricingSection />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
          <PackageCalculator />
        </div>
      </section>
      
      <WhoItsFor />
      <Testimonials />
      <DevicesSection />
      <AddOnShowcase />
      <FAQ />
      <GuaranteeSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default PersonalCare;

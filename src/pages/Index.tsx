import { HeroSection } from "@/components/HeroSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { PricingSection } from "@/components/PricingSection";
import { DevicesSection } from "@/components/DevicesSection";
import { AISection } from "@/components/AISection";
import { TrustSection } from "@/components/TrustSection";
import { CTASection } from "@/components/CTASection";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ClaraFixedChat } from "@/components/ai-agents/ClaraFixedChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SolutionsSection />
        <PricingSection />
        <DevicesSection />
        <AISection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
      <ClaraFixedChat />
    </div>
  );
};

export default Index;

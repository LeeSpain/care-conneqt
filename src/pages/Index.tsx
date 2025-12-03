import { lazy, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load sections for better performance
const HeroSection = lazy(() => import("@/components/HeroSection").then(m => ({ default: m.HeroSection })));
const SolutionsSection = lazy(() => import("@/components/SolutionsSection").then(m => ({ default: m.SolutionsSection })));
const PricingSection = lazy(() => import("@/components/PricingSection").then(m => ({ default: m.PricingSection })));
const DevicesSection = lazy(() => import("@/components/DevicesSection").then(m => ({ default: m.DevicesSection })));
const AISection = lazy(() => import("@/components/AISection").then(m => ({ default: m.AISection })));
const TrustSection = lazy(() => import("@/components/TrustSection").then(m => ({ default: m.TrustSection })));
const CTASection = lazy(() => import("@/components/CTASection").then(m => ({ default: m.CTASection })));

const SectionLoader = () => (
  <div className="container mx-auto px-4 py-12">
    <Skeleton className="h-64 w-full" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <SolutionsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <DevicesSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AISection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TrustSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

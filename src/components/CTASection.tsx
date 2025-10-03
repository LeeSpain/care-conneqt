import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep-blue via-primary to-secondary p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-green/20 rounded-full blur-3xl" />
            
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl font-bold font-['Poppins']">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of families and hundreds of institutions providing better care 
                with AI-powered, nurse-led remote monitoring.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Book a Demo
                </Button>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  30-day money back guarantee
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-green" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

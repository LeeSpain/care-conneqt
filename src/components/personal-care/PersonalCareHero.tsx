import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Shield, DollarSign, X } from "lucide-react";
import heroImage from "@/assets/hero-care.jpg";

export const PersonalCareHero = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue/5 via-background to-emerald-green/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold font-['Poppins'] text-primary leading-tight">
              Independent Living with<br />
              <span className="text-secondary">24/7 Peace of Mind</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Nurse-led, AI-powered care through connected devices. Starting at €49.99/month 
              with 24-month service agreement.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">24-Month Service Agreement</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10">
                <Shield className="h-4 w-4 text-coral" />
                <span className="text-sm font-medium">Device Protection Included</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold group"
                asChild
              >
                <a href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
              >
                <Phone className="mr-2 h-4 w-4" />
                Book a Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 flex-wrap">
              <div>
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Countries Covered</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-lilac/20 rounded-3xl transform rotate-3" />
            <img
              src={heroImage}
              alt="Senior living independently with Care Conneqt smart health monitoring"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

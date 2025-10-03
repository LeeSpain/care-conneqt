import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Shield, Award } from 'lucide-react';

export const InstitutionalHero = () => {
  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            <span>Enterprise-Grade Care Solutions</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Scalable Care Technology for
            <span className="block text-primary mt-2">Your Organization</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Empower care homes, municipalities, insurers, and employers with AI-powered monitoring, 
            compliance tools, and flexible agreements tailored to your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-lg px-8"
              onClick={scrollToContact}
            >
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#solutions">Explore Solutions</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="h-8 w-8 text-secondary mb-2" />
              <div className="text-2xl font-bold text-foreground">40%</div>
              <div className="text-sm text-muted-foreground">Emergency Call Reduction</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-secondary mb-2" />
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">GDPR Compliant</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="h-8 w-8 text-secondary mb-2" />
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Professional Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

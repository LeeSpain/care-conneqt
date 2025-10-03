import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Heart, TrendingUp, Shield, ArrowRight } from "lucide-react";

export const SolutionsSection = () => {
  return (
    <section id="solutions" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Care Solutions for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're caring for family or managing a facility, we have the right solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* B2C Card */}
          <Card className="relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-bl-full" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-['Poppins']">For Families</CardTitle>
              </div>
              <CardDescription className="text-base">
                Direct-to-Consumer Care
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Perfect for seniors, families, and expats seeking peace of mind and independence.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-coral mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Personal AI Guardian</div>
                    <div className="text-sm text-muted-foreground">Daily check-ins and proactive monitoring</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">24/7 Emergency Response</div>
                    <div className="text-sm text-muted-foreground">Nurse-led call center integration</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-lilac mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Family Dashboards</div>
                    <div className="text-sm text-muted-foreground">Stay connected with alerts and reports</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">€49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <Button className="w-full bg-secondary hover:bg-secondary/90 group" asChild>
                <a href="/personal-care">
                  Explore Personal Care
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-['Poppins']">For Institutions</CardTitle>
              </div>
              <CardDescription className="text-base">
                Enterprise & Partner Solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Scalable solutions for care homes, insurers, municipalities, and employers.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Facility Dashboard</div>
                    <div className="text-sm text-muted-foreground">Multi-resident monitoring and management</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Compliance & Reporting</div>
                    <div className="text-sm text-muted-foreground">Automated logs and audit trails</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-lilac mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">White-Label Options</div>
                    <div className="text-sm text-muted-foreground">Custom branding and integration</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">€59.99+</span>
                <span className="text-muted-foreground">/resident/month</span>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 group">
                Enterprise Solutions
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Shield, Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div 
              className="p-1.5 rounded-lg"
              style={{ background: 'linear-gradient(135deg, hsl(215 85% 35%), hsl(185 75% 45%))' }}
            >
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-['Poppins'] text-primary leading-tight">
                Care Conneqt
              </span>
              <span className="text-[10px] text-muted-foreground font-medium leading-tight">
                Command Centre
              </span>
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/#solutions" className="text-foreground/80 hover:text-foreground transition-colors">
              Solutions
            </a>
            <a href="/personal-care" className="text-foreground/80 hover:text-foreground transition-colors">
              For Families
            </a>
            <a href="/institutional-care" className="text-foreground/80 hover:text-foreground transition-colors">
              For Institutions
            </a>
            <a href="/devices" className="text-foreground/80 hover:text-foreground transition-colors">
              Devices
            </a>
            <a href="/our-nurses" className="text-foreground/80 hover:text-foreground transition-colors">
              Our Nurses
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
              <a href="/auth/signup">Get Started</a>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <a href="/#solutions" className="block text-foreground/80 hover:text-foreground">
              Solutions
            </a>
            <a href="/personal-care" className="block text-foreground/80 hover:text-foreground">
              For Families
            </a>
            <a href="/institutional-care" className="block text-foreground/80 hover:text-foreground">
              For Institutions
            </a>
            <a href="/devices" className="block text-foreground/80 hover:text-foreground">
              Devices
            </a>
            <a href="/our-nurses" className="block text-foreground/80 hover:text-foreground">
              Our Nurses
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="/auth/login">Sign In</a>
              </Button>
              <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90" asChild>
                <a href="/auth/signup">Get Started</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-secondary" fill="currentColor" />
            <span className="text-2xl font-bold font-['Poppins'] text-primary">
              Care Conneqt
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#solutions" className="text-foreground/80 hover:text-foreground transition-colors">
              Solutions
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#devices" className="text-foreground/80 hover:text-foreground transition-colors">
              Devices
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
              Get Started
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
            <a href="#solutions" className="block text-foreground/80 hover:text-foreground">
              Solutions
            </a>
            <a href="#pricing" className="block text-foreground/80 hover:text-foreground">
              Pricing
            </a>
            <a href="#devices" className="block text-foreground/80 hover:text-foreground">
              Devices
            </a>
            <a href="#about" className="block text-foreground/80 hover:text-foreground">
              About
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div 
              className="p-1.5 rounded-lg"
              style={{ background: 'linear-gradient(135deg, hsl(215 85% 35%), hsl(185 75% 45%))' }}
            >
              <Logo size="sm" className="text-white" />
            </div>
            <span className="text-2xl font-bold font-['Poppins'] text-primary">
              Care Conneqt
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/personal-care" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.forFamilies')}
            </a>
            <a href="/institutional-care" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.forInstitutions')}
            </a>
            <a href="/devices" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.devices')}
            </a>
            <a href="/our-nurses" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.ourNurses')}
            </a>
            <LanguageSwitcher />
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/login">{t('nav.signIn')}</a>
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
              <a href="/auth/signup">{t('nav.getStarted')}</a>
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
            <a href="/personal-care" className="block text-foreground/80 hover:text-foreground">
              {t('nav.forFamilies')}
            </a>
            <a href="/institutional-care" className="block text-foreground/80 hover:text-foreground">
              {t('nav.forInstitutions')}
            </a>
            <a href="/devices" className="block text-foreground/80 hover:text-foreground">
              {t('nav.devices')}
            </a>
            <a href="/our-nurses" className="block text-foreground/80 hover:text-foreground">
              {t('nav.ourNurses')}
            </a>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="/auth/login">{t('nav.signIn')}</a>
              </Button>
              <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90" asChild>
                <a href="/auth/signup">{t('nav.getStarted')}</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

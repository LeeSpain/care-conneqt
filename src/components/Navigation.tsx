import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo size="md" />
            <span className="text-2xl font-bold font-['Poppins'] text-primary">
              Care Conneqt
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.pricing')}
            </Link>
            <Link to="/personal-care" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.forFamilies')}
            </Link>
            <Link to="/institutional-care" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.forInstitutions')}
            </Link>
            <Link to="/devices" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.devices')}
            </Link>
            <Link to="/our-nurses" className="text-foreground/80 hover:text-foreground transition-colors">
              {t('nav.ourNurses')}
            </Link>
            <LanguageSwitcher />
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth/login">{t('nav.signIn')}</Link>
            </Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90" asChild>
              <Link to="/pricing">{t('nav.getStarted')}</Link>
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
            <Link to="/pricing" className="block text-foreground/80 hover:text-foreground">
              {t('nav.pricing')}
            </Link>
            <Link to="/personal-care" className="block text-foreground/80 hover:text-foreground">
              {t('nav.forFamilies')}
            </Link>
            <Link to="/institutional-care" className="block text-foreground/80 hover:text-foreground">
              {t('nav.forInstitutions')}
            </Link>
            <Link to="/devices" className="block text-foreground/80 hover:text-foreground">
              {t('nav.devices')}
            </Link>
            <Link to="/our-nurses" className="block text-foreground/80 hover:text-foreground">
              {t('nav.ourNurses')}
            </Link>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/auth/login">{t('nav.signIn')}</Link>
              </Button>
              <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90" asChild>
                <Link to="/pricing">{t('nav.getStarted')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

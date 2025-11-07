import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export const Footer = () => {
  const { t } = useTranslation('common');
  
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, hsl(215 85% 35%), hsl(185 75% 45%))' }}
              >
                <Logo size="sm" className="text-white" />
              </div>
              <span className="text-xl font-bold font-['Poppins']">Care Conneqt</span>
            </div>
            <p className="text-white/80 text-sm">
              {t('footer.tagline')}
            </p>
            <p className="text-white/60 text-xs">
              {t('footer.operating')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.solutions')}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/personal-care" className="hover:text-secondary transition-colors">{t('footer.forFamilies')}</a></li>
              <li><a href="/institutional-care" className="hover:text-secondary transition-colors">{t('footer.forInstitutions')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/guide" className="hover:text-secondary transition-colors">{t('footer.guide')}</a></li>
              <li><a href="/devices" className="hover:text-secondary transition-colors">{t('footer.devices')}</a></li>
              <li><a href="/our-nurses" className="hover:text-secondary transition-colors">{t('footer.ourNurses')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.helpCenter')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div>{t('footer.copyright')}</div>
          <div className="flex items-center gap-2">
            <span>{t('footer.languages')}:</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};

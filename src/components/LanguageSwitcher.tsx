import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user, profile } = useAuth();

  const changeLanguage = async (lng: string) => {
    try {
      // Wait for language change to complete
      await i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      // Force update HTML lang attribute
      document.documentElement.lang = lng;
      
      console.log('[LanguageSwitcher] Language changed to:', lng);
      
      // Update user profile in background (don't wait)
      if (user && profile) {
        supabase
          .from('profiles')
          .update({ language: lng })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to update language preference:', error);
            }
          });
      }
    } catch (error) {
      console.error('[LanguageSwitcher] Language change failed:', error);
      toast.error('Failed to change language');
    }
  };

  const currentLang = i18n.language.split('-')[0];
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLang === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

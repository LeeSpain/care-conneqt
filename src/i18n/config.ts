import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'nl',
    
    supportedLngs: ['en', 'es', 'nl'],
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Preload all critical namespaces to prevent flickering
    ns: ['common', 'dashboard', 'auth', 'home', 'devices', 'guide', 'nurses', 'personal-care', 'institutional-care'],
    defaultNS: 'common',

    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupQuerystring: 'lng',
    },

    react: {
      useSuspense: true, // Enable Suspense to wait for translations before rendering
    },

    // Preload languages for faster switching
    preload: ['nl', 'en', 'es'],
    
    // Load namespaces on demand for better performance
    load: 'languageOnly',
    cleanCode: true,
    
    // Improve loading performance
    partialBundledLanguages: true,
  });

export default i18n;

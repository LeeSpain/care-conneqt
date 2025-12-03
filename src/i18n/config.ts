import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    
    supportedLngs: ['en', 'es', 'nl'],
    debug: true, // Enable debug to see loading issues
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      queryStringParams: { v: '1.0.3' }, // Cache buster
    },

    // Load critical namespaces initially - others load on demand
    ns: ['common', 'home', 'dashboard-admin'],
    defaultNS: 'common',

    detection: {
      order: ['querystring', 'localStorage'], // Removed 'navigator' to ensure Dutch default for first-time visitors
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupQuerystring: 'lng',
    },

    react: {
      useSuspense: false, // Don't block rendering - load translations asynchronously
    },
    
    // Load namespaces on demand for better performance
    load: 'languageOnly',
    cleanCode: true,
    
    // Improve loading performance
    partialBundledLanguages: true,
  });

export default i18n;

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
    lng: 'nl',
    supportedLngs: ['en', 'es', 'nl'],
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    ns: ['common', 'home', 'dashboard', 'personal-care', 'institutional-care', 'devices', 'nurses', 'auth', 'guide'],
    defaultNS: 'common',

    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupQuerystring: 'lng',
    },

    react: {
      useSuspense: true,
    },

    // Load namespaces on demand for better performance
    load: 'languageOnly',
    cleanCode: true,
  });

export default i18n;

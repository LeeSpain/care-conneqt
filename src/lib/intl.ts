import { format as dateFnsFormat } from 'date-fns';
import { enUS, es, nl } from 'date-fns/locale';

const localeMap = {
  en: enUS,
  es: es,
  nl: nl,
};

export const getDateFnsLocale = (language: string) => {
  const lang = language.split('-')[0] as keyof typeof localeMap;
  return localeMap[lang] || enUS;
};

export const formatCurrency = (
  amount: number | string,
  currency = 'EUR',
  language = 'en'
): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const lang = language.split('-')[0];
  
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export const formatNumber = (value: number, language = 'en'): string => {
  const lang = language.split('-')[0];
  return new Intl.NumberFormat(lang).format(value);
};

export const formatDate = (
  date: Date | string,
  pattern: string,
  language = 'en'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getDateFnsLocale(language);
  return dateFnsFormat(dateObj, pattern, { locale });
};

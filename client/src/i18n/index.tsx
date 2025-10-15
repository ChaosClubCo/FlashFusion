import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import arTranslations from '@/locales/ar.json';

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ar';
export type Translations = typeof enTranslations;

const translations: Record<Locale, Translations> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ar: arTranslations,
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
};

export const RTL_LOCALES: Locale[] = ['ar'];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  formatDate: (date: Date | string, format?: 'short' | 'long' | 'full') => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Detect browser language (with SSR/Node safety)
function detectLocale(): Locale {
  // Guard for non-browser environments
  if (typeof window === 'undefined') {
    return 'en';
  }

  // Check localStorage first
  try {
    const stored = localStorage.getItem('locale') as Locale;
    if (stored && Object.keys(translations).includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage access failed (incognito mode, etc.)
  }

  // Detect from browser
  try {
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(translations).includes(browserLang)) {
      return browserLang as Locale;
    }
  } catch {
    // navigator not available
  }

  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale());

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Guard for non-browser environments
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('locale', newLocale);
      } catch {
        // localStorage access failed
      }
      
      // Update HTML attributes
      if (document?.documentElement) {
        document.documentElement.lang = newLocale;
        document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? 'rtl' : 'ltr';
      }
    }
  };

  useEffect(() => {
    // Set initial HTML attributes (browser only)
    if (typeof window !== 'undefined' && document?.documentElement) {
      document.documentElement.lang = locale;
      document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Navigate nested translation keys like 'hero.title'
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace params like {{name}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || '';
      });
    }

    return value;
  };

  const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = 
      format === 'full' ? { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      } :
      format === 'long' ? { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      } : { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };

    return new Intl.DateTimeFormat(locale, options).format(d);
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(locale, options).format(num);
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const isRTL = RTL_LOCALES.includes(locale);

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, isRTL, formatDate, formatNumber, formatCurrency }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

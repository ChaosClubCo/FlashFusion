// i18n stub - simple translation system
type TranslationKey = string;
type Locale = 'en' | 'es';

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    'hero.title': 'Build Apps 10× Faster with AI',
    'hero.subtitle': 'Transform ideas into production-ready applications in minutes.',
    'cta.start': 'Start Building Free',
    'cta.demo': 'Watch 2-Minute Demo',
  },
  es: {
    'hero.title': 'Construye Apps 10× Más Rápido con IA',
    'hero.subtitle': 'Transforma ideas en aplicaciones listas para producción en minutos.',
    'cta.start': 'Comenzar Gratis',
    'cta.demo': 'Ver Demo de 2 Minutos',
  },
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: TranslationKey): string {
  return translations[currentLocale]?.[key] || key;
}

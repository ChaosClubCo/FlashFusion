import { useI18n, LOCALE_NAMES, type Locale } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label={t('nav.language')}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">
            {LOCALE_NAMES[locale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(LOCALE_NAMES) as Locale[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLocale(lang)}
            className={locale === lang ? 'bg-accent' : ''}
          >
            <span className={locale === lang ? 'font-semibold' : ''}>
              {LOCALE_NAMES[lang]}
            </span>
            {locale === lang && (
              <span className="ml-2 text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Link, useLocation } from 'wouter';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/i18n';
import { featureFlags } from '@/utils/featureFlags';

export function Navigation() {
  const { t } = useI18n();
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/qa', label: t('nav.qa') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center space-x-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md transition-colors">
              <span className="font-bold text-lg">FlashFusion</span>
            </a>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                    location === item.path
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`nav-link-${item.path.slice(1) || 'home'}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {featureFlags.I18N_ENABLED && <LanguageSwitcher />}
        </div>
      </div>
    </nav>
  );
}

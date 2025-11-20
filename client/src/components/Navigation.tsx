import { Link, useLocation } from 'wouter';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthButton } from './AuthButton';
import { useI18n } from '@/i18n';
import { featureFlags } from '@/utils/featureFlags';

export function Navigation() {
  const { t } = useI18n();
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/workflows', label: 'Workflows' },
    { path: '/image-generation', label: 'Image Generation' },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/qa', label: t('nav.qa') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="flex items-center space-x-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md transition-colors"
            data-testid="nav-link-brand"
          >
            <span className="font-bold text-lg">FlashFusion</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                  location === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`nav-link-${item.path.slice(1) || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {featureFlags.I18N_ENABLED && <LanguageSwitcher />}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

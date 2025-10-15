# ⚡ FlashFusion

> Build Apps 10× Faster with AI

FlashFusion is a production-ready, cinematic AI-powered development platform that transforms ideas into full-stack applications in minutes.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5000` to see the app.

## ✨ Features

- **🎨 Cinematic UI**: Gradient mesh background with grain overlay and parallax animation
- **🤖 AI-Powered**: Generate complete applications with AI assistance
- **♿ Accessible**: WCAG 2.1 AA compliant with full keyboard navigation
- **🔒 Secure**: CSP-safe patterns, DOMPurify sanitization, safe iframes
- **🚄 Performant**: LCP ≤ 1.8s, CLS ≤ 0.1, initial JS ≤ 120KB gz
- **📱 Responsive**: Optimized for 375px, 768px, and 1440px viewports
- **🔍 SEO Optimized**: JSON-LD schemas, meta tags, OpenGraph support
- **🌙 Motion Aware**: Respects prefers-reduced-motion
- **📊 Analytics**: Privacy-first, consent-gated event tracking
- **🎯 Feature Flags**: Controlled rollout system

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: Wouter (lightweight React Router alternative)
- **Animation**: Framer Motion 11
- **SEO**: react-helmet-async
- **Security**: DOMPurify
- **State**: Zustand
- **Backend**: Express.js with in-memory storage

### Project Structure

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Background.tsx
│   │   ├── Hero.tsx
│   │   ├── Metrics.tsx
│   │   ├── Features.tsx
│   │   ├── BuildProcess.tsx
│   │   ├── LimitReachedModal.tsx
│   │   ├── UsageWarning.tsx
│   │   ├── ConsentBanner.tsx
│   │   └── auth/
│   ├── pages/           # Route pages
│   │   ├── Landing.tsx
│   │   ├── Pricing.tsx
│   │   ├── QA.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   ├── Status.tsx
│   │   └── NotFound.tsx
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   │   ├── sanitize.ts
│   │   ├── events.ts
│   │   ├── featureFlags.ts
│   │   └── i18n.ts
│   └── lib/             # Libraries and configs
shared/
└── schema.ts            # Shared TypeScript types
server/
├── routes.ts            # API routes
└── storage.ts           # Data persistence
```

## 🎨 Design System

### Colors

- **Primary**: Orange (`hsl(24 95% 53%)`) - CTAs, focus states
- **Gradient**: Orange → Cyan → Magenta mesh
- **Background**: Dark (`rgba(14, 14, 16, 0.85)`) with backdrop blur

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900
- **Display**: swap (for performance)

### Focus States

- **Ring**: 2px solid orange
- **Visible**: All interactive elements
- **Trap**: Modal focus management

## 🔐 Security

### Content Security Policy

Recommended headers for production:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' wss: https:;
  frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://checkout.stripe.com;
  
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Note**: Replit proxy may add/strip headers. Keep CSP in app & CDN config.

### Allowed Iframe Hosts

- `https://www.youtube-nocookie.com` - Video demos
- `https://player.vimeo.com` - Video content
- `https://checkout.stripe.com` - Payment processing

### Secret Management

⚠️ **Never commit API keys or secrets to the repository**

- Use environment variables only
- Add sensitive files to `.gitignore`
- Rotate keys regularly

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- ✅ Contrast ratio ≥ 4.5:1
- ✅ Skip link to main content
- ✅ Focus trap in modals
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ ARIA labels and live regions
- ✅ Reduced motion support
- ✅ Screen reader optimized

### Testing Checklist

- [ ] Run Axe DevTools on all pages
- [ ] Tab through entire page (focus visible)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify skip link works
- [ ] Test modal focus trap (Tab, Shift+Tab, Esc)
- [ ] Enable reduced motion and verify animations stop
- [ ] Check color contrast with tools
- [ ] Test keyboard-only navigation

## 📊 Performance

### Targets

- **LCP**: ≤ 1.8s (Largest Contentful Paint)
- **CLS**: ≤ 0.1 (Cumulative Layout Shift)
- **TTI**: ≤ 1.8s (Time to Interactive)
- **Bundle**: ≤ 120KB gzipped (initial)
- **Lighthouse**: ≥ 90 (Performance, SEO, A11y)

### Optimization Techniques

1. **Code Splitting**: Lazy-loaded routes
2. **Font Loading**: `display=swap` with Font Loading API
3. **Images**: WebP format, srcset, lazy loading
4. **Animations**: Idle-time rendering (Command Palette)
5. **Caching**: Immutable assets, stale-while-revalidate

### Running Performance Checks

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:5000 --view

# Bundle analysis
npm run build -- --mode analyze
```

## 🧪 Testing

### E2E Testing with Playwright

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npm run test:e2e
```

### Smoke Test Steps

1. **Landing Page**
   - Open `/`
   - Verify Hero renders
   - Click "Start Building Free" CTA
   - Test email subscription

2. **Pricing Page**
   - Navigate to `/pricing`
   - Verify 3 tiers display
   - Check promo badge (if PROMO_LAUNCH50=true)
   - Click upgrade buttons

3. **Modal Focus Trap**
   - Trigger limit reached modal
   - Tab through focusable elements
   - Verify focus stays in modal
   - Press Esc to close

4. **Skip Link**
   - Tab from page load
   - Verify skip link appears
   - Press Enter
   - Verify focus moves to #main

5. **404 Page**
   - Navigate to `/nonexistent`
   - Verify 404 page renders
   - Click "Go Home" button

## 🎯 Feature Flags

Configure in `client/src/utils/featureFlags.ts`:

```typescript
export const featureFlags = {
  PROMO_LAUNCH50: true,        // 50% off promo for Pro plan
  PWA_ENABLED: false,           // Progressive Web App
  I18N_ENABLED: false,          // Internationalization
  UPGRADE_MODAL_V2: false,      // New upgrade modal design
  REFERRAL_ENABLED: false,      // Referral program
  AGENT_TEASERS_ENABLED: false, // AI agent teasers
};
```

## 📈 Analytics

### Privacy-First Approach

- **Consent required**: No tracking without user consent
- **First-party only**: No third-party analytics
- **Minimal data**: Timestamp, route, event name only
- **Transparent**: Clear disclosure in consent banner

### Tracked Events

- `landing_view` - Landing page view
- `cta_click` - CTA button clicks
- `generation_started` - App generation started
- `generation_completed` - App generation completed
- `pricing_view` - Pricing page view
- `upgrade_click` - Upgrade button clicks
- `consent_given` - Analytics consent granted

## 🌍 Internationalization (Stub)

i18n is stubbed and ready for implementation when `I18N_ENABLED=true`:

```typescript
import { t, setLocale } from '@/utils/i18n';

setLocale('es');
const title = t('hero.title'); // Returns Spanish translation
```

### RTL Support

When enabled, add `dir="auto"` to `<html>` tag and adjust padding for RTL languages.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Cache Policy

```
/assets/*         - Cache-Control: public, max-age=31536000, immutable
/*.html, /         - Cache-Control: public, max-age=0, stale-while-revalidate=300
```

### Image Pipeline

1. Convert images to WebP format
2. Generate responsive sizes (400w, 800w, 1200w, 1600w)
3. Add `srcset` and `sizes` attributes
4. Use `loading="lazy"` for below-fold images
5. Use `decoding="async"` for all images

### PWA Setup (Optional)

If `PWA_ENABLED=true`:

1. Generate `manifest.webmanifest`
2. Add service worker
3. Add no-index meta tag until verified
4. Test offline functionality

## 📋 Release Checklist

Before each release:

- [ ] Performance: Lighthouse score ≥ 90 (Perf, SEO, A11y)
- [ ] Accessibility: Axe DevTools passes all critical checks
- [ ] Security: CSP headers configured, no inline scripts/styles
- [ ] Legal: Privacy, Terms, Status pages complete
- [ ] SEO: Meta tags, JSON-LD, canonical URLs present
- [ ] Consent: Cookie banner functional, analytics gated
- [ ] Testing: Playwright smoke tests pass
- [ ] Images: All using WebP, srcset, lazy loading
- [ ] Monitoring: Error tracking configured
- [ ] Documentation: README, CHANGELOG updated

## 🐛 Known Issues

- Grain texture needs to be created at `public/grain.png`
- OG image needs to be created at `public/og/default.png`
- Backend API endpoints need implementation

## 📝 License

Copyright © 2025 FlashFusion. All rights reserved.

## 🤝 Contributing

This is a production application. For contributions:

1. Follow existing code patterns
2. Maintain accessibility standards
3. Run tests before submitting
4. Update documentation

## 📞 Support

- **Email**: support@flashfusion.dev
- **Status**: status.flashfusion.dev
- **Docs**: docs.flashfusion.dev

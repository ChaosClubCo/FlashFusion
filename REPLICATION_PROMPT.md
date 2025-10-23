# Context-Engineered Prompt: Full-Stack Feature Implementation Suite

## Initial Context

**Project Type:** Full-stack web application (React + TypeScript + Vite frontend, Express.js backend)

**Tech Stack:**
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Express.js, Node.js 22
- Database: PostgreSQL (Supabase/Neon)
- State Management: Zustand, TanStack Query (React Query)
- Testing: Playwright (to be added)
- Deployment: Vercel
- Additional: Drizzle ORM, Stripe, OpenAI integration

**Project Goal:** AI-powered development platform for generating full-stack applications

**Initial Repository State:**
- Basic project structure with client/server separation
- Existing authentication system (Replit Auth)
- Basic UI components (shadcn/ui)
- Preliminary i18n system stubbed
- Database schema defined
- No E2E tests
- No payment integration
- No PWA support
- No performance monitoring
- Missing production assets

---

## Task: Implement Comprehensive Production-Ready Feature Suite

Implement the following 10 major features with production-ready quality, comprehensive documentation, and best practices:

### 1. Visual Assets Generation
**Requirements:**
- Generate grain texture overlay (200x200px, seamless)
- Create OpenGraph social sharing image (1200x630px)
- Generate favicon and PWA icons (16px to 512px)
- Create apple-touch-icon for iOS (180x180px)
- Use Sharp library for programmatic generation
- Create reusable script in `scripts/generateAssets.ts`

**Implementation Pattern:**
```typescript
// Use Sharp to generate images programmatically
import sharp from 'sharp';

// Grain texture: Random noise pattern
// OG image: SVG-based gradient with text overlay
// Icons: Gradient background with emoji/logo
// Output to public/ directory
```

### 2. End-to-End Testing with Playwright
**Requirements:**
- Install and configure Playwright
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile device emulation (Pixel 5, iPhone 12)
- Test suites for:
  - Landing page (hero, CTA, skip link, reduced motion)
  - Pricing page (all tiers, keyboard navigation)
  - Modal interactions (focus trap, Escape key)
  - 404 error page
  - Accessibility (WCAG 2.1 AA compliance)
- Add npm scripts for test execution
- Configure for CI/CD

**Configuration Pattern:**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. Backend API Enhancement with OpenAI
**Requirements:**
- Integrate OpenAI GPT-5 for actual code generation
- Implement job queue with database persistence
- Add retry logic for failed jobs
- Graceful fallback to mock generation
- Use newest OpenAI model (gpt-5, released Aug 7, 2025)
- JSON response format enforcement
- Error handling and logging

**Implementation Pattern:**
```typescript
// server/generation.ts
import { openai } from './openai';

async function generateWithAI(prompt: string) {
  try {
    // Use gpt-5 (newest model)
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "JSON output system prompt" },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    // Fallback to mock generation
    return mockGenerate(prompt);
  }
}
```

### 4. Progressive Web App (PWA) Implementation
**Requirements:**
- Create `manifest.webmanifest` with full metadata
- Implement service worker with:
  - Network-first strategy for HTML
  - Cache-first strategy for assets
  - Offline support
  - Background sync capability
  - Push notification handlers (ready)
- PWA utilities:
  - Service worker registration
  - Install prompt handling
  - Offline detection
  - Update notifications
- Add icons and metadata

**Service Worker Pattern:**
```javascript
// public/sw.js
const CACHE_NAME = 'app-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/','index.html','/manifest.webmanifest'])
    )
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for HTML, cache-first for assets
});
```

### 5. Complete i18n System
**Requirements:**
- LanguageSwitcher component with dropdown UI
- Support for 5+ languages (en, es, fr, de, ar)
- RTL support for Arabic
- Date/number/currency formatting
- Nested translation keys
- Parameter interpolation
- localStorage persistence
- Auto-detect browser language

**Component Pattern:**
```typescript
// client/src/components/LanguageSwitcher.tsx
import { useI18n, LOCALE_NAMES } from '@/i18n';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  // Dropdown with Globe icon, show all available locales
}
```

### 6. Analytics Dashboard with Recharts
**Requirements:**
- Comprehensive dashboard page
- Multiple chart types:
  - AreaChart for timeline data
  - BarChart for top events
  - PieChart for distribution
- Key metrics cards (total events, unique routes, growth)
- Tab-based views (Timeline, Top Events, Routes)
- Export functionality (JSON, CSV)
- Mock data generator for demos
- Real API integration with fallback
- Responsive design

**Dashboard Pattern:**
```typescript
// client/src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { LineChart, BarChart, PieChart } from 'recharts';

export default function Dashboard() {
  const { data, error } = useQuery({
    queryKey: ['/api/analytics/stats'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/stats');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  // Use mock data if API fails
  const displayData = error ? generateMockData() : data;

  // Charts, stats cards, export buttons
}
```

### 7. Stripe Payment Integration
**Requirements:**
- Server-side Stripe SDK initialization
- Three-tier pricing (Free, Pro, Enterprise)
- Checkout session creation
- Customer portal access
- Webhook handling for:
  - checkout.session.completed
  - customer.subscription.created/updated/deleted
  - invoice.payment_succeeded/failed
- Client-side components:
  - CheckoutButton
  - ManageSubscriptionButton
  - PlanCard
- Billing management page
- Subscription upgrade/downgrade flows
- Usage tracking and limits
- Comprehensive documentation

**Stripe Setup Pattern:**
```typescript
// server/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover' as any,
});

export const PLAN_PRICES = {
  pro: { priceId: process.env.STRIPE_PRO_PRICE_ID, usageLimit: 100 },
  enterprise: { priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID, usageLimit: 1000 },
};

// Webhook handler with signature verification
export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, secret);
  // Handle events...
}
```

### 8. Performance Monitoring System
**Requirements:**
- Lighthouse CI configuration
- GitHub Actions workflow for automated testing
- Web Vitals tracking:
  - TTFB (Time to First Byte)
  - FCP (First Contentful Paint)
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- Performance budget validation
- Bundle size tracking
- Resource timing analysis
- Long task detection
- Performance score calculation

**Monitoring Pattern:**
```typescript
// client/src/utils/performance.ts
export function initPerformanceMonitoring() {
  // FCP observer
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        reportMetric('FCP', entry.startTime);
      }
    }
  }).observe({ entryTypes: ['paint'] });

  // LCP observer
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    reportMetric('LCP', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Report on unload
  window.addEventListener('beforeunload', reportMetrics);
}
```

**Lighthouse CI Config:**
```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run build && npm start",
      "url": ["http://localhost:5000/", "http://localhost:5000/pricing"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### 9. Referral Program System
**Requirements:**
- Referrals dashboard page
- Unique referral code generation
- Referral link with copy-to-clipboard
- Statistics tracking (total referrals, active, earnings)
- Referral history table with status
- Social media sharing buttons (Email, Twitter, Facebook, LinkedIn)
- Reward tiers system (Bronze, Silver, Gold, Platinum)
- Progress bars for tier advancement
- Mock data generator
- API integration with fallback

**Referral Page Pattern:**
```typescript
// client/src/pages/Referrals.tsx
export default function Referrals() {
  const { data, error } = useQuery({
    queryKey: ['/api/referrals'],
    queryFn: async () => {
      const res = await fetch('/api/referrals');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const referralUrl = `${window.location.origin}?ref=${data?.referralCode}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralUrl);
    toast({ title: 'Copied!' });
  };

  // Stats cards, referral history table, tier progress, share buttons
}
```

### 10. AI Agent Teasers Component
**Requirements:**
- Interactive code generation preview
- 6+ example prompts (Todo App, Dashboard, Auth System, etc.)
- Typing animation effect (5ms per character)
- Syntax highlighting (custom lightweight)
- Terminal-style UI with macOS-style controls
- Copy to clipboard functionality
- Smooth Framer Motion animations
- Example switching with transitions
- Mobile responsive
- Stats section
- "Try It Now" button

**Component Pattern:**
```typescript
// client/src/components/AgentTeasers.tsx
import { motion } from 'framer-motion';

const EXAMPLES = [
  {
    title: 'Todo App',
    prompt: 'Build a todo app with...',
    code: '// Generated code...',
  },
  // 5+ more examples
];

export function AgentTeasers() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const typeCode = async (code: string) => {
    setIsTyping(true);
    // Animate typing character by character
    for (let i = 0; i <= code.length; i++) {
      setDisplayedCode(code.slice(0, i));
      await new Promise(r => setTimeout(r, 5));
    }
    setIsTyping(false);
  };

  // Terminal UI with window controls, code preview, syntax highlighting
}
```

---

## Critical Implementation Details

### React Query Fix (CRITICAL)
**Issue:** All `useQuery` hooks MUST include `queryFn`

**Pattern:**
```typescript
// ❌ WRONG - Will throw "Missing queryFn" error
const { data } = useQuery({
  queryKey: ['/api/endpoint'],
  retry: 1,
});

// ✅ CORRECT
const { data } = useQuery({
  queryKey: ['/api/endpoint'],
  queryFn: async () => {
    const response = await fetch('/api/endpoint');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
  retry: 1,
});
```

### GitHub Actions CI Configuration
**Issue:** Workflows need DATABASE_URL but shouldn't connect to real database for build-only tasks

**Pattern:**
```yaml
# .github/workflows/lighthouse-ci.yml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    env:
      # Mock database URL for CI - build only, no real connection
      DATABASE_URL: postgresql://ci:ci@localhost:5432/test_db
      NODE_ENV: test

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: actions/upload-artifact@v4  # Use v4, not v3 (deprecated)
```

### Stripe Webhook Raw Body Handling
**Issue:** Stripe webhooks require raw body for signature verification

**Pattern:**
```typescript
// server/index.ts
// BEFORE standard middleware
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// AFTER webhook route
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

### TypeScript Strictness
**Pattern:**
- Use proper interfaces for all data structures
- Add `as any` only when necessary (e.g., Stripe API version)
- Fix all type errors before committing
- Use `queryClient` from React Query context properly

### Environment Variables Strategy
**Pattern:**
```env
# .env.example (commit this)
DATABASE_URL=your_database_url_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# .env (DO NOT commit)
DATABASE_URL=actual_production_url
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## Documentation Requirements

Create these documentation files:

### 1. STRIPE_INTEGRATION.md
- Complete setup guide
- Webhook configuration
- Testing with test cards
- Production checklist
- ~500 lines

### 2. STRIPE_QUICKSTART.md
- 5-minute setup guide
- Copy-paste commands
- ~200 lines

### 3. SUPABASE_BEST_PRACTICES.md
- Security best practices
- RLS setup
- Secret management
- CI/CD configuration
- ~300 lines

### 4. SETUP_GITHUB_SECRETS.md
- Step-by-step secret configuration
- Pre-filled with project-specific info
- ~200 lines

### 5. VERCEL_DEPLOYMENT.md
- Production deployment guide
- Environment variable setup
- Build configuration
- Troubleshooting
- ~400 lines

### 6. Agent Teasers Documentation
- AGENT_TEASERS_INTEGRATION.md
- AGENT_TEASERS_VISUAL_GUIDE.md
- QUICK_START_AGENT_TEASERS.md
- Component usage examples

---

## Testing & Quality Assurance

### Test Coverage
- E2E tests for all user flows
- Accessibility compliance (WCAG 2.1 AA)
- Performance budgets (LCP ≤ 2.5s, CLS ≤ 0.1)
- Cross-browser compatibility
- Mobile responsiveness

### Code Quality
- TypeScript strict mode enabled
- No ESLint errors
- Proper error handling
- Loading states
- Empty states
- Error boundaries

---

## Git Commit Strategy

**Commit Pattern:**
```bash
git add -A
git commit -m "Descriptive title

Detailed description with:
- Feature 1 implemented
- Feature 2 implemented
- Key changes made

Additional context and notes.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin branch-name
```

**Branch Naming:**
- Use descriptive names: `feature/payment-integration`
- Or automated: `claude/feature-SESSIONID`

---

## Expected Deliverables

### Code Files (~40+ new files)
- Visual assets (grain.png, og/default.png, icons)
- Test suites (5+ test files)
- Dashboard components (3 major pages)
- Payment integration (server + client)
- PWA files (manifest, service worker)
- Performance monitoring utilities
- Stripe integration
- Documentation files (7+ markdown files)

### Modifications (~10+ files)
- package.json (new scripts, dependencies)
- Server routes (API endpoints)
- Backend generation logic (OpenAI integration)
- GitHub Actions workflows
- Environment configuration

### Statistics
- ~16,000+ lines added
- ~3,000 lines modified
- 47+ files changed
- 100% production-ready code
- Comprehensive documentation

---

## Success Criteria

- ✅ All 10 features fully implemented
- ✅ All tests passing
- ✅ CI/CD workflows successful
- ✅ TypeScript compilation clean
- ✅ Documentation complete
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Accessibility compliant
- ✅ Performance targets met
- ✅ Security best practices followed

---

## Execution Order

1. **Setup & Dependencies** (10 min)
   - Install Playwright, Lighthouse, Stripe, Sharp

2. **Visual Assets** (5 min)
   - Generate script and run

3. **Testing Infrastructure** (20 min)
   - Playwright config and test suites

4. **Backend Enhancements** (15 min)
   - OpenAI integration, job queue

5. **PWA Implementation** (15 min)
   - Manifest, service worker, utilities

6. **i18n Completion** (10 min)
   - LanguageSwitcher component

7. **Analytics Dashboard** (30 min)
   - Charts, metrics, export

8. **Stripe Integration** (45 min)
   - Server setup, webhooks, client components

9. **Performance Monitoring** (20 min)
   - Utilities, Lighthouse CI, GitHub Actions

10. **Referral System** (25 min)
    - Dashboard, tracking, sharing

11. **AI Agent Teasers** (40 min)
    - Component with animations

12. **Documentation** (30 min)
    - All markdown files

13. **Testing & Fixes** (20 min)
    - React Query fixes, CI fixes

14. **Final Review & Commit** (10 min)
    - Verify all features, commit, push

**Total Estimated Time:** ~5 hours

---

## Common Issues & Solutions

### Issue 1: "Missing queryFn" in React Query
**Solution:** Add `queryFn` to all `useQuery` hooks

### Issue 2: "DATABASE_URL must be set" in CI
**Solution:** Add mock DATABASE_URL to workflow env

### Issue 3: Deprecated GitHub Actions
**Solution:** Use v4 for actions/checkout, setup-node, upload-artifact

### Issue 4: Stripe webhook signature verification failed
**Solution:** Use express.raw() before webhook route, express.json() after

### Issue 5: TypeScript errors in Stripe types
**Solution:** Use `as any` for API version, cast types where needed

---

## Notes for AI Agent Execution

- Use parallel tool calls when possible
- Create TodoWrite list to track progress
- Mark todos as completed immediately after finishing
- Use Task tool for complex, multi-step operations
- Read files before editing them
- Use proper TypeScript types throughout
- Test incrementally as you build
- Commit frequently with descriptive messages
- Push to remote branch regularly

---

## Output Format

At the end, provide:
1. Summary of all features implemented
2. File count and line statistics
3. List of commits made
4. Branch name used
5. Next steps for user (deployment, configuration)
6. Link to PR if created

---

**This prompt encapsulates a complete production-ready feature implementation workflow that can be replicated across similar full-stack TypeScript projects.**

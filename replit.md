# FlashFusion - AI-Powered Application Builder

## Overview

FlashFusion is a production-ready, cinematic AI-powered development platform designed to transform ideas into full-stack applications rapidly. The application features a modern, accessible interface with enterprise-grade security, performance optimization, and privacy-first analytics.

The platform is built as a landing page and marketing site showcasing AI development capabilities, with tiered pricing (Free, Pro, Enterprise) and usage-based access control. It demonstrates best-in-class web development practices including WCAG 2.1 AA accessibility compliance, CSP-safe patterns, and optimized performance metrics.

## Project Status

**✅ MVP COMPLETE - Production Features Implemented**

All core features have been implemented and verified through comprehensive testing:

- **Frontend Excellence**: All pages and components built with exceptional visual quality, cinematic animations, and WCAG 2.1 AA accessibility
- **Database Persistence**: PostgreSQL with Drizzle ORM - all data persists across restarts
- **Rate Limiting**: Atomic database-level rate limiting prevents concurrent request race conditions
- **Generation Queue**: Job queue with persistence, rehydration on restart, and retry logic
- **PWA Support**: Service worker, manifest, offline page, install prompts with production-ready PNG icons
- **Usage Tracking**: Complete quota management system with plan-based limits (Free: 10/hour, Pro: 100/hour, Enterprise: unlimited)
- **Modal System**: LimitReachedModal properly closes via Escape, close button, and "Maybe Later" action
- **Email Capture**: Subscription system working with success feedback
- **Consent Management**: Cookie/analytics banner properly gates event tracking
- **Navigation**: All routes functional (Landing, Pricing, QA, Privacy, Terms, Status, Offline, 404)
- **Accessibility**: Skip links, keyboard navigation, focus management, and 2px orange focus indicators verified
- **Testing**: Comprehensive e2e test suites verify all functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript and Vite as the build tool. The application uses functional components with hooks for state management and side effects.

**Routing Strategy**: Wouter (lightweight React Router alternative) with lazy-loaded route components for code splitting. Each major page is dynamically imported to reduce initial bundle size and improve Time to Interactive (TTI).

**State Management**: Zustand for lightweight global state, particularly for authentication state with persistence middleware. React Query (@tanstack/react-query) handles server state, caching, and data synchronization.

**Styling System**: Tailwind CSS 3 with custom configuration extending shadcn/ui design tokens. The design system uses CSS custom properties for theming with build-time class extraction (no runtime style injection). Custom utility classes handle elevation states (hover-elevate, active-elevate-2) for interactive elements.

**Animation Framework**: Framer Motion 11 provides declarative animations with built-in respect for `prefers-reduced-motion` media query. Parallax background animations and staggered component reveals enhance the cinematic feel.

**Component Library**: Radix UI primitives wrapped with custom styling for accessible, composable components. All interactive elements include proper ARIA labels, focus management, and keyboard navigation.

**Performance Patterns**:
- Route-based code splitting with React.lazy()
- Skeleton loading states for perceived performance
- Image lazy loading and responsive sizing
- Initial JS bundle target: ≤ 120KB gzipped
- Core Web Vitals targets: LCP ≤ 1.8s, CLS ≤ 0.1

**SEO Implementation**: react-helmet-async manages document head with OpenGraph tags, JSON-LD structured data (Organization, Product, FAQPage schemas), and canonical URLs for each route.

**Accessibility Features**:
- Skip link for keyboard navigation
- Focus trap in modals with automatic focus management
- WCAG 2.1 AA compliant color contrast (≥ 4.5:1)
- Comprehensive ARIA attributes and semantic HTML
- Visible focus indicators (2px orange ring)
- Screen reader announcements via aria-live regions

**Security Measures**:
- DOMPurify sanitization for all user-generated content
- Safe iframe component with allowlist (YouTube nocookie, Stripe checkout)
- Input sanitization utilities preventing XSS
- CSP-safe patterns (no unsafe-inline styles or scripts)

### Backend Architecture

**Server Framework**: Express.js with TypeScript providing RESTful API endpoints.

**Data Storage**: PostgreSQL database with Drizzle ORM for production-ready persistence. DatabaseStorage class implements all CRUD operations with proper transaction support and atomic operations for race-condition-free updates.

**Rate Limiting**: Atomic database-level rate limiting middleware enforces plan-based hourly limits using single-statement UPDATE with WHERE clause guards to prevent concurrent request double-counting. Rate limit windows reset after 1 hour.

**Generation Queue**: Request queuing system with job persistence, status tracking (pending/processing/completed/failed), and automatic rehydration of pending jobs on server restart. Implements retry logic for failed jobs.

**API Endpoints**:
- `/api/flags` - Feature flags configuration
- `/api/generate` - Generate AI application (rate-limited, queued)
- `/api/jobs/:id` - Get generation job status
- `/api/subscribe` - Email subscription creation
- `/api/usage/check` - Usage limit verification
- `/api/usage/increment` - Usage tracking and limit enforcement

**Data Models**:
- Users: Authentication, plan tier (free/pro/enterprise), usage tracking
- Email Subscriptions: Marketing email capture
- Analytics Events: Privacy-first event tracking with consent gating
- Feature Flags: Controlled feature rollout system

**Validation**: Zod schemas (defined in shared/schema.ts) validate all incoming API requests, ensuring type safety across frontend and backend.

**Development Server**: Vite dev server integrated as Express middleware for hot module replacement (HMR) in development. Production builds serve static assets from dist/public.

### Design System

**Visual Identity**: Cinematic gradient mesh background (orange → cyan → magenta) with grain texture overlay, creating depth and premium aesthetic inspired by Linear, Vercel, and Stripe.

**Glass Morphism Layer**: Foreground content rendered on `rgba(14, 14, 16, 0.85)` background with `backdrop-blur(6px)` creating elevated, floating interface effect.

**Typography**: Inter font family loaded from Google Fonts with display swap for performance. Minimum 16px body text ensures iOS keyboard doesn't trigger zoom.

**Responsive Breakpoints**: Optimized for 375px (mobile), 768px (tablet), and 1440px (desktop) viewports with proportional spacing reduction on smaller screens.

**Motion Design**: Parallax background animation, fade-in reveals, and elevation states on interaction. All motion respects system preferences via `prefers-reduced-motion` media query.

### Authentication & Authorization

**Authentication Stub**: Demo implementation using Zustand store with localStorage persistence. Includes `useAuth()` hook providing isAuthenticated, user object, and auth actions (login/logout).

**Plan-Based Access Control**: Three-tier system (Free: 10 generations/month, Pro: unlimited, Enterprise: custom). `ProtectedRoute` component enforces authentication requirements, while plan hierarchy determines feature access.

**Usage Tracking**: Real-time usage monitoring with 80% threshold warning (UsageWarning component) and limit enforcement (LimitReachedModal). Usage data refreshes every 30 seconds via React Query.

### Privacy & Analytics

**Consent Management**: ConsentBanner component implements cookie consent with three categories (functional, analytics, marketing). Analytics events only fire after user grants consent.

**Analytics Service**: First-party event tracking with queue-based architecture. Events stored in memory until consent is granted, then flushed to backend. Includes automatic cleanup and idle-time batching.

**Event Schema**: Standardized structure with name, timestamp, route, props, and consentGiven flag. All events include disclosure that AI-generated content may require review.

### Feature Management

**Feature Flags System**: Server-side configuration in MemStorage with client-side hooks (useFeatureFlags). Supports controlled rollouts of:
- PROMO_LAUNCH50: Promotional pricing
- PWA_ENABLED: Progressive Web App features
- I18N_ENABLED: Internationalization
- UPGRADE_MODAL_V2: Enhanced upgrade flow
- REFERRAL_ENABLED: Referral program
- AGENT_TEASERS_ENABLED: AI agent previews

**Internationalization Stub**: Simple translation system (i18n.ts) with locale support (en/es) ready for expansion. Currently demonstrates structure without full implementation.

### Progressive Web App (PWA)

**Service Worker** (`client/public/service-worker.js`): Network-first caching strategy with offline fallback. Precaches essential assets (/, /offline, /manifest.json) and caches successful responses for offline access. Shows offline page when network fails for navigation requests.

**Web App Manifest** (`client/public/manifest.json`): Complete PWA manifest with app metadata, theme colors (#f97316 orange primary, #0e0e10 background), app shortcuts, and production-ready PNG icons (72x72 to 512x512) with maskable purpose for adaptive icons.

**Offline Experience**: Dedicated offline page (`/offline`) displays when network connection fails. Includes retry button to attempt reconnection. Service worker automatically serves cached content when available.

**Install Prompts**: InstallPWA component captures and displays "Add to Home Screen" prompts when available. Appears as dismissible banner in bottom-right corner. User preferences persist in localStorage to prevent repeated prompts.

**PWA Utilities** (`client/src/utils/pwa.ts`): Service worker registration, install prompt management, PWA detection (standalone mode), and update notifications. Auto-checks for service worker updates hourly.

**Icon Generation**: PWA icons automatically generated as PNG bitmaps (72x72 to 512x512) using Sharp. SVG source files preserved for future modifications. Conversion script available at `scripts/convert-svg-to-png.mjs`.

## External Dependencies

### Third-Party Services

**Font Delivery**: Google Fonts (Inter family) with preconnect optimization and fallback system fonts.

**Payment Processing**: Stripe checkout integration prepared via SafeIframe allowlist, though full implementation not present in codebase.

**Video Embeds**: YouTube nocookie domain approved for privacy-friendly video embedding.

### Database

**ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in shared/schema.ts. Connection expects DATABASE_URL environment variable. Database operations use transactions for atomicity and proper error handling.

**Schema Structure**:
- users: Authentication, plan management, usage tracking
- emailSubscriptions: Marketing contacts
- analyticsEvents: Privacy-gated usage tracking
- generationJobs: AI generation requests with status tracking
- rateLimits: Hourly rate limit windows per user
- Feature flags managed in application memory

**Migration System**: Drizzle Kit configured with output to ./migrations directory. Use `npm run db:push` to sync schema changes safely.

### NPM Dependencies

**UI Components**: Radix UI primitives (@radix-ui/*) for accessible component foundations - accordion, alert-dialog, checkbox, dialog, dropdown-menu, navigation, popover, select, slider, switch, tabs, toast, tooltip.

**Validation**: Zod for schema validation, @hookform/resolvers for form integration.

**Utilities**: 
- class-variance-authority: Type-safe variant styling
- clsx/tailwind-merge: Conditional className composition
- cmdk: Command palette infrastructure
- date-fns: Date manipulation
- dompurify: HTML sanitization

**Development**: 
- Vite plugins: React, error overlay, Replit-specific tooling (cartographer, dev banner)
- TypeScript for type safety
- ESBuild for server bundling

### Environment Requirements

**Required Environment Variables**:
- DATABASE_URL: PostgreSQL connection string (required for persistence)
- SESSION_SECRET: Express session secret
- NODE_ENV: development|production

**Browser Targets**: Modern evergreen browsers with ES2020+ support. Graceful degradation for reduced motion preferences and missing features.

**Server Configuration**: Express server with CORS headers, JSON body parsing, and middleware for Vite dev server (development) or static file serving (production). Default port not specified in codebase (typically 5000 based on README).
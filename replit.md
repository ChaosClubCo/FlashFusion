# FlashFusion - AI-Powered Application Builder

## Overview

FlashFusion is a cinematic AI-powered development platform designed to rapidly transform ideas into full-stack applications. It functions as a production-ready landing page and marketing site showcasing AI development capabilities, featuring tiered pricing (Free, Pro, Enterprise) and usage-based access control. The platform emphasizes best-in-class web development practices, including WCAG 2.1 AA accessibility, CSP-safe patterns, and optimized performance. The project has completed its MVP, with all core features implemented and verified, including a robust frontend, PostgreSQL persistence with Drizzle ORM, atomic rate limiting, a persistent generation queue, PWA support, full internationalization, and comprehensive usage tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build**: React 18 with TypeScript and Vite.
**Routing**: Wouter for lightweight routing with lazy-loaded components.
**State Management**: Zustand for global state (especially authentication), React Query for server state and caching.
**Styling**: Tailwind CSS 3 with custom configuration extending shadcn/ui design tokens, utilizing CSS custom properties for theming.
**Animation**: Framer Motion 11 for declarative animations, respecting `prefers-reduced-motion`.
**Component Library**: Radix UI primitives for accessible, composable components.
**Performance**: Route-based code splitting, skeleton loading, image lazy loading, targeting small initial JS bundle and Core Web Vitals.
**SEO**: react-helmet-async for document head management, OpenGraph tags, JSON-LD, and canonical URLs.
**Accessibility**: Skip links, focus management, WCAG 2.1 AA compliance, ARIA attributes, semantic HTML, and visible focus indicators.
**Security**: DOMPurify for user content, safe iframe component with allowlist, input sanitization, and CSP-safe patterns.

### Backend Architecture

**Server Framework**: Express.js with TypeScript for RESTful API endpoints.
**Data Storage**: PostgreSQL with Drizzle ORM for persistence, supporting transactions and atomic operations.
**Rate Limiting**: Atomic database-level rate limiting middleware enforces plan-based hourly limits.
**Generation Queue**: Persistent request queuing system with status tracking and retry logic, rehydrating jobs on server restart.
**API Endpoints**: `/api/flags`, `/api/generate`, `/api/jobs/:id`, `/api/subscribe`, `/api/usage/check`, `/api/usage/increment`, `/api/workflows` (POST/GET/PATCH).
**Data Models**: Users, Email Subscriptions, Analytics Events, Feature Flags, Workflow Runs.
**Validation**: Zod schemas for request validation, ensuring type safety.
**Development Server**: Vite integrated as Express middleware for HMR.

### Workflow System

**Architecture**: Multi-step interactive wizard system with 6 complete workflows demonstrating platform capabilities.
**Components**: 
- WorkflowWizard: Reusable wizard shell with progress breadcrumbs and step navigation
- Zustand Store: Local state management with server UUID synchronization
- React Query Hooks: useCreateWorkflow, useUpdateWorkflow for API integration
**Workflows Implemented**:
1. AI-Powered Creation (4 steps): Select type → Configure → Auto-generate → Complete
2. One-Click Publishing (3 steps): Select platforms → Config → Deploy
3. Creator Commerce (3 steps): Revenue streams → Pricing → Activate
4. Smart Analytics (3 steps): Select metrics → Configure → Activate
5. Enterprise Security (2 steps): Security checks → Complete
6. Quality Assurance (3 steps): Run checks → Configure → Results
**Persistence**: Full CRUD via `/api/workflows` with Zod validation, MemStorage/DatabaseStorage implementations
**Features**: Auto-generation with progress tracking, server ID synchronization, step-by-step progress updates, completion status tracking

### Design System

**Visual Identity**: Cinematic gradient mesh background with grain texture, glass morphism for elevated content.
**Typography**: Inter font family from Google Fonts, minimum 16px body text.
**Responsive Design**: Optimized for mobile, tablet, and desktop viewports with proportional spacing.
**Motion Design**: Parallax, fade-in reveals, and elevation states, respecting `prefers-reduced-motion`.

### Authentication & Authorization

**Authentication**: Demo implementation using Zustand with localStorage persistence and a `useAuth()` hook.
**Plan-Based Access Control**: Three-tier system (Free, Pro, Enterprise) enforced by `ProtectedRoute` and plan hierarchy.
**Usage Tracking**: Real-time monitoring with warnings and limit enforcement, refreshing every 30 seconds.

### Privacy & Analytics

**Consent Management**: `ConsentBanner` gates analytics events based on user consent categories.
**Analytics Service**: First-party, queue-based event tracking, flushing to backend after consent.
**Event Schema**: Standardized structure including name, timestamp, route, props, and consent.

### Feature Management

**Feature Flags**: Server-side configuration with client-side hooks, supporting controlled rollouts of various features (e.g., PROMO_LAUNCH50, PWA_ENABLED, I18N_ENABLED).
**Internationalization**: React Context-based system for 5 languages (EN, ES, FR, DE, AR), auto-detecting language, persisting preference, and supporting RTL layouts with locale-specific formatting.

### Progressive Web App (PWA)

**Service Worker**: Network-first caching with offline fallback, precaching essential assets.
**Web App Manifest**: Complete PWA manifest with metadata, theme colors, shortcuts, and production-ready icons.
**Offline Experience**: Dedicated offline page with retry functionality.
**Install Prompts**: `InstallPWA` component manages "Add to Home Screen" prompts.
**Utilities**: Service worker registration, install prompt management, PWA detection, and update notifications.

## External Dependencies

### Third-Party Services

**Font Delivery**: Google Fonts (Inter family).
**Payment Processing**: Stripe checkout (via SafeIframe allowlist).
**Video Embeds**: YouTube nocookie.

### Database

**ORM**: Drizzle ORM for PostgreSQL.
**Schema Structure**: `users`, `emailSubscriptions`, `analyticsEvents`, `generationJobs`, `rateLimits`, `workflowRuns`.
**Migration System**: Drizzle Kit.

### NPM Dependencies

**UI Components**: Radix UI primitives.
**Validation**: Zod, @hookform/resolvers.
**Utilities**: `class-variance-authority`, `clsx`/`tailwind-merge`, `cmdk`, `date-fns`, `dompurify`.
**Development**: Vite plugins (React, error overlay), TypeScript, ESBuild.

### Environment Requirements

**Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`.
**Browser Targets**: Modern evergreen browsers.
**Server Configuration**: Express server with CORS, JSON parsing, and Vite/static file serving.
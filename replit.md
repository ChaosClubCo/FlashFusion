# FlashFusion - AI-Powered Application Builder

## Overview

FlashFusion is a cinematic AI-powered development platform designed to rapidly transform ideas into full-stack applications. It functions as a production-ready landing page and marketing site showcasing AI development capabilities, featuring tiered pricing (Free, Pro, Enterprise) and usage-based access control. The platform emphasizes best-in-class web development practices, including WCAG 2.1 AA accessibility, CSP-safe patterns, and optimized performance. The project has completed its MVP foundation with real AI code generation, and is now implementing authentication, payments, user dashboard, and download features.

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
**AI Integration**: Replit AI Integrations (OpenAI-compatible) with GPT-5 model for real code generation, no API key required, billed to credits.
**API Endpoints**: `/api/flags`, `/api/generate`, `/api/jobs/:id`, `/api/subscribe`, `/api/usage/check`, `/api/usage/increment`, `/api/workflows` (POST/GET/PATCH), `/api/generate-code` (POST with SSE streaming).
**Data Models**: Users, Email Subscriptions, Analytics Events, Feature Flags, Workflow Runs, Generated Projects.
**Validation**: Zod schemas for request validation, ensuring type safety.
**Development Server**: Vite integrated as Express middleware for HMR.

### Workflow System

**Architecture**: Multi-step interactive wizard system with 6 complete workflows demonstrating platform capabilities.
**Components**: 
- WorkflowWizard: Reusable wizard shell with progress breadcrumbs and step navigation
- Zustand Store: Local state management with server UUID synchronization
- React Query Hooks: useCreateWorkflow, useUpdateWorkflow for API integration
**Workflows Implemented**:
1. AI-Powered Creation (4 steps): Select type → Configure → **Real AI Generation** → Complete
2. One-Click Publishing (3 steps): Select platforms → Config → Deploy
3. Creator Commerce (3 steps): Revenue streams → Pricing → Activate
4. Smart Analytics (3 steps): Select metrics → Configure → Activate
5. Enterprise Security (2 steps): Security checks → Complete
6. Quality Assurance (3 steps): Run checks → Configure → Results
**Persistence**: Full CRUD via `/api/workflows` with Zod validation, MemStorage/DatabaseStorage implementations
**AI Generation Features**: 
- Real OpenAI GPT-5 integration via Replit AI Integrations
- Server-Sent Events (SSE) streaming for real-time progress updates
- Progress milestones: Initialize (10%) → Generating (30%) → Processing (80%) → Saving (95%) → Complete (100%)
- Database persistence of generated files, metadata (model, instructions, timestamp)
- Frontend displays real-time status and generated file list with sizes
- Robust SSE parsing with partial chunk buffering
- Error handling and graceful degradation

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
**Schema Structure**: `users`, `emailSubscriptions`, `analyticsEvents`, `generationJobs`, `rateLimits`, `workflowRuns`, `generatedProjects`.
**Migration System**: Drizzle Kit.
**Generated Projects Table**: Stores AI-generated code with user ID, workflow ID, title, description, project type, files (JSON), metadata (model, instructions, timestamp).

### NPM Dependencies

**UI Components**: Radix UI primitives.
**Validation**: Zod, @hookform/resolvers.
**Utilities**: `class-variance-authority`, `clsx`/`tailwind-merge`, `cmdk`, `date-fns`, `dompurify`.
**Development**: Vite plugins (React, error overlay), TypeScript, ESBuild.

### Environment Requirements

**Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-set by Replit).
**Browser Targets**: Modern evergreen browsers.
**Server Configuration**: Express server with CORS, JSON parsing, Vite/static file serving, and SSE support.

## Recent Changes

**December 2024 - AI Code Generation (Phase 1 Complete)**
- ✅ Added Replit AI Integrations blueprint for OpenAI-compatible API access
- ✅ Implemented `/api/generate-code` endpoint with Server-Sent Events streaming
- ✅ Added `generatedProjects` database table with files, metadata, and workflow tracking
- ✅ Updated AI Creation workflow to use real GPT-5 model with streaming progress
- ✅ Robust SSE parsing with partial chunk buffering to prevent JSON parse errors
- ✅ Database persistence of all generated projects with project ID returned for downloads
- ✅ Error handling for OpenAI failures with graceful degradation
- ✅ Architect-approved implementation meeting production-ready standards

**Next Priorities**:
1. Authentication - Replace demo auth with Replit Auth (Google, GitHub, email/password)
2. Payments - Integrate Stripe for subscription management and plan upgrades
3. User Dashboard - Build dashboard with workflow history, usage stats, and project library
4. Download/Export - Enable users to download generated code as zip files
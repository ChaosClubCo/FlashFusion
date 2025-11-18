# FlashFusion - AI-Powered Application Builder

## Overview
FlashFusion is a cinematic AI-powered development platform designed to rapidly transform ideas into full-stack applications. It functions as a production-ready landing page and marketing site showcasing AI development capabilities, featuring tiered pricing (Free, Pro, Enterprise) and usage-based access control. The platform emphasizes best-in-class web development practices, including WCAG 2.1 AA accessibility, CSP-safe patterns, and optimized performance. The project has completed its MVP foundation with real AI code generation, and is now implementing authentication, payments, user dashboard, and download features.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for lightweight routing with lazy-loaded components.
- **State Management**: Zustand for global state, React Query for server state and caching.
- **Styling**: Tailwind CSS 3 with custom configuration extending shadcn/ui design tokens, utilizing CSS custom properties for theming.
- **Animation**: Framer Motion 11 for declarative animations, respecting `prefers-reduced-motion`.
- **Component Library**: Radix UI primitives for accessible, composable components.
- **Performance**: Route-based code splitting, skeleton loading, image lazy loading, targeting small initial JS bundle and Core Web Vitals.
- **SEO**: react-helmet-async for document head management, OpenGraph tags, JSON-LD, and canonical URLs.
- **Accessibility**: WCAG 2.1 AA compliance, ARIA attributes, semantic HTML, and visible focus indicators.
- **Security**: DOMPurify for user content, safe iframe component with allowlist, input sanitization, and CSP-safe patterns.

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for RESTful API endpoints.
- **Data Storage**: PostgreSQL with Drizzle ORM.
- **Rate Limiting**: Atomic database-level rate limiting middleware.
- **Generation Queue**: Persistent request queuing system with status tracking and retry logic.
- **AI Integration**: Replit AI Integrations (OpenAI-compatible) with GPT-5 model for real code generation.
- **API Endpoints**: `/api/flags`, `/api/generate`, `/api/jobs/:id`, `/api/subscribe`, `/api/usage/check`, `/api/usage/increment`, `/api/workflows`, `/api/generate-code` (with SSE streaming), `/api/projects`, `/api/projects/:id/download`.
- **Data Models**: Users, Email Subscriptions, Analytics Events, Feature Flags, Workflow Runs, Generated Projects.
- **Validation**: Zod schemas for request validation.
- **Development Server**: Vite integrated as Express middleware for HMR.

### Workflow System
- **Architecture**: Multi-step interactive wizard system with 6 complete workflows.
- **Components**: WorkflowWizard, Zustand Store for local state, React Query Hooks for API integration.
- **AI Generation Features**: Real OpenAI GPT-5 integration via Replit AI Integrations, Server-Sent Events (SSE) streaming for real-time progress, database persistence of generated files and metadata.

### Design System
- **Visual Identity**: Cinematic gradient mesh background with grain texture, glass morphism.
- **Color Scheme**: Blue primary (217 91% 60%), Orange accent (24 95% 53%).
- **Typography**: Inter font family, minimum 16px body text.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Motion Design**: Parallax, fade-in reveals, and elevation states, respecting `prefers-reduced-motion`.

### Authentication & Authorization
- **Authentication**: Replit Auth with OIDC integration supporting email/password + social OAuth.
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple with 1-week TTL.
- **Development Bypass**: Auto-authenticates with demo user in dev environment.
- **Security**: Environment-aware cookie configuration, CORS with credential support and origin validation.
- **Frontend Integration**: `useAuth()` hook provides `{ user, isLoading, isAuthenticated }`.
- **Plan-Based Access Control**: Three-tier system (Free, Pro, Enterprise) enforced by database-level rate limiting and usage tracking.

### Privacy & Analytics
- **Consent Management**: `ConsentBanner` gates analytics events based on user consent.
- **Analytics Service**: First-party, queue-based event tracking.

### Feature Management
- **Feature Flags**: Server-side configuration with client-side hooks for controlled rollouts.
- **Internationalization**: React Context-based system for 5 languages (EN, ES, FR, DE, AR), with auto-detection, preference persistence, and RTL support.

### Progressive Web App (PWA)
- **Service Worker**: Network-first caching with offline fallback, precaching assets.
- **Web App Manifest**: Complete PWA manifest with metadata, theme colors, shortcuts, and icons.
- **Offline Experience**: Dedicated offline page with retry functionality.
- **Install Prompts**: `InstallPWA` component manages "Add to Home Screen" prompts.

## External Dependencies

### Third-Party Services
- **Font Delivery**: Google Fonts (Inter family).
- **Payment Processing**: Stripe checkout (via SafeIframe allowlist).
- **Video Embeds**: YouTube nocookie.

### Database
- **ORM**: Drizzle ORM for PostgreSQL.
- **Schema Structure**: `users`, `emailSubscriptions`, `analyticsEvents`, `generationJobs`, `rateLimits`, `workflowRuns`, `generatedProjects`.
- **Migration System**: Drizzle Kit.

### NPM Dependencies
- **UI Components**: Radix UI primitives.
- **Validation**: Zod, @hookform/resolvers.
- **Utilities**: `class-variance-authority`, `clsx`/`tailwind-merge`, `cmdk`, `date-fns`, `dompurify`.
- **Development**: Vite plugins, TypeScript, ESBuild.

### Environment Requirements
- **Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`.
- **Browser Targets**: Modern evergreen browsers.
- **Server Configuration**: Express server with CORS, JSON parsing, Vite/static file serving, and SSE support.
# FlashFusion Design Guidelines

## Design Approach
**Reference-Based (Cinematic Tech Platform)**: Drawing inspiration from Linear, Vercel, and Stripe's modern developer tool aesthetics with a distinctive cinematic twist. This is an experience-focused platform where visual impact drives conversion.

## Core Design Elements

### A. Color Palette

**Gradient Mesh Background**
- Orange → Cyan → Magenta gradient mesh
- Grain texture overlay at 5% opacity
- Creates depth and premium feel

**Glass Morphism Layer**
- Foreground: `rgba(14, 14, 16, 0.85)` with `backdrop-blur(6px)`
- Creates floating, elevated interface over cinematic background

**Brand Colors**
- Primary CTA: Orange (vibrant, energetic)
- Focus States: Orange, 2px ring
- Text: High contrast white/near-white on dark surfaces

### B. Typography

**Font System**
- Google Fonts via stylesheet
- Display swap for performance
- Font Loading API fallback
- Headings: Bold, impactful weights
- Body: Readable, 16px minimum (iOS keyboard requirement)

**Hierarchy**
- H1: "Build Apps 10× Faster with AI" - Hero statement
- Subheadings: Feature descriptions, section titles
- Body: Clear, scannable supporting copy
- Labels: Metrics, badges, status indicators

### C. Layout System

**Spacing Primitives** (Tailwind units)
- Vertical stack gap: 64 (16rem)
- Section padding: 160 (40rem) vertical
- Card/component spacing: 16, 24, 32 for internal elements
- Responsive: Reduce by 50% on mobile (375px)

**Viewport Strategy**
- Use `100dvh` with `vh` fallback (iOS hardening)
- Sections flow naturally, not forced into viewport heights
- Z-index layering: Background (0) → Foreground glass (10) → Modals (50)

**Grid System**
- Features: 2-column → 1-column responsive (768px breakpoint)
- Metrics: 6-stat display with equal distribution
- Build Process: 5-card timeline, horizontal scroll on mobile
- Pricing: 3-tier layout, stack on mobile

### D. Component Library

**Hero Section**
- Large H1 with supporting subtitle
- Dual CTAs: Primary (orange, solid) + Secondary (outline with blur background)
- Email capture field (≥16px input)
- Trust badges: "Free tier • 2-min setup • No card"
- Skeleton state during font load

**Metrics Dashboard**
- 6 live statistics (Visitors, Demos, Developers, Apps, Uptime, Rating)
- Staggered animation: 50ms delay between items
- ARIA labels for accessibility
- Live region for screen readers

**Feature Cards**
- 4 primary features in grid
- Icon + Title + Description format
- Glass morphism styling
- Empty state with CTA when content missing

**Build Process Timeline**
- 5 steps: Describe → Analyze → Generate → Test → Deploy
- Sequential visual flow
- Step numbers and descriptions
- Progress indication

**Usage Controls**
- UsageWarning: Appears at 80% limit threshold
- LimitReachedModal: Full-screen overlay with focus trap
- Keyboard-operable, visible focus states
- Upgrade path CTAs

**Navigation**
- Header: Logo, primary navigation, skip link (visible on focus)
- Footer: Legal links, consent banner trigger, status indicator
- StatusPill: Shows system health in header

**Forms & Inputs**
- Minimum 16px font size (iOS requirement)
- Clear labels and placeholders
- Focus rings: 2px orange
- Error states with helpful copy

### E. Animations & Motion

**Parallax Background**
- Background Y: 0 → -64px
- Loop: 30s linear
- **Disabled when `prefers-reduced-motion`** - static gradient instead

**Entrance Animations** (Framer Motion)
- Metrics: Stagger 50ms per item
- Feature cards: Fade up on scroll
- All respect reduced-motion preference

**Micro-interactions**
- Button hover states (built-in, no custom needed)
- Loading skeletons for content
- Smooth transitions between states

**Performance Constraint**
- Animations minimal and purposeful
- Never impact LCP or CLS metrics
- Command palette hint renders after idle

### F. Accessibility Requirements

**WCAG 2.1 AA Compliance**
- Contrast ratio ≥ 4.5:1
- Skip link to `#main` (visible on focus)
- Focus trap in modals with `aria-modal="true"`
- Keyboard navigation: Header → Main → Footer
- VoiceOver: Correct reading order

**Focus Management**
- 2px orange focus rings on all interactive elements
- Modal focus trap implementation
- Tab order follows visual hierarchy

**Reduced Motion**
- Toggle in QA panel
- Badge indicator when active
- All animations respect system preference

## Images

**Hero Section**
- Large hero image showcasing AI-generated app examples or abstract tech visualization
- WebP format with PNG fallback
- Srcset for responsive sizing: 768w, 1440w, 1920w
- Sizes: `(max-width: 768px) 100vw, 1440px`
- Loading: `eager` (above fold)
- Decoding: `async`
- Alt: Descriptive text about FlashFusion's capabilities

**Feature Cards**
- Icon-based illustrations (use icon libraries: Heroicons or Lucide)
- No custom SVG generation

**Open Graph Image**
- `public/og/default.png` - 1200×630px
- Shows FlashFusion branding and key value proposition

**Background Texture**
- `public/grain.png` - Seamless grain texture at 5% opacity
- Overlays gradient mesh for premium feel

## Trust & Polish Elements

**Social Proof**
- Metrics prominently displayed
- Rating with stars (AggregateRating schema)
- Trust badges in hero

**Consent & Privacy**
- ConsentBanner: Cookie consent + AI disclosure
- "⚠︎ AI-generated content may require review" notice near outputs
- Privacy-first messaging throughout

**Professional Polish**
- Error boundaries with helpful copy
- 404 page with clear navigation back
- Loading states with branded skeletons
- Graceful degradation for all features

**Legal Pages**
- Privacy, Terms, Status - clean, readable layouts
- Maximum prose width for text content
- Clear hierarchy and navigation

This design system creates a **cinematic, premium developer experience** that balances visual impact with performance, accessibility, and enterprise-grade polish.
# FlashFusion Design Guidelines

## Design Approach
**Professional Platform Identity**: Based on app.base44 design system featuring a clean, modern aesthetic with blue/orange branding. Emphasizes clarity, professional polish, and universal app generation capabilities with a focus on AI orchestration and workflow automation.

## Core Design Elements

### A. Color Palette

**Primary Brand Colors**
- **Primary Blue**: `hsl(217 91% 60%)` - Main brand color, used for primary CTAs and branding
- **Primary Orange**: `hsl(24 95% 53%)` - Accent color, used for secondary CTAs and highlights
- **Cyan Accent**: `hsl(187 85% 50%)` - Supporting brand color for visual interest
- **Magenta Accent**: `hsl(330 85% 55%)` - Tertiary accent for special highlights

**Neutral Palette**
- **Dark Background**: `hsl(0 0% 7%)` - Primary dark background
- **Card Background**: `hsl(0 0% 9%)` - Elevated surface color
- **Light Background**: `hsl(0 0% 98%)` - Primary light background
- **Foreground Text**: `hsl(0 0% 95%)` (dark mode), `hsl(0 0% 9%)` (light mode)

**Functional Colors**
- **Success**: Blue primary for confirmed actions
- **Warning**: Orange for attention-requiring items
- **Error**: `hsl(0 84% 45%)` - Destructive actions
- **Info**: Cyan for informational messages

### B. Typography

**Font System**
- **Primary Font**: Inter (Google Fonts) - Used for all text
- Display swap for performance
- Minimum 16px for body text (iOS keyboard requirement)
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold)

**Hierarchy**
- **H1**: 48px-72px - Main headlines "FlashFusion - Universal App Generator"
- **H2**: 36px-48px - Section headings
- **H3**: 24px-30px - Subsection titles
- **Body**: 16px-18px - Main content, descriptions
- **Small**: 14px - Supporting text, labels
- **Caption**: 12px - Metadata, timestamps

**Text Colors**
- **Primary**: Default foreground color
- **Secondary**: `hsl(var(--muted-foreground))` for supporting text
- **Accent**: Blue or Orange for emphasized text

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
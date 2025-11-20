# FlashFusion Design Guidelines - Hybrid Light/Dark Theme

## Design Approach
**Hybrid Professional Platform**: FlashFusion uses a dual-theme system combining the best of both worlds:
- **Landing Page**: Clean light aesthetic (matching fusion-ai.base44.app) with cinematic hero background image, subtle pastel gradients, and accessible dark text on light backgrounds
- **Dashboards**: Cinematic gradient theme transitioning from light at the top to Deep Midnight (`#0A0F1C`) at the bottom, with Neon Fusion Blue (`#00C2FF`) and Fusion Orange (`#FF6A3D`) accents matching the official FlashFusion Brand Kit

This approach prioritizes accessibility for first-time visitors while delivering a premium, cinematic "power user" experience for authenticated members.

## Core Design Elements

### A. Color Palette

**Primary Brand Colors**
- **Primary Blue**: `hsl(217 91% 60%)` - Used for accents, links, and highlights
- **Accent Orange**: `hsl(24 95% 53%)` - Primary CTAs, badges, and important actions
- **Cyan Accent**: `hsl(187 85% 50%)` - Supporting highlights and visual interest
- **Purple Accent**: `hsl(280 75% 65%)` - Tertiary accent for special elements

**Light Clean Background System**
- **Background**: `hsl(0 0% 98%)` - Clean off-white, primary background
- **Card Background**: `hsl(0 0% 100%)` - White cards, slightly elevated
- **Border**: `hsl(0 0% 89%)` - Subtle gray borders and separators
- **Card Border**: `hsl(0 0% 91%)` - Card-specific borders

**Gradient Text Effects**
- **Gradient Gold**: `hsl(45 93% 58%)` - "Reality" in hero headline
- **Gradient Cyan**: `hsl(187 85% 60%)` - "With" in hero headline
- **Gradient Purple**: `hsl(280 75% 65%)` - "AI" in hero headline
- Usage: `bg-gradient-to-r from-[hsl(var(--gradient-gold))] via-[hsl(var(--gradient-text-cyan))] to-[hsl(var(--gradient-text-purple))] bg-clip-text text-transparent`

**Text Colors**
- **Foreground**: `hsl(0 0% 9%)` - Primary dark text color
- **Muted Foreground**: `hsl(0 0% 40%)` - Secondary/supporting gray text

**Colored Icon Backgrounds** (for feature cards)
- Orange: `from-accent to-accent/80` - AI Code Generation
- Pink: `from-pink-500 to-pink-600` - Content Creation, Analytics
- Red: `from-red-500 to-red-600` - One-Click Deploy
- Green: `from-green-500 to-green-600` - Revenue Streams
- Purple: `from-purple-500 to-purple-600` - Enterprise Security
- Blue: `from-blue-500 to-blue-600` - Analytics & Insights, Publishing
- Cyan: `from-cyan-500 to-cyan-600` - Quality Assurance

### B. Typography

**Font System**
- **Primary Font**: Inter (Google Fonts) - Used for all text
- Display swap for performance
- Minimum 16px for body text

**Hierarchy**
- **H1 Hero**: 96px (6xl/7xl/8xl) - "Transform Ideas Into Reality With AI"
- **H2 Sections**: 60px-72px (4xl/5xl) - Section headings
- **H3 Cards**: 24px (2xl) - Card titles
- **Body**: 16px-20px (base/lg/xl) - Main content, descriptions
- **Small**: 14px - Supporting text, labels, metadata
- **Caption**: 12px (xs) - Metadata, timestamps

### C. Layout System

**Spacing Primitives**
- Section vertical padding: `py-16` to `py-20` (4rem to 5rem)
- Container max-width: `max-w-7xl` (1280px) for most sections, `max-w-4xl` for FAQ
- Card/component spacing: `gap-6` to `gap-8` between grid items
- Internal card padding: Standard Card component defaults
- Responsive: Stack on mobile, grid on tablet/desktop

**Viewport Strategy**
- Sections flow naturally, not forced into viewport heights
- Use `min-h-screen` only on outer container
- Z-index layering: Background (-10) → Content (0) → Modals (50)

**Grid System**
- Features: 3-column on desktop (`md:grid-cols-2 lg:grid-cols-3`), stack on mobile
- Pricing: 3-column on desktop (`md:grid-cols-3`), stack on mobile
- Workflows: 3-column on desktop (`md:grid-cols-2 lg:grid-cols-3`), stack on mobile
- FAQ categories: 2-column mobile, 3-column desktop (`grid-cols-2 md:grid-cols-3`)

### D. Component Library

**Hero Section**
- Promotional banner with gradient background and gift icon
- Secondary "Join 10,000+ creators" banner
- Large gradient headline: "Transform Ideas Into **Reality With AI**"
- Subtitle with orange accent text for "production-ready applications"
- Feature pills with colored dots (orange, cyan, purple)
- Dual CTAs: Primary orange with 50% OFF badge + Outline demo button
- Glass morphism styling: `bg-card/50 backdrop-blur-sm border border-border`

**Video Preview Section**
- Gradient background: `linear-gradient(135deg, hsla(217, 50%, 15%, 0.4) 0%, hsla(187, 50%, 20%, 0.4) 100%)`
- Corner icons in colored rounded squares (orange, cyan, pink, purple)
- Central play button: Large gradient orange circle with play icon
- Stats cards: 3-column grid showing "10,000+", "50M+", "99.9%"
- Trust badges: Company names in muted text

**Feature Cards**
- 6 cards in responsive grid
- Colored icon backgrounds (12x12 rounded-lg with gradient)
- Title + description format
- Colored badges matching icon theme
- "Learn more" links in accent color
- Glass morphism: `bg-card/80 backdrop-blur-sm border-border`
- Hover elevation: `hover-elevate` class

**Pricing Cards**
- Promotional banner at top with 50% OFF messaging
- 3-tier layout: Starter Pro, Professional Pro (Most Popular), Enterprise Pro
- Badge positions: top-left for 50% OFF, top-center for Popular, top-right for Enterprise
- Price display: Large current price + strikethrough original + "/mo"
- "View plans & options" button with ChevronDown icon
- Feature list with checkmark icons
- Professional Pro has gradient background and accent border for emphasis
- Guarantees section below with checkmarks and support icons

**Workflows Showcase**
- Gradient headline with "FlashFusion Complete" in gradient colors
- 6 workflow cards in responsive grid
- Each card: Colored icon (12x12) + Title + Description + Time/Complexity badges + Orange "Start Workflow" button
- Time format: Clock icon + "2-5 minutes"
- Complexity badges: "Simple" or "Medium" in outline style

**FAQ Section**
- Pink question mark icon in circle
- Search bar with magnifying glass icon
- Category tabs with emojis (📋 💬 💰 ✨ ⚙️ 🔒)
- Accordion items with glass morphism backgrounds
- "Contact Support" button at bottom

**Navigation (Existing)**
- Header: Logo, primary navigation, Sign In / Sign Up buttons
- Orange "Sign Up" button, outline "Sign In" button
- "Try Interactive Demo" button with play icon

### E. Animations & Motion

**Entrance Animations** (Framer Motion)
- Hero elements: Stagger with 0.1s delays
- Scroll-triggered: `whileInView` with `once: true`
- All respect `prefers-reduced-motion` preference

**Parallax Background**
- Subtle vertical movement: 0 → -64px over 30s
- Disabled when `prefers-reduced-motion` active
- Light gradient mesh with subtle pastel blue, cyan, orange, and purple accents

**Micro-interactions**
- Button hover states (built-in via `hover-elevate`)
- Card hover elevation
- Smooth transitions between states

### F. Accessibility Requirements

**WCAG 2.1 AA Compliance**
- Contrast ratio ≥ 4.5:1 for all text
- Focus indicators on all interactive elements
- Keyboard navigation support
- ARIA labels on complex components

**Focus Management**
- Visible focus rings on interactive elements
- Tab order follows visual hierarchy
- Modal focus trap implementation

**Data Test IDs**
All interactive elements and important content areas have `data-testid` attributes:
- Sections: `section-hero`, `section-video-preview`, `section-features`, `section-pricing`, `section-workflows`, `section-faq`
- Banners: `banner-promo`, `banner-users`, `banner-pricing-promo`
- Headings: `heading-hero`, `heading-features`, `heading-pricing`, `heading-faq`
- Cards: `card-feature-[name]`, `card-pricing-[tier]`, `card-workflow-[name]`
- Buttons: `button-get-started`, `button-try-demo`, `button-pricing-[tier]`, `button-workflow-[name]`, etc.
- Inputs: `input-faq-search`
- Category buttons: `button-faq-category-[id]`
- Accordion: `accordion-faq`, `faq-trigger-[n]`

## Key UI Patterns

### Glass Morphism
Used throughout for elevated content:
```tsx
className="bg-card/80 backdrop-blur-sm border border-border"
```

### Gradient Backgrounds
For promotional banners and special sections:
```tsx
className="bg-gradient-to-r from-pink-500/20 to-pink-600/20 backdrop-blur-md border border-pink-500/30"
```

### Colored Icon Containers
12x12 rounded squares with gradient backgrounds:
```tsx
<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
  <Icon className="w-6 h-6 text-accent-foreground" />
</div>
```

### Badge Patterns
- Promotional: `bg-pink-500 text-white border-0` (50% OFF badges - white text on colored background)
- Feature status: `bg-[color]-500/20 text-[color]-700 border-0` (darker text for light theme visibility)
- Outline: `variant="outline"` for complexity indicators

### Pricing Display
```tsx
<div className="flex items-baseline gap-2">
  <span className="text-4xl font-bold">$14.50</span>
  <span className="text-muted-foreground line-through">$29</span>
  <span className="text-sm text-muted-foreground">/mo</span>
</div>
```

## Content Guidelines

### Hero Headline
Exact text: "Transform Ideas Into **Reality With AI**"
- "Transform Ideas Into" in dark foreground color (`text-foreground`)
- "Reality With AI" in gradient (gold → cyan → purple)

### Promotional Messaging
- "Limited Time Launch Offer: **50% OFF** for 4 months"
- "Join **10,000+** creators building the future"
- "Limited spots available" urgency badge

### Feature Card Badges
- AI Code Generation: "99.9% accuracy"
- Content Creation: "No limits"
- One-Click Deploy: "Instant deploy"
- Revenue Streams: "Up to $5,000/mo"
- Enterprise Security: "100% secure"
- Analytics & Insights: "Real-time data"

### Pricing Tiers
1. **Starter Pro** - $14.50/mo (was $29) - "For indie innovators"
2. **Professional Pro** - $39.50/mo (was $79) - "Best for growing businesses" (Most Popular)
3. **Enterprise Pro** - $99.50/mo (was $199) - "For large organizations"

### Stats
- **10,000+** Active Creators
- **50M+** Lines of Code Generated
- **99.9%** Uptime

## Trust & Polish Elements

**Social Proof**
- Metrics prominently displayed in video section
- Company trust badges (TechCorp, Innovate Co, Digital Agency, Creative Studio, StartupLab)
- "Trusted by innovative teams worldwide"

**Guarantees** (in pricing section)
- ✓ 30-day money-back guarantee
- ✗ Cancel anytime
- 🛡️ 24/7 support included

**Professional Polish**
- Glass morphism throughout
- Consistent hover states with `hover-elevate`
- Smooth animations respecting motion preferences
- Comprehensive error handling
- Loading states with branded skeletons

This design system creates a **professional, modern light SaaS platform** that balances clean aesthetics with usability, accessibility, and trust-building elements.

# AgentTeasers Integration Guide

## Quick Start

Add the AgentTeasers component to your Landing page in 2 simple steps:

### Step 1: Import the Component

Add this import at the top of `/home/user/FlashFusion/client/src/pages/Landing.tsx`:

```typescript
import { AgentTeasers } from '@/components/AgentTeasers';
```

### Step 2: Add to the Page

Insert the component in the main section, between Features and BuildProcess:

```typescript
<main id="main">
  <Hero onGenerate={handleGenerate} />

  {/* Usage Warning */}
  {usageData && usageData.percentage >= 80 && (
    <div className="px-4 mb-8 max-w-6xl mx-auto">
      <UsageWarning
        currentUsage={usageData.currentUsage}
        limit={usageData.usageLimit}
      />
    </div>
  )}

  <Metrics />
  <Features />

  {/* 👇 Add the AgentTeasers component here */}
  <AgentTeasers />

  <BuildProcess />
</main>
```

## Complete Integration Example

Here's the complete Landing.tsx with AgentTeasers integrated:

```typescript
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';
import { Hero } from '@/components/Hero';
import { Metrics } from '@/components/Metrics';
import { Features } from '@/components/Features';
import { AgentTeasers } from '@/components/AgentTeasers'; // ✅ Add this import
import { BuildProcess } from '@/components/BuildProcess';
import { ConsentBanner } from '@/components/ConsentBanner';
import { CommandPaletteHint } from '@/components/CommandPaletteHint';
import { UsageWarning } from '@/components/UsageWarning';
import { LimitReachedModal } from '@/components/LimitReachedModal';
import { useAuth } from '@/hooks/useAuth';
import { useUsageCheck, useUsageIncrement } from '@/hooks/useUsageTracking';
import { queryClient } from '@/lib/queryClient';
import { analytics } from '@/utils/events';

export default function Landing() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { data: usageData } = useUsageCheck(user?.id || '', isAuthenticated);
  const incrementMutation = useUsageIncrement();

  useEffect(() => {
    analytics.track('landing_view');
  }, []);

  const handleGenerate = () => {
    if (!user) return;

    if (usageData?.isAtLimit) {
      setShowLimitModal(true);
      return;
    }

    analytics.track('generation_started');

    incrementMutation.mutate(user.id, {
      onSuccess: () => {
        analytics.track('generation_completed');
      },
      onError: (error: any) => {
        if (user) {
          queryClient.invalidateQueries({ queryKey: ['/api/usage/check', user.id] });
        }

        if (error?.status === 403) {
          setShowLimitModal(true);
        }
      },
    });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'FlashFusion',
        url: 'https://flashfusion.dev',
        logo: 'https://flashfusion.dev/og/default.png',
        description: 'AI-powered development platform creating production-ready apps in minutes.',
      },
      {
        '@type': 'Product',
        name: 'FlashFusion',
        description: 'Build Apps 10× Faster with AI - Transform ideas into production-ready applications in minutes.',
        brand: {
          '@type': 'Organization',
          name: 'FlashFusion',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1250',
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>FlashFusion – Build Apps 10× Faster with AI</title>
        <meta name="description" content="AI-powered development platform creating production-ready apps in minutes. Transform your ideas into full-stack applications with no coding required." />
        <link rel="canonical" href="https://flashfusion.dev" />

        <meta property="og:title" content="FlashFusion – Build Apps 10× Faster with AI" />
        <meta property="og:description" content="AI-powered development platform creating production-ready apps in minutes." />
        <meta property="og:image" content="https://flashfusion.dev/og/default.png" />
        <meta property="og:url" content="https://flashfusion.dev" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FlashFusion – Build Apps 10× Faster with AI" />
        <meta name="twitter:description" content="AI-powered development platform creating production-ready apps in minutes." />
        <meta name="twitter:image" content="https://flashfusion.dev/og/default.png" />

        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div
          className="relative z-10 px-0"
          style={{
            background: 'rgba(14, 14, 16, 0.85)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <main id="main">
            <Hero onGenerate={handleGenerate} />

            {/* Usage Warning */}
            {usageData && usageData.percentage >= 80 && (
              <div className="px-4 mb-8 max-w-6xl mx-auto">
                <UsageWarning
                  currentUsage={usageData.currentUsage}
                  limit={usageData.usageLimit}
                />
              </div>
            )}

            <Metrics />
            <Features />

            {/* ✅ AgentTeasers Component */}
            <AgentTeasers />

            <BuildProcess />
          </main>
        </div>
      </div>

      <ConsentBanner />
      <CommandPaletteHint />

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => {
          analytics.track('upgrade_click', { source: 'limit_modal' });
          window.location.href = '/pricing';
        }}
      />
    </>
  );
}
```

## Alternative Placements

### Option 1: After Hero (High Visibility)
```typescript
<main id="main">
  <Hero onGenerate={handleGenerate} />
  <AgentTeasers /> {/* High visibility placement */}
  <Metrics />
  <Features />
  <BuildProcess />
</main>
```

### Option 2: Before BuildProcess (Flow)
```typescript
<main id="main">
  <Hero onGenerate={handleGenerate} />
  <Metrics />
  <Features />
  <AgentTeasers /> {/* Natural flow */}
  <BuildProcess />
</main>
```

### Option 3: As Last Section (Pre-footer)
```typescript
<main id="main">
  <Hero onGenerate={handleGenerate} />
  <Metrics />
  <Features />
  <BuildProcess />
  <AgentTeasers /> {/* Final CTA */}
</main>
```

## Standalone Page

You can also create a dedicated demo page:

```typescript
// /home/user/FlashFusion/client/src/pages/AIDemo.tsx
import { Helmet } from 'react-helmet-async';
import { AgentTeasers } from '@/components/AgentTeasers';
import { Background } from '@/components/Background';

export default function AIDemo() {
  return (
    <>
      <Helmet>
        <title>AI Code Generation Demo - FlashFusion</title>
        <meta name="description" content="See FlashFusion AI agents in action. Watch as AI generates production-ready code in real-time." />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div className="relative z-10">
          <AgentTeasers />
        </div>
      </div>
    </>
  );
}
```

## Customization Options

### Adjust Section Spacing

Add custom spacing around the component:

```typescript
<div className="my-16 md:my-24">
  <AgentTeasers />
</div>
```

### Add a Divider

Add visual separation:

```typescript
<Separator className="my-12" />
<AgentTeasers />
<Separator className="my-12" />
```

### Add Custom Background

Wrap with custom styling:

```typescript
<div className="bg-gradient-to-b from-background via-primary/5 to-background">
  <AgentTeasers />
</div>
```

## SEO Optimization

The component is SEO-friendly and works with SSR. To enhance SEO:

### Update JSON-LD

Add to the existing jsonLd in Landing.tsx:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // ... existing items
    {
      '@type': 'SoftwareApplication',
      name: 'FlashFusion AI Code Generator',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'AI-powered code generation',
        'Real-time code preview',
        'Multiple programming languages',
        'Syntax highlighting',
        'Copy to clipboard',
      ],
    },
  ],
};
```

## Analytics Tracking

Add analytics to track user interactions:

```typescript
import { analytics } from '@/utils/events';

// Track when users view the section
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        analytics.track('agent_teasers_viewed');
      }
    },
    { threshold: 0.5 }
  );

  const element = document.querySelector('[data-component="agent-teasers"]');
  if (element) observer.observe(element);

  return () => observer.disconnect();
}, []);
```

## Performance Tips

1. **Lazy Loading**: The component is already optimized, but for very large pages:

```typescript
import { lazy, Suspense } from 'react';

const AgentTeasers = lazy(() => import('@/components/AgentTeasers').then(m => ({ default: m.AgentTeasers })));

// In your JSX:
<Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
  <AgentTeasers />
</Suspense>
```

2. **Viewport Loading**: Only load when in viewport:

```typescript
import { useInView } from 'framer-motion';

function Landing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div ref={ref}>
      {isInView && <AgentTeasers />}
    </div>
  );
}
```

## Testing

After integration, test:

1. **Mobile Responsiveness**: Check on mobile devices
2. **Animation Performance**: Ensure smooth 60fps animations
3. **Code Copying**: Test clipboard functionality
4. **Example Switching**: Verify all examples load correctly
5. **Typing Animation**: Check the typing effect works smoothly
6. **Loading States**: Test the "Try It Now" button interaction

## Troubleshooting

### Component Not Showing

1. Check imports are correct
2. Verify component is inside the main element
3. Check z-index conflicts with Background component

### Animations Not Working

1. Ensure Framer Motion is installed: `npm list framer-motion`
2. Check browser supports CSS transforms
3. Verify no conflicting CSS

### Styles Not Applied

1. Check Tailwind classes are being processed
2. Verify shadcn/ui components are installed
3. Check custom theme variables in globals.css

## Next Steps

After integration:

1. Test the component on your landing page
2. Adjust positioning based on user flow
3. Add analytics tracking for user interactions
4. Consider A/B testing different placements
5. Monitor conversion rates from the section
6. Customize examples based on your target audience

## Support

Component files:
- Main Component: `/home/user/FlashFusion/client/src/components/AgentTeasers.tsx`
- Demo Page: `/home/user/FlashFusion/client/src/components/AgentTeasersDemo.tsx`
- Documentation: `/home/user/FlashFusion/client/src/components/AgentTeasers.md`

All dependencies are already installed in FlashFusion, no additional packages needed!

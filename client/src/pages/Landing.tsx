import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';
import { Hero } from '@/components/Hero';
import { Metrics } from '@/components/Metrics';
import { Features } from '@/components/Features';
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
    
    // Check limit before attempting generation
    if (usageData?.isAtLimit) {
      setShowLimitModal(true);
      return;
    }

    // Only track and mutate if not at limit
    analytics.track('generation_started');
    
    incrementMutation.mutate(user.id, {
      onSuccess: () => {
        analytics.track('generation_completed');
      },
      onError: (error: any) => {
        // Invalidate cache to refetch current usage
        if (user) {
          queryClient.invalidateQueries({ queryKey: ['/api/usage/check', user.id] });
        }
        
        // Show modal if 403 (limit reached)
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
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How long does it take to build an app?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most applications are generated in minutes. Complex apps may take 5-10 minutes.',
            },
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to build an app with FlashFusion',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Describe',
            text: 'Tell us what you want to build in plain language',
          },
          {
            '@type': 'HowToStep',
            name: 'Analyze',
            text: 'AI analyzes requirements and plans the architecture',
          },
          {
            '@type': 'HowToStep',
            name: 'Generate',
            text: 'Complete codebase generated in seconds',
          },
          {
            '@type': 'HowToStep',
            name: 'Test',
            text: 'Automated testing ensures quality and reliability',
          },
          {
            '@type': 'HowToStep',
            name: 'Deploy',
            text: 'One-click deployment to production',
          },
        ],
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
            <BuildProcess />
          </main>
        </div>
      </div>

      <ConsentBanner />
      <CommandPaletteHint />
      
      {/* Limit Reached Modal */}
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

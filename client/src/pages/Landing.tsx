import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Background } from '@/components/Background';
import { ConsentBanner } from '@/components/ConsentBanner';
import { UsageWarning } from '@/components/UsageWarning';
import { LimitReachedModal } from '@/components/LimitReachedModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { useUsageCheck, useUsageIncrement } from '@/hooks/useUsageTracking';
import { queryClient } from '@/lib/queryClient';
import { analytics } from '@/utils/events';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Check, Zap, Globe, Smartphone, Monitor, 
  Users, Shield, TrendingUp, Code2, Sparkles, Cloud,
  Database, GitBranch, Play, Star, ChevronDown
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { data: usageData } = useUsageCheck(user?.id || '', isAuthenticated);
  const incrementMutation = useUsageIncrement();

  useEffect(() => {
    analytics.track('landing_view');
  }, []);

  const handleGenerate = () => {
    // Redirect unauthenticated users to workflows page
    if (!user) {
      analytics.track('cta_click', { authenticated: false, action: 'start_building' });
      window.location.href = '/workflows';
      return;
    }
    
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
        window.location.href = '/workflows/ai-creation';
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

  const features = [
    {
      icon: Code2,
      title: 'AI Code Generation',
      description: 'Generate production-ready code with 99.8% accuracy using GPT-5 orchestration',
      stat: '99.8%',
    },
    {
      icon: Globe,
      title: 'Universal Templates',
      description: 'Build web, mobile, and desktop apps from unified templates',
      stat: '3 Platforms',
    },
    {
      icon: Users,
      title: 'Multi-Role Agents',
      description: 'Specialized AI agents for development, testing, and deployment',
      stat: '10+ Agents',
    },
    {
      icon: Zap,
      title: 'Instant Deploy',
      description: 'Deploy to production in 5 seconds with automatic scaling',
      stat: '5s Deploy',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: '100% secure with automated compliance and security scanning',
      stat: '100% Secure',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Monitor performance and user behavior in real-time',
      stat: 'Live Data',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter Pro',
      price: 14.50,
      description: 'Perfect for individual developers and small projects',
      features: [
        '10 AI generations per month',
        'Web & mobile templates',
        'Basic analytics',
        'Community support',
        '1 team member',
      ],
    },
    {
      name: 'Professional Pro',
      price: 39.50,
      description: 'Ideal for growing teams and multiple projects',
      features: [
        '100 AI generations per month',
        'All platform templates',
        'Advanced analytics',
        'Priority support',
        '5 team members',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Pro',
      price: 99.50,
      description: 'For large teams requiring unlimited scale',
      features: [
        'Unlimited AI generations',
        'Custom templates',
        'Enterprise analytics',
        '24/7 dedicated support',
        'Unlimited team members',
        'White label solution',
        'SLA guarantee',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How long does it take to build an app?',
      answer: 'Most applications are generated in 2-5 minutes. Complex enterprise apps may take 5-10 minutes depending on requirements.',
    },
    {
      question: 'What platforms can I deploy to?',
      answer: 'You can deploy to web (progressive web apps), iOS, Android, Windows, macOS, and Linux. Our universal templates ensure consistency across all platforms.',
    },
    {
      question: 'Do I need coding knowledge?',
      answer: 'No coding knowledge required! Simply describe what you want to build in plain language, and our AI will handle the rest. However, if you want to customize the code, full access is provided.',
    },
    {
      question: 'Can I customize the generated code?',
      answer: 'Absolutely! All generated code is yours to customize and extend. We provide full source code access with complete documentation.',
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We offer community support for all users, priority support for Professional Pro, and 24/7 dedicated support for Enterprise Pro subscribers.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We implement enterprise-grade security with end-to-end encryption, automated compliance scanning, and SOC 2 Type II certification.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>FlashFusion – Universal App Generator</title>
        <meta name="description" content="AI-powered universal app generator creating production-ready web, mobile, and desktop applications in minutes with 99.8% accuracy." />
        <link rel="canonical" href="https://flashfusion.dev" />
        
        <meta property="og:title" content="FlashFusion – Universal App Generator" />
        <meta property="og:description" content="AI-powered universal app generator creating production-ready applications in minutes." />
        <meta property="og:image" content="https://flashfusion.dev/og/default.png" />
        <meta property="og:url" content="https://flashfusion.dev" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FlashFusion – Universal App Generator" />
        <meta name="twitter:description" content="AI-powered universal app generator creating production-ready applications in minutes." />
        <meta name="twitter:image" content="https://flashfusion.dev/og/default.png" />
        
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Background />
      
      <div className="relative min-h-screen">
        <div className="relative z-10 bg-background/85 backdrop-blur-md">
          <main id="main" data-testid="main-content">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 md:py-32">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  {/* Logo */}
                  <div className="flex items-center justify-center gap-3 mb-8" data-testid="hero-logo">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-brand-name">
                      FlashFusion
                    </h1>
                  </div>

                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-headline">
                    Universal App Generator
                  </h2>
                  
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
                    Build production-ready web, mobile, and desktop apps in minutes with AI-powered code generation. 
                    No coding required, just describe what you want to build.
                  </p>

                  {/* Usage Warning */}
                  {usageData && usageData.percentage >= 80 && (
                    <div className="mb-8 max-w-2xl mx-auto">
                      <UsageWarning 
                        currentUsage={usageData.currentUsage} 
                        limit={usageData.usageLimit} 
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button
                      size="lg"
                      className="text-base"
                      onClick={() => {
                        analytics.track('cta_click', { action: 'start_building' });
                        handleGenerate();
                      }}
                      data-testid="button-start-building"
                    >
                      Start Building Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="lg"
                      className="text-base"
                      onClick={() => {
                        analytics.track('cta_click', { action: 'view_demo' });
                      }}
                      data-testid="button-view-demo"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Free tier available
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      99.8% accuracy
                    </span>
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      No credit card required
                    </span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Everything You Need to Build
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Powered by advanced AI orchestration and universal templates
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover-elevate" data-testid={`card-feature-${index}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-primary" />
                              </div>
                              <Badge variant="secondary">{feature.stat}</Badge>
                            </div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-base">
                              {feature.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 bg-card/30">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Choose Your Plan
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Start free and scale as you grow
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {pricingTiers.map((tier, index) => (
                    <motion.div
                      key={tier.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`h-full relative hover-elevate ${tier.popular ? 'border-primary border-2 shadow-lg' : ''}`}
                        data-testid={`card-pricing-${index}`}
                      >
                        {tier.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground" data-testid="badge-most-popular">
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-2xl" data-testid={`text-plan-name-${index}`}>
                            {tier.name}
                          </CardTitle>
                          <CardDescription data-testid={`text-plan-description-${index}`}>
                            {tier.description}
                          </CardDescription>
                          <div className="mt-4" data-testid={`text-plan-price-${index}`}>
                            <span className="text-4xl font-bold">${tier.price.toFixed(2)}</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 mb-6" data-testid={`list-plan-features-${index}`}>
                            {tier.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2" data-testid={`item-feature-${index}-${i}`}>
                                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full" 
                            variant={tier.popular ? 'default' : 'outline'}
                            onClick={() => {
                              analytics.track('cta_click', { action: 'select_plan', plan: tier.name });
                              window.location.href = '/pricing';
                            }}
                            data-testid={`button-select-plan-${index}`}
                          >
                            Get Started
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Everything you need to know about FlashFusion
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faq">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border rounded-md px-6 bg-card"
                      data-testid={`accordion-faq-${index}`}
                    >
                      <AccordionTrigger 
                        className="text-left hover:no-underline"
                        data-testid={`button-faq-trigger-${index}`}
                      >
                        <span className="font-semibold" data-testid={`text-faq-question-${index}`}>
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent 
                        className="text-muted-foreground"
                        data-testid={`text-faq-answer-${index}`}
                      >
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Card className="p-12 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                  <CardContent className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                      Ready to Build Your App?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Join thousands of developers building production-ready applications with AI
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button 
                        size="lg" 
                        className="text-base"
                        onClick={() => {
                          analytics.track('cta_click', { action: 'footer_start_building' });
                          handleGenerate();
                        }}
                        data-testid="button-cta-start"
                      >
                        Start Building Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="text-base"
                        asChild
                      >
                        <Link href="/pricing" data-testid="link-view-pricing">
                          View Pricing
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>
        </div>
      </div>

      <ConsentBanner />
      
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

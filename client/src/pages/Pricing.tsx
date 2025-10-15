import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { analytics } from '@/utils/events';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/Skeleton';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out FlashFusion',
    features: [
      '10 generations per month',
      'Basic AI models',
      'Community support',
      'Public deployments',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$49',
    originalPrice: '$99',
    description: 'For professional developers',
    features: [
      'Unlimited generations',
      'Advanced AI models',
      'Priority support',
      'Private deployments',
      'Custom domains',
      'Team collaboration',
    ],
    cta: 'Upgrade to Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams and organizations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom AI training',
      'SLA guarantees',
      'Advanced security',
      'Volume discounts',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function Pricing() {
  const { data: flags, isLoading } = useFeatureFlags();
  const showPromo = flags?.PROMO_LAUNCH50 ?? false;
  const showReferral = flags?.REFERRAL_ENABLED ?? false;

  useEffect(() => {
    analytics.track('pricing_view');
  }, []);

  return (
    <>
      <Helmet>
        <title>Pricing – FlashFusion</title>
        <meta name="description" content="Choose the perfect plan for your needs. Start free and scale as you grow." />
        <link rel="canonical" href="https://flashfusion.dev/pricing" />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div 
          className="relative z-10"
          style={{
            background: 'rgba(14, 14, 16, 0.85)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <main id="main" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the perfect plan for your needs. Start free and scale as you grow.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="h-full">
                        <CardHeader>
                          <Skeleton className="h-6 w-20 mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <Skeleton className="h-10 w-32" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton key={j} className="h-4 w-full" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`h-full flex flex-col ${tier.featured ? 'border-primary shadow-lg' : ''}`}
                      data-testid={`card-tier-${tier.name.toLowerCase()}`}
                    >
                      {tier.featured && showPromo && (
                        <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-md">
                          <Sparkles className="inline w-4 h-4 mr-1" />
                          50% OFF for 4 months
                        </div>
                      )}
                      
                      <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                        <div className="mt-4">
                          <div className="flex items-baseline gap-2">
                            {tier.originalPrice && showPromo && (
                              <span className="text-2xl text-muted-foreground line-through">
                                {tier.originalPrice}
                              </span>
                            )}
                            <span className="text-4xl font-bold">{tier.price}</span>
                            {tier.price !== 'Custom' && (
                              <span className="text-muted-foreground">/month</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <ul className="space-y-3">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={tier.featured ? 'default' : 'outline'}
                          onClick={() => {
                            analytics.track('upgrade_click', { tier: tier.name });
                          }}
                          data-testid={`button-tier-${tier.name.toLowerCase()}`}
                        >
                          {tier.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  ))
                )}
              </div>

              {showReferral && (
                <div className="mt-12 text-center">
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-lg mb-2">Refer & Earn</h3>
                      <p className="text-muted-foreground mb-4">
                        Invite 2 friends and get +10 generations for free
                      </p>
                      <Button variant="outline" data-testid="button-referral">
                        Get Referral Link
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

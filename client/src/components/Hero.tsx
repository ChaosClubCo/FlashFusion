import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, ArrowRight, Mail, Check, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { analytics } from '@/utils/events';
import { useSubscribe } from '@/hooks/useSubscribe';
import { motion } from 'framer-motion';

interface HeroProps {
  onGenerate?: () => void;
}

export function Hero({ onGenerate }: HeroProps) {
  const [email, setEmail] = useState('');
  const subscribeMutation = useSubscribe();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    
    analytics.track('cta_click', { action: 'email_subscribe', email });
    
    subscribeMutation.mutate({ email }, {
      onSuccess: () => {
        setEmail('');
      },
    });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 md:py-32">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Build Apps{' '}
            <span className="text-primary">10× Faster</span>
            {' '}with AI
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform ideas into production-ready applications in minutes. 
            No coding required, just describe what you want to build.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="text-base"
              onClick={() => {
                analytics.track('cta_click', { action: 'start_building' });
                onGenerate?.();
              }}
              data-testid="button-start-building"
            >
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-base backdrop-blur-sm bg-background/50"
              onClick={() => {
                analytics.track('cta_click', { action: 'watch_demo' });
              }}
              data-testid="button-watch-demo"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch 2-Minute Demo
            </Button>
          </div>

          {/* Email capture */}
          <div className="max-w-md mx-auto mb-6">
            {subscribeMutation.isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-primary"
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      className="pl-9 min-h-10 text-base"
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribeMutation.isPending || !email}
                    data-testid="button-subscribe"
                  >
                    {subscribeMutation.isPending ? 'Subscribing...' : 'Get Started'}
                  </Button>
                </div>
                {subscribeMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed to subscribe. Please try again.</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Free tier
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              2-min setup
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              No card required
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-20 md:py-32">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <Skeleton className="h-16 md:h-24 w-full max-w-4xl mx-auto" />
        <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Background } from '@/components/Background';
import { ConsentBanner } from '@/components/ConsentBanner';
import { UsageWarning } from '@/components/UsageWarning';
import { LimitReachedModal } from '@/components/LimitReachedModal';
import { DemoPreviewModal } from '@/components/DemoPreviewModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { useUsageCheck, useUsageIncrement } from '@/hooks/useUsageTracking';
import { queryClient } from '@/lib/queryClient';
import { analytics } from '@/utils/events';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Check, Zap, Code2, Sparkles, Cloud, 
  Shield, TrendingUp, DollarSign, BarChart3, Users,
  Play, Search, CheckCircle2, XCircle, Clock,
  Rocket, Gift, Star, ChevronDown
} from 'lucide-react';
import heroImage from '@assets/generated_images/futuristic_ai_workspace_hero.png';

export default function Landing() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const { data: usageData } = useUsageCheck(user?.id || '', isAuthenticated);
  const incrementMutation = useUsageIncrement();

  useEffect(() => {
    analytics.track('landing_view');
  }, []);

  const handleGenerate = () => {
    // Redirect unauthenticated users to workflows page
    if (!user) {
      analytics.track('cta_click', { authenticated: false, action: 'start_building' });
      setLocation('/workflows');
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
        setLocation('/workflows/ai-creation');
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

  return (
    <>
      <Helmet>
        <title>FlashFusion - Transform Ideas Into Reality With AI</title>
        <meta name="description" content="The most advanced AI development platform that turns your concepts into production-ready applications, content, and revenue streams in minutes, not months." />
        <meta property="og:title" content="FlashFusion - Transform Ideas Into Reality With AI" />
        <meta property="og:description" content="Professional-grade AI tools for creators, developers, and entrepreneurs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flashfusion.co" />
        <meta property="og:image" content="/og/default.png" />
      </Helmet>

      <Background />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative px-4 pt-32 pb-16" data-testid="section-hero">
          {/* Hero Background Image with Gradient Overlay */}
          <div className="absolute inset-0 -z-10">
            <img 
              src={heroImage} 
              alt="Futuristic AI workspace" 
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/10"
              style={{
                backdropFilter: 'blur(0.5px)'
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Promotional Banner */}
            <motion.div 
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-pink-500/20 to-pink-600/20 backdrop-blur-md border border-pink-500/30 rounded-full px-6 py-3 flex items-center gap-3" data-testid="banner-promo">
                <Gift className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-foreground">
                  Limited Time Launch Offer: <span className="text-pink-400 font-bold">50% OFF</span> for 4 months
                </span>
                <Badge variant="outline" className="bg-pink-500/10 border-pink-500/30 text-pink-300 text-xs">
                  Limited spots available
                </Badge>
              </div>
            </motion.div>

            {/* Secondary Banner */}
            <motion.div 
              className="mb-12 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-card border border-border rounded-full px-5 py-2.5 flex items-center gap-2" data-testid="banner-users">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Join <span className="text-foreground font-semibold">10,000+</span> creators building the future
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" data-testid="heading-hero">
                <span className="text-foreground">Transform Ideas Into</span>
                <br />
                <span className="bg-gradient-to-r from-[hsl(var(--gradient-gold))] via-[hsl(var(--gradient-text-cyan))] to-[hsl(var(--gradient-text-purple))] bg-clip-text text-transparent">
                  Reality With AI
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
                The most advanced AI development platform that turns your concepts into{' '}
                <span className="text-accent font-semibold">production-ready applications</span>, content, and revenue streams in minutes, not months.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-sm text-foreground">10x Faster Development</span>
                </div>
                <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-sm text-foreground">Enterprise Security</span>
                </div>
                <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-foreground">Built-in Monetization</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto">
                <Button 
                  size="lg" 
                  className="relative bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent/80 shadow-lg shadow-accent/20 w-full sm:w-auto sm:min-w-[240px] group"
                  onClick={handleGenerate}
                  data-testid="button-get-started"
                >
                  <Badge variant="secondary" className="absolute -top-2 -right-2 bg-pink-500 text-white border-0 text-xs font-bold">
                    50% OFF
                  </Badge>
                  Get 50% Off - Start Building
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-card border-border hover:bg-card/90 w-full sm:w-auto sm:min-w-[200px]"
                  onClick={() => {
                    analytics.track('demo_modal_opened');
                    setShowDemoModal(true);
                  }}
                  data-testid="button-try-demo"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Try Interactive Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Preview Section */}
        <section className="relative px-4 py-16" data-testid="section-video-preview">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden border border-border/50"
              style={{
                background: 'linear-gradient(135deg, hsla(217, 50%, 15%, 0.4) 0%, hsla(187, 50%, 20%, 0.4) 100%)'
              }}
            >
              {/* Corner Icons */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-accent" />
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="absolute bottom-4 left-4 w-10 h-10 rounded-lg bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-pink-400" />
              </div>
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-purple-400" />
              </div>

              {/* Play Button & Content */}
              <div className="py-24 px-8 text-center">
                <div className="mb-6 flex justify-center">
                  <button 
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/80 to-accent backdrop-blur-md border-2 border-accent/50 flex items-center justify-center shadow-2xl shadow-accent/30 hover:scale-110 transition-transform"
                    onClick={() => {
                      analytics.track('video_preview_clicked');
                      setShowDemoModal(true);
                    }}
                    data-testid="button-play-video"
                  >
                    <Play className="w-8 h-8 text-accent-foreground ml-1" />
                  </button>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">FlashFusion Interface Preview</h3>
                <p className="text-muted-foreground mb-10">Click to see the platform in action</p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="bg-transparent border border-border rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent mb-1">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Creators</div>
                  </div>
                  <div className="bg-transparent border border-border rounded-lg p-4">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">50M+</div>
                    <div className="text-sm text-muted-foreground">Lines of Code Generated</div>
                  </div>
                  <div className="bg-transparent border border-border rounded-lg p-4">
                    <div className="text-3xl font-bold text-pink-400 mb-1">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-muted-foreground mb-6">Trusted by innovative teams worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
                {['TechCorp', 'Innovate Co', 'Digital Agency', 'Creative Studio', 'StartupLab'].map((company) => (
                  <div key={company} className="text-lg font-semibold text-foreground/60">
                    {company}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative px-4 py-20" data-testid="section-features">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-features">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent">
                  create & scale
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Professional-grade AI tools designed for creators, developers, and entrepreneurs
                who want to transform their ideas into profitable digital products.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1: AI Code Generation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-code">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                      <Code2 className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle>AI Code Generation</CardTitle>
                    <CardDescription>
                      Generate production-ready code in any language with advanced AI models trained on billions of code examples.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-0">
                      99.9% accuracy
                    </Badge>
                    <Link href="/workflows/ai-creation" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature 2: Content Creation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-content">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Content Creation</CardTitle>
                    <CardDescription>
                      Create stunning visuals, compelling copy, and engaging media content at the speed of thought.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-0">
                      No limits
                    </Badge>
                    <Link href="/workflows" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature 3: One-Click Deploy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-deploy">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>One-Click Deploy</CardTitle>
                    <CardDescription>
                      Deploy your applications instantly across 20+ platforms with automated optimization and scaling.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-0">
                      Instant deploy
                    </Badge>
                    <Link href="/workflows/publishing" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature 4: Revenue Streams */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-revenue">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Revenue Streams</CardTitle>
                    <CardDescription>
                      Built-in monetization tools including marketplace integration, subscription management, and analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-0">
                      Up to $5,000/mo
                    </Badge>
                    <Link href="/workflows/commerce" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature 5: Enterprise Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-security">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Enterprise Security</CardTitle>
                    <CardDescription>
                      Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-0">
                      100% secure
                    </Badge>
                    <Link href="/workflows/security" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature 6: Analytics & Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="h-full hover-elevate bg-transparent border-border" data-testid="card-feature-analytics">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Analytics & Insights</CardTitle>
                    <CardDescription>
                      Real-time performance tracking, user behavior analysis, and AI-powered optimization recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                      Real-time data
                    </Badge>
                    <Link href="/workflows/analytics" className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
                      Learn more <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative px-4 py-20" data-testid="section-pricing">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Gift className="w-8 h-8 text-accent" />
                <h2 className="text-4xl md:text-5xl font-bold" data-testid="heading-pricing">
                  Choose Your Plan
                </h2>
              </div>
              
              {/* Promotional Banner */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/20 to-accent/20 backdrop-blur-md border border-accent/30 rounded-full px-6 py-3 mb-8" data-testid="banner-pricing-promo">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">
                  Limited Time: <span className="font-bold text-accent">50% OFF all plans</span> - Save up to $1,200/year! 
                </span>
                <Zap className="w-4 h-4 text-accent" />
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                Hover or click on any plan to explore billing options, features, and available add-ons.
              </p>
              <p className="text-sm text-muted-foreground">
                All plans include our core AI development platform with premium support.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full hover-elevate relative bg-card border-border" data-testid="card-pricing-starter">
                  <Badge variant="secondary" className="absolute -top-3 left-6 bg-accent/20 text-accent border-0">
                    50% OFF
                  </Badge>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Starter Pro</CardTitle>
                    <CardDescription>For indie innovators</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">$14.50</span>
                        <span className="text-muted-foreground line-through">$29</span>
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full mb-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => setLocation('/pricing')}
                      data-testid="button-pricing-starter"
                    >
                      View plans & options
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>5 AI code generations/month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Up to 3 projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Basic deployment options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Community support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Professional Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full hover-elevate relative bg-gradient-to-b from-accent/20 to-card border-accent/50 shadow-lg shadow-accent/20" data-testid="card-pricing-professional">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 shadow-lg shadow-accent/30">
                    Most Popular
                  </Badge>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                      <Star className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Professional Pro</CardTitle>
                    <CardDescription>Best for growing businesses</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">$39.50</span>
                        <span className="text-muted-foreground line-through">$79</span>
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full mb-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                      onClick={() => setLocation('/pricing')}
                      data-testid="button-pricing-professional"
                    >
                      View plans & options
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Unlimited AI generations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Unlimited projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>All deployment platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Priority support (24/7)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>Advanced analytics</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Pro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full hover-elevate relative bg-card border-border" data-testid="card-pricing-enterprise">
                  <Badge variant="secondary" className="absolute -top-3 right-6 bg-primary/20 text-primary border-0">
                    Enterprise
                  </Badge>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Enterprise Pro</CardTitle>
                    <CardDescription>For large organizations</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">$99.50</span>
                        <span className="text-muted-foreground line-through">$199</span>
                        <span className="text-sm text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline"
                      className="w-full mb-6 border-primary/30 hover:bg-primary/10"
                      onClick={() => setLocation('/pricing')}
                      data-testid="button-pricing-enterprise"
                    >
                      View plans & options
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Everything in Professional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>SLA guarantees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>White-label options</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Guarantees */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>24/7 support included</span>
                </div>
              </div>
              <p className="mt-6 text-sm">
                Need a custom solution? <Link href="/contact" className="text-accent hover:text-accent/80 font-medium">Contact our sales team</Link> for enterprise pricing and features.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Complete Workflows Section */}
        <section className="relative px-4 py-20" data-testid="section-workflows">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[hsl(var(--gradient-gold))] via-[hsl(var(--gradient-text-cyan))] to-[hsl(var(--gradient-text-purple))] bg-clip-text text-transparent">
                  FlashFusion Complete
                </span>{' '}
                <span className="text-foreground">Workflows</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience the complete user journey through FlashFusion's six core features. Each workflow
                demonstrates real functionality and user interactions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI-Powered Creation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-ai">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle>AI-Powered Creation</CardTitle>
                    <CardDescription>
                      Generate stunning content, code, and creative assets in seconds with advanced AI models.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>2-5 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Simple</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-ai"
                    >
                      <Link href="/workflows/ai-creation">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* One-Click Publishing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-publish">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                      <Cloud className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>One-Click Publishing</CardTitle>
                    <CardDescription>
                      Deploy your creations instantly across 20+ platforms with automated optimization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>1-3 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Simple</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-publish"
                    >
                      <Link href="/workflows/publishing">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Creator Commerce */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-commerce">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Creator Commerce</CardTitle>
                    <CardDescription>
                      Turn your creative work into revenue streams with integrated marketplace tools.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>3-5 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Medium</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-commerce"
                    >
                      <Link href="/workflows/commerce">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enterprise Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-security">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Enterprise Security</CardTitle>
                    <CardDescription>
                      Implement end-to-end encryption, SOC 2 compliance, and advanced threat protection.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>2-4 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Medium</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-security"
                    >
                      <Link href="/workflows/security">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Smart Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-analytics">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Smart Analytics</CardTitle>
                    <CardDescription>
                      Track performance, analyze user behavior, and get AI-powered optimization insights.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>3-6 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Medium</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-analytics"
                    >
                      <Link href="/workflows/analytics">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quality Assurance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="h-full hover-elevate bg-card border-border" data-testid="card-workflow-qa">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>Quality Assurance</CardTitle>
                    <CardDescription>
                      Automated testing checks ensure production-grade quality before deployment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>2-4 minutes</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Simple</Badge>
                    </div>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                      data-testid="button-workflow-qa"
                    >
                      <Link href="/workflows/qa">
                        <Play className="mr-2 w-4 h-4" />
                        Start Workflow
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative px-4 py-20" data-testid="section-faq">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-faq">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about FlashFusion. Can't find what you're
                looking for? Our support team is here to help.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-10 bg-card border-border h-12"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  data-testid="input-faq-search"
                />
              </div>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'all', label: 'All', icon: '📋' },
                  { id: 'general', label: 'General', icon: '💬' },
                  { id: 'pricing', label: 'Pricing & Billing', icon: '💰' },
                  { id: 'features', label: 'Features & AI Tools', icon: '✨' },
                  { id: 'technical', label: 'Technical', icon: '⚙️' },
                  { id: 'security', label: 'Security & Privacy', icon: '🔒' },
                ].map((category) => (
                  <Button
                    key={category.id}
                    variant={faqCategory === category.id ? 'default' : 'outline'}
                    className={faqCategory === category.id ? 'bg-accent text-accent-foreground' : 'bg-card'}
                    onClick={() => setFaqCategory(category.id)}
                    data-testid={`button-faq-category-${category.id}`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faq">
                <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-1">
                    How long does it take to build an app with FlashFusion?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Most applications are generated in just 2-5 minutes. Complex enterprise applications may take 5-10 minutes. Our AI-powered platform analyzes your requirements and generates production-ready code with best practices built in.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-2">
                    What technologies does FlashFusion support?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    FlashFusion supports all major programming languages (JavaScript, Python, Java, Go, Rust), frameworks (React, Vue, Angular, Django, Flask, Spring), and cloud platforms (AWS, Google Cloud, Azure, Vercel, Netlify). Our AI adapts to your specific tech stack requirements.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-3">
                    Can I customize the generated code?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! All generated code is 100% yours to customize, modify, and extend. The code follows industry best practices and includes comprehensive comments to help you understand and build upon it.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-4">
                    What's included in the 50% OFF promotion?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    The limited-time 50% OFF applies to all Pro plans (Starter, Professional, and Enterprise) for your first 4 months. This includes all features of your chosen plan with no restrictions. After 4 months, standard pricing applies, but you can cancel anytime with no penalties.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-5">
                    Is my code and data secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! FlashFusion uses bank-level encryption (AES-256), SOC 2 compliance, and end-to-end encryption for all data. Your code and data are never shared with third parties or used to train AI models. We offer private cloud deployment options for Enterprise customers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-trigger-6">
                    Do you offer a free trial?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! We offer a 14-day free trial with access to all Professional Pro features. No credit card required. You can explore the platform, generate projects, and see the quality of our AI-generated code before committing to a paid plan.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">
                Still have questions? Our support team is available 24/7.
              </p>
              <Button variant="outline" className="bg-card border-border" data-testid="button-contact-support">
                Contact Support
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative px-4 py-20" data-testid="section-final-cta">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to transform your ideas into{' '}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  reality?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators, developers, and entrepreneurs building the future with AI.
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent/80 shadow-lg shadow-accent/20 min-w-[240px]"
                onClick={handleGenerate}
                data-testid="button-final-cta"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <ConsentBanner />
      {usageData && usageData.currentUsage > 0 && (
        <UsageWarning currentUsage={usageData.currentUsage} limit={usageData.usageLimit} />
      )}
      <LimitReachedModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)}
        onUpgrade={() => setLocation('/pricing')}
      />
      <DemoPreviewModal 
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </>
  );
}

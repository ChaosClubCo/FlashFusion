import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { DashboardBackground } from '@/components/DashboardBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useUsageCheck } from '@/hooks/useUsageTracking';
import { analytics } from '@/utils/events';
import { motion } from 'framer-motion';
import { 
  Zap, Rocket, Settings, CreditCard, FolderOpen,
  TrendingUp, Code2, Sparkles, ArrowRight, Plus
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { data: usageData } = useUsageCheck(user?.id || '', !!user);

  useEffect(() => {
    analytics.track('dashboard_view');
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2FF] mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const planInfo = {
    Free: { limit: 3, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
    Pro: { limit: 50, color: 'text-[#00C2FF]', bgColor: 'bg-[#00C2FF]/20' },
    Enterprise: { limit: Infinity, color: 'text-[#FF6A3D]', bgColor: 'bg-[#FF6A3D]/20' }
  };

  const currentPlan = (user?.plan || 'Free') as keyof typeof planInfo;
  const plan = planInfo[currentPlan];
  const usagePercent = usageData ? (usageData.currentUsage / plan.limit) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>Dashboard - FlashFusion</title>
        <meta name="description" content="Manage your FlashFusion projects and monitor usage" />
      </Helmet>

      <DashboardBackground />

      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3" data-testid="heading-dashboard">
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#6F51FF] bg-clip-text text-transparent">
                Welcome back, {user?.firstName || 'Creator'}
              </span>
            </h1>
            <p className="text-lg text-foreground/70">
              Let's build something amazing today
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Usage Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-card border-[#00C2FF]/30" data-testid="card-usage">
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/80">Generations Used</CardTitle>
                  <Zap className="w-4 h-4 text-[#00C2FF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {usageData?.currentUsage || 0} / {plan.limit === Infinity ? '∞' : plan.limit}
                  </div>
                  <Progress value={Math.min(usagePercent, 100)} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {plan.limit === Infinity ? 'Unlimited generations' : `${plan.limit - (usageData?.currentUsage || 0)} remaining`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Plan Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-card border-[#FF6A3D]/30" data-testid="card-plan">
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/80">Current Plan</CardTitle>
                  <Rocket className="w-4 h-4 text-[#FF6A3D]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2">{currentPlan}</div>
                  <Badge className={`${plan.bgColor} ${plan.color} border-0`}>
                    {currentPlan === 'Free' ? 'Upgrade Available' : 'Active'}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Projects Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-card border-[#6F51FF]/30" data-testid="card-projects">
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/80">Total Projects</CardTitle>
                  <FolderOpen className="w-4 h-4 text-[#6F51FF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2">0</div>
                  <p className="text-xs text-muted-foreground">
                    Start your first project
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-card border-emerald-500/30" data-testid="card-revenue">
                <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/80">Est. Revenue</CardTitle>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2">$0</div>
                  <p className="text-xs text-muted-foreground">
                    From 0 active projects
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Create Project Card */}
            <Card className="bg-gradient-to-br from-[#00C2FF]/10 to-[#6F51FF]/10 backdrop-blur-md border-[#00C2FF]/30 hover-elevate" data-testid="card-create-project">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00C2FF] to-[#6F51FF] flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Start New Project</CardTitle>
                    <CardDescription className="text-foreground/60">Generate AI-powered applications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/workflows">
                  <Button 
                    className="w-full bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white"
                    data-testid="button-new-project"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            {currentPlan === 'Free' && (
              <Card className="bg-gradient-to-br from-[#FF6A3D]/10 to-pink-500/10 backdrop-blur-md border-[#FF6A3D]/30 hover-elevate" data-testid="card-upgrade">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF6A3D] to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">Upgrade to Pro</CardTitle>
                      <CardDescription className="text-foreground/60">Unlock unlimited generations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/billing">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#FF6A3D] to-pink-500 hover:opacity-90 text-white"
                      data-testid="button-upgrade"
                    >
                      View Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="bg-card border-border/50" data-testid="card-quick-links">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Links</CardTitle>
                <CardDescription className="text-foreground/60">Access your most-used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/projects">
                  <Button variant="outline" className="w-full justify-start" data-testid="link-projects">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    My Projects
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start" data-testid="link-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
                <Link href="/billing">
                  <Button variant="outline" className="w-full justify-start" data-testid="link-billing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing & Usage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Projects (Empty State) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-card border-border/50" data-testid="card-recent-projects">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Projects</CardTitle>
                <CardDescription className="text-foreground/60">Your latest generated applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first AI-powered application to get started</p>
                  <Link href="/workflows">
                    <Button className="bg-[#00C2FF] text-white" data-testid="button-create-first-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

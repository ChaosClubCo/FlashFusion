import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Rocket, 
  DollarSign, 
  BarChart3, 
  Shield, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '@/i18n';

const workflows = [
  {
    id: 'ai-creation',
    icon: Sparkles,
    title: 'AI-Powered Creation',
    description: 'Generate stunning content, code, and creative assets in seconds with advanced AI models.',
    estimatedTime: '2-3 minutes',
    complexity: 'Medium',
    path: '/workflows/ai-creation',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'publishing',
    icon: Rocket,
    title: 'One-Click Publishing',
    description: 'Deploy your creations instantly across 20+ platforms with automated optimization and scaling.',
    estimatedTime: '1-2 minutes',
    complexity: 'Low',
    path: '/workflows/publishing',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'commerce',
    icon: DollarSign,
    title: 'Creator Commerce',
    description: 'Turn your creative work into revenue streams with integrated marketplace tools.',
    estimatedTime: '3-5 minutes',
    complexity: 'Medium',
    path: '/workflows/commerce',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Track performance, audience insights, and revenue optimization in real-time.',
    estimatedTime: '2-3 minutes',
    complexity: 'Low',
    path: '/workflows/analytics',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption, SOC 2 compliance, and threat prevention.',
    estimatedTime: '1-2 minutes',
    complexity: 'Low',
    path: '/workflows/security',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'quality',
    icon: CheckCircle2,
    title: 'Quality Assurance',
    description: 'Automated quality checks ensure your content meets professional standards.',
    estimatedTime: '2-4 minutes',
    complexity: 'Medium',
    path: '/workflows/quality',
    color: 'from-teal-500 to-green-500',
  },
];

export default function Workflows() {
  const { t } = useI18n();

  return (
    <>
      <Helmet>
        <title>Workflows - FlashFusion</title>
        <meta name="description" content="Experience the complete journey through FlashFusion's 6 core features. Each workflow demonstrates our AI-powered platform's capabilities." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative py-20">
          {/* Background gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-cyan-500/40 opacity-100" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjJ6bTAtMnYyem0yIDB2Mnptdw0tMnYyem0tMiAwdjJ6bTAgMHYyem0yLTJ2MnptMCAydjJ6bS0yIDB2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

          <div className="container relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20" data-testid="badge-workflows">
                <Sparkles className="w-3 h-3 mr-1" />
                FlashFusion Complete Workflows
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-primary bg-clip-text text-transparent">
                Experience the complete journey through FlashFusion's 6 core features
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Each workflow demonstrates our AI-powered platform's capabilities. Choose a workflow to see how FlashFusion transforms your ideas into production-ready applications.
              </p>
            </div>
          </div>
        </section>

        {/* Workflows Grid */}
        <section className="py-12 pb-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                
                return (
                  <Card 
                    key={workflow.id} 
                    className="group hover-elevate active-elevate-2 transition-all duration-300"
                    data-testid={`card-workflow-${workflow.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${workflow.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {workflow.complexity}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{workflow.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {workflow.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{workflow.estimatedTime}</span>
                        </div>
                        
                        <Link href={workflow.path}>
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                            variant="outline"
                            data-testid={`button-start-${workflow.id}`}
                          >
                            Start Workflow
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Trusted by innovative teams worldwide
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators, developers, and entrepreneurs who are already building amazing things with FlashFusion.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-foreground">10,000+</div>
                <div>Active Creators</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-foreground">50M+</div>
                <div>AI Generations</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div>Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

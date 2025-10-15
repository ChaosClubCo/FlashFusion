import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, Gauge, Search, Eye } from 'lucide-react';

export default function QA() {
  const [reducedMotion, setReducedMotion] = useState(false);

  const metrics = [
    { label: 'LCP Target', value: '≤ 1.8s', icon: Gauge, status: 'good' },
    { label: 'CLS Target', value: '≤ 0.1', icon: Activity, status: 'good' },
    { label: 'SEO Score', value: '≥ 90', icon: Search, status: 'good' },
    { label: 'A11y Score', value: '≥ 90', icon: Eye, status: 'good' },
  ];

  return (
    <>
      <Helmet>
        <title>Quality Assurance – FlashFusion</title>
        <meta name="description" content="Performance metrics and quality assurance targets for FlashFusion." />
        <link rel="canonical" href="https://flashfusion.dev/qa" />
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
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Quality Assurance
                </h1>
                <p className="text-lg text-muted-foreground">
                  Performance metrics and accessibility settings
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Settings</CardTitle>
                    <CardDescription>
                      Customize your experience based on your preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-motion">Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={reducedMotion}
                        onCheckedChange={setReducedMotion}
                        data-testid="toggle-reduced-motion"
                      />
                    </div>
                    {reducedMotion && (
                      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Motion reduced
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Targets</CardTitle>
                    <CardDescription>
                      Core Web Vitals and quality metrics we maintain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {metrics.map((metric) => {
                        const Icon = metric.icon;
                        return (
                          <div
                            key={metric.label}
                            className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                          >
                            <Icon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-sm font-medium">{metric.label}</div>
                              <div className="text-lg font-bold">{metric.value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

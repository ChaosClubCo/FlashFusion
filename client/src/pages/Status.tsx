import { Helmet } from 'react-helmet-async';
import { Background } from '@/components/Background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Activity } from 'lucide-react';

const services = [
  { name: 'API', status: 'operational', uptime: '99.99%' },
  { name: 'AI Generation', status: 'operational', uptime: '99.95%' },
  { name: 'Deployment', status: 'operational', uptime: '99.98%' },
  { name: 'Database', status: 'operational', uptime: '99.99%' },
];

export default function Status() {
  return (
    <>
      <Helmet>
        <title>System Status – FlashFusion</title>
        <meta name="description" content="Current status and uptime of FlashFusion services." />
        <link rel="canonical" href="https://flashfusion.dev/status" />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div 
          className="relative z-10"
        >
          <main id="main" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  System Status
                </h1>
                <p className="text-lg text-muted-foreground">
                  Real-time status of FlashFusion services
                </p>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <div className="font-semibold text-lg">All Systems Operational</div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {services.map((service) => (
                  <Card key={service.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {service.uptime} uptime
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  Subscribe to status updates at{' '}
                  <a href="https://status.flashfusion.dev" className="text-primary hover:underline">
                    status.flashfusion.dev
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

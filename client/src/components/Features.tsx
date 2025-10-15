import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Sparkles, Users, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Code2,
    title: 'Full-Stack Builder',
    description: 'Generate complete applications with frontend, backend, and database in minutes. Production-ready code from day one.',
  },
  {
    icon: Sparkles,
    title: '60+ AI Tools',
    description: 'Access a comprehensive suite of AI-powered development tools for every aspect of your application.',
  },
  {
    icon: Users,
    title: 'Multi-Agent System',
    description: 'Collaborate with specialized AI agents that work together to build, test, and optimize your app.',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy your application to production with a single click. Automatic scaling and monitoring included.',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (features.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">No features available yet.</p>
          <a href="/tools" className="text-primary hover:underline">
            Explore our tools →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Build
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features designed to accelerate your development workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
              >
                <Card className="h-full hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
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
  );
}

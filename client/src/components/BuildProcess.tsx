import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Search, Code, TestTube2, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Describe',
    description: 'Tell us what you want to build in plain language',
  },
  {
    number: 2,
    icon: Search,
    title: 'Analyze',
    description: 'AI analyzes requirements and plans the architecture',
  },
  {
    number: 3,
    icon: Code,
    title: 'Generate',
    description: 'Complete codebase generated in seconds',
  },
  {
    number: 4,
    icon: TestTube2,
    title: 'Test',
    description: 'Automated testing ensures quality and reliability',
  },
  {
    number: 5,
    icon: Rocket,
    title: 'Deploy',
    description: 'One-click deployment to production',
  },
];

export function BuildProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to production in 5 simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                  className="relative"
                >
                  <Card className="relative z-10 hover-elevate" data-testid={`step-${step.number}`}>
                    <CardContent className="pt-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                        {step.number}
                      </div>
                      <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

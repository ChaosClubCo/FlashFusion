import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const metrics = [
  { label: 'Monthly Visitors', value: '500K+', icon: '👥' },
  { label: 'Demo Requests', value: '10K+', icon: '🎥' },
  { label: 'Active Developers', value: '50K+', icon: '👨‍💻' },
  { label: 'Apps Generated', value: '100K+', icon: '🚀' },
  { label: 'Uptime', value: '99.9%', icon: '⚡' },
  { label: 'User Rating', value: '4.9/5', icon: '⭐' },
];

export function Metrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 md:py-24 px-4" aria-live="polite">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              className="text-center"
            >
              <div 
                className="text-3xl mb-2" 
                role="img" 
                aria-label={metric.label}
              >
                {metric.icon}
              </div>
              <div 
                className="text-2xl md:text-3xl font-bold mb-1"
                aria-label={`${metric.label}: ${metric.value}`}
                data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

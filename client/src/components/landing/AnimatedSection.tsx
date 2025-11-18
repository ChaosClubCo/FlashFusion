import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  'data-testid'?: string;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  'data-testid': testId 
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
      data-testid={testId}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animateOnce?: boolean;
  yOffset?: number;
}

export function AnimatedDiv({ 
  children, 
  className = '', 
  delay = 0,
  animateOnce = true,
  yOffset = 20
}: AnimatedDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: animateOnce }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

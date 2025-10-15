import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Background() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient mesh with parallax animation */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, hsl(var(--gradient-orange)) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsl(var(--gradient-cyan)) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, hsl(var(--gradient-magenta)) 0%, transparent 50%),
            linear-gradient(135deg, hsl(0 0% 7%) 0%, hsl(0 0% 4%) 100%)
          `,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -64, 0],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'url(/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}

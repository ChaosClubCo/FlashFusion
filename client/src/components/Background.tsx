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
            radial-gradient(circle at 20% 50%, hsla(217, 50%, 20%, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsla(187, 50%, 25%, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, hsla(24, 50%, 20%, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, hsla(280, 40%, 20%, 0.10) 0%, transparent 50%),
            linear-gradient(135deg, hsl(220 26% 6%) 0%, hsl(220 28% 4%) 100%)
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

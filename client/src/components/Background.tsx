import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Background() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Light gradient mesh with subtle color accents */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, hsla(217, 70%, 85%, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsla(187, 70%, 90%, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, hsla(24, 80%, 92%, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, hsla(280, 60%, 90%, 0.2) 0%, transparent 50%)
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
      
      {/* Very subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'url(/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}

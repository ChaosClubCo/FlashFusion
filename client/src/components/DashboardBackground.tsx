import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function DashboardBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient transition from light to dark using FlashFusion brand colors */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              hsl(0 0% 98%) 0%,
              hsl(217 50% 85%) 15%,
              hsl(217 60% 60%) 40%,
              hsl(217 70% 30%) 70%,
              #0A0F1C 100%
            ),
            radial-gradient(circle at 20% 30%, rgba(0, 194, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(255, 106, 61, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(111, 81, 255, 0.1) 0%, transparent 50%)
          `,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                backgroundPosition: ['0% 0%', '0% 5%', '0% 0%'],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Neon glow accents */}
      <div className="absolute top-40 left-20 w-96 h-96 rounded-full bg-[#00C2FF]/10 blur-[120px]" />
      <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-[#FF6A3D]/8 blur-[120px]" />
    </div>
  );
}

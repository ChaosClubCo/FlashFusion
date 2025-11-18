interface GradientTextProps {
  children: string;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-[hsl(var(--gradient-gold))] via-[hsl(var(--gradient-text-cyan))] to-[hsl(var(--gradient-text-purple))] bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

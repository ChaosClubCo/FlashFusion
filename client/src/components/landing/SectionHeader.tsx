import { LucideIcon } from 'lucide-react';
import { AnimatedDiv } from './AnimatedSection';

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  titleGradient?: boolean;
  gradientText?: string;
  description: string;
  'data-testid'?: string;
}

export function SectionHeader({
  icon: Icon,
  iconColor = 'from-pink-500 to-pink-600',
  title,
  titleGradient = false,
  gradientText,
  description,
  'data-testid': testId
}: SectionHeaderProps) {
  return (
    <AnimatedDiv className="text-center mb-12">
      {Icon && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      )}
      
      <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid={testId}>
        {titleGradient ? (
          <>
            <span className="bg-gradient-to-r from-[hsl(var(--gradient-gold))] via-[hsl(var(--gradient-text-cyan))] to-[hsl(var(--gradient-text-purple))] bg-clip-text text-transparent">
              {gradientText}
            </span>{' '}
            <span className="text-foreground">{title}</span>
          </>
        ) : (
          title
        )}
      </h2>
      
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </AnimatedDiv>
  );
}

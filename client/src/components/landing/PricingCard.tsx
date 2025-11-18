import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon, Check, ChevronDown } from 'lucide-react';
import { AnimatedDiv } from './AnimatedSection';

interface PricingTierProps {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
    className?: string;
    position?: 'top-left' | 'top-center' | 'top-right';
  };
  features: string[];
  featureIconColor?: string;
  buttonVariant?: 'default' | 'outline';
  buttonClassName?: string;
  cardClassName?: string;
  onSelect: () => void;
  delay?: number;
}

export function PricingCard({
  id,
  icon: Icon,
  iconColor,
  name,
  description,
  price,
  originalPrice,
  badge,
  features,
  featureIconColor = 'text-accent',
  buttonVariant = 'default',
  buttonClassName,
  cardClassName = 'h-full hover-elevate relative bg-card/80 backdrop-blur-sm border-border',
  onSelect,
  delay = 0
}: PricingTierProps) {
  const getBadgePosition = () => {
    if (!badge) return '';
    switch (badge.position) {
      case 'top-left':
        return 'absolute -top-3 left-6';
      case 'top-center':
        return 'absolute -top-3 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'absolute -top-3 right-6';
      default:
        return 'absolute -top-3 left-6';
    }
  };

  return (
    <AnimatedDiv delay={delay}>
      <Card className={cardClassName} data-testid={`card-pricing-${id}`}>
        {badge && (
          <Badge variant={badge.variant || 'secondary'} className={`${getBadgePosition()} ${badge.className || ''}`}>
            {badge.text}
          </Badge>
        )}
        
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{price}</span>
              <span className="text-muted-foreground line-through">{originalPrice}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Button 
            variant={buttonVariant}
            className={`w-full mb-6 ${buttonClassName || ''}`}
            onClick={onSelect}
            data-testid={`button-pricing-${id}`}
          >
            View plans & options
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
          
          <ul className="space-y-3 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className={`w-4 h-4 ${featureIconColor} mt-0.5 shrink-0`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
}

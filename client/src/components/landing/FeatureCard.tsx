import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { AnimatedDiv } from './AnimatedSection';

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  badgeClassName?: string;
  link?: string;
  linkText?: string;
  delay?: number;
  'data-testid'?: string;
}

export function FeatureCard({
  icon: Icon,
  iconColor = 'from-accent to-accent/80',
  title,
  description,
  badge,
  badgeVariant = 'secondary',
  badgeClassName,
  link,
  linkText = 'Learn more',
  delay = 0,
  'data-testid': testId
}: FeatureCardProps) {
  return (
    <AnimatedDiv delay={delay}>
      <Card className="h-full hover-elevate bg-card/80 backdrop-blur-sm border-border" data-testid={testId}>
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-accent-foreground" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {badge && (
            <Badge variant={badgeVariant} className={badgeClassName}>
              {badge}
            </Badge>
          )}
          {link && (
            <Link href={link} className="inline-flex items-center text-sm text-accent hover:text-accent/80 mt-4">
              {linkText} <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          )}
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
}

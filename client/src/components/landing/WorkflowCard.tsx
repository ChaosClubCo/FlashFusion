import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LucideIcon, ArrowRight, Clock } from 'lucide-react';
import { AnimatedDiv } from './AnimatedSection';

interface WorkflowCardProps {
  id: string;
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  estimatedTime?: string;
  link: string;
  delay?: number;
}

export function WorkflowCard({
  id,
  icon: Icon,
  iconColor = 'from-accent to-accent/80',
  title,
  description,
  estimatedTime,
  link,
  delay = 0
}: WorkflowCardProps) {
  return (
    <AnimatedDiv delay={delay}>
      <Card className="h-full hover-elevate bg-card/80 backdrop-blur-sm border-border" data-testid={`card-workflow-${id}`}>
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-accent-foreground" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {estimatedTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime}</span>
            </div>
          )}
          <Link href={link}>
            <Button variant="outline" className="w-full" data-testid={`button-workflow-${id}`}>
              Start Workflow
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </AnimatedDiv>
  );
}

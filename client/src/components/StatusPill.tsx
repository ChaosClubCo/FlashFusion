import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SystemStatus = 'operational' | 'degraded' | 'maintenance';

interface StatusPillProps {
  status?: SystemStatus;
}

const statusConfig = {
  operational: {
    label: 'All Systems Operational',
    color: 'text-green-500',
    dotColor: 'bg-green-500',
  },
  degraded: {
    label: 'Degraded Performance',
    color: 'text-amber-500',
    dotColor: 'bg-amber-500',
  },
  maintenance: {
    label: 'Under Maintenance',
    color: 'text-blue-500',
    dotColor: 'bg-blue-500',
  },
};

export function StatusPill({ status = 'operational' }: StatusPillProps) {
  const config = statusConfig[status];

  return (
    <div 
      className="flex items-center gap-2 text-sm"
      data-testid="status-pill"
      aria-label={`System status: ${config.label}`}
    >
      <Circle 
        className={cn('w-2 h-2 fill-current', config.color)} 
        aria-hidden="true"
      />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}

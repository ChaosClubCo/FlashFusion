import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface UsageWarningProps {
  currentUsage: number;
  limit: number;
}

export function UsageWarning({ currentUsage, limit }: UsageWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const percentage = (currentUsage / limit) * 100;
  const shouldShow = percentage >= 80 && !isDismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4"
          data-testid="usage-warning"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-500 mb-1">
                Approaching Usage Limit
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                You've used {currentUsage} of {limit} generations ({percentage.toFixed(0)}%). 
                Consider upgrading to Pro for unlimited generations.
              </p>
              <Button size="sm" variant="outline" data-testid="button-upgrade">
                Upgrade Now
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsDismissed(true)}
              data-testid="button-dismiss-warning"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

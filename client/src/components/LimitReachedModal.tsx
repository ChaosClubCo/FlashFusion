import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function LimitReachedModal({ isOpen, onClose, onUpgrade }: LimitReachedModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md"
        data-testid="modal-limit-reached"
        aria-modal="true"
      >
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Usage Limit Reached</DialogTitle>
          <DialogDescription className="text-center">
            You've reached your free tier limit of 10 generations. 
            Upgrade to Pro to continue building amazing apps.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-md p-4 my-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Pro Plan Benefits</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Unlimited generations</li>
            <li>• Priority support</li>
            <li>• Advanced AI models</li>
            <li>• Custom deployment options</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            ref={closeButtonRef}
            data-testid="button-close-modal"
          >
            Maybe Later
          </Button>
          <Button
            onClick={onUpgrade}
            data-testid="button-upgrade-modal"
          >
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

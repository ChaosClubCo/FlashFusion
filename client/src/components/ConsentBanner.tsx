import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import { analytics } from '@/utils/events';
import { motion, AnimatePresence } from 'framer-motion';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    analytics.setConsent(true);
    analytics.track('consent_given', { type: 'analytics' });
    setIsVisible(false);
  };

  const handleDecline = () => {
    analytics.setConsent(false);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-card border border-card-border rounded-md p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Cookie & Analytics Consent</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies and first-party analytics to improve your experience. 
                    AI-generated content may require review. By accepting, you consent to our data practices.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  data-testid="button-consent-decline"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  data-testid="button-consent-accept"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { promptInstall, isInstallPromptAvailable, isPWAInstalled } from '@/utils/pwa';

export function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if install prompt is available and PWA is not already installed
    const checkInstallability = () => {
      if (isPWAInstalled()) {
        setShowPrompt(false);
        return;
      }

      const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
      if (isDismissed) {
        setDismissed(true);
        return;
      }

      if (isInstallPromptAvailable()) {
        setShowPrompt(true);
      }
    };

    checkInstallability();

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = () => {
      if (!dismissed && !isPWAInstalled()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
    setDismissed(true);
  };

  if (!showPrompt || isPWAInstalled()) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5"
      data-testid="install-pwa-prompt"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-sm hover-elevate active-elevate-2"
        aria-label="Dismiss"
        data-testid="button-dismiss-pwa"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-3 pr-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Download className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Install FlashFusion</h3>
            <p className="text-sm text-muted-foreground">
              Get quick access from your home screen
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1"
            data-testid="button-install-pwa"
          >
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="flex-1"
            data-testid="button-not-now-pwa"
          >
            Not Now
          </Button>
        </div>
      </div>
    </div>
  );
}

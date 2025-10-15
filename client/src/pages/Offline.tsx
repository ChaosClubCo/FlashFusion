import { Helmet } from 'react-helmet-async';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Offline() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Offline - FlashFusion</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <WifiOff className="relative w-20 h-20 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              You're Offline
            </h1>
            <p className="text-muted-foreground text-lg">
              It looks like you've lost your internet connection. Check your network and try again.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleRetry}
              size="lg"
              className="gap-2"
              data-testid="button-retry-connection"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            <p>Some features may be available offline from your cache.</p>
          </div>
        </div>
      </div>
    </>
  );
}

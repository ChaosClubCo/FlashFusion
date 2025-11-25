import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Background } from '@/components/Background';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found – FlashFusion</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <Background />

      <div className="relative min-h-screen">
        <div 
          className="relative z-10"
        >
          <main id="main" className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <h1 className="text-8xl font-bold mb-4 text-primary">404</h1>
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button data-testid="button-home">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

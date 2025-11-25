import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/Skeleton";
import { InstallPWA } from "@/components/InstallPWA";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { featureFlags } from "@/utils/featureFlags";
import { I18nProvider } from "@/i18n";

// Lazy load pages for code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Projects = lazy(() => import("@/pages/Projects"));
const Settings = lazy(() => import("@/pages/Settings"));
const Billing = lazy(() => import("@/pages/Billing"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const QA = lazy(() => import("@/pages/QA"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Status = lazy(() => import("@/pages/Status"));
const Offline = lazy(() => import("@/pages/Offline"));
const Workflows = lazy(() => import("@/pages/Workflows"));
const ImageGeneration = lazy(() => import("@/pages/ImageGeneration"));
const AICreation = lazy(() => import("@/pages/workflows/AICreation"));
const Publishing = lazy(() => import("@/pages/workflows/Publishing"));
const Commerce = lazy(() => import("@/pages/workflows/Commerce"));
const Analytics = lazy(() => import("@/pages/workflows/Analytics"));
const Security = lazy(() => import("@/pages/workflows/Security"));
const Quality = lazy(() => import("@/pages/workflows/Quality"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-2xl px-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Root path: Landing for unauthenticated, Dashboard for authenticated */}
        <Route path="/">
          {() => {
            if (isLoading) {
              return <PageLoader />;
            }
            return isAuthenticated ? <Dashboard /> : <Landing />;
          }}
        </Route>
        
        {/* Authenticated routes */}
        <Route path="/dashboard">
          {() => (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/projects">
          {() => (
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/settings">
          {() => (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/billing">
          {() => (
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          )}
        </Route>
        
        {/* Public routes - accessible to all */}
        <Route path="/pricing" component={Pricing} />
        <Route path="/qa" component={QA} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/status" component={Status} />
        <Route path="/offline" component={Offline} />
        
        {/* Feature routes */}
        <Route path="/workflows" component={Workflows} />
        <Route path="/image-generation" component={ImageGeneration} />
        <Route path="/workflows/ai-creation" component={AICreation} />
        <Route path="/workflows/publishing" component={Publishing} />
        <Route path="/workflows/commerce" component={Commerce} />
        <Route path="/workflows/analytics" component={Analytics} />
        <Route path="/workflows/security" component={Security} />
        <Route path="/workflows/quality" component={Quality} />
        
        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Navigation />
              <Toaster />
              <Router />
              {featureFlags.PWA_ENABLED && <InstallPWA />}
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;

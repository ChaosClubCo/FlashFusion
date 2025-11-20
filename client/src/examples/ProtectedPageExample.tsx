// Example of how to create a protected page that requires authentication
// Reference: blueprint:javascript_log_in_with_replit

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProtectedPageExample() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: 'Unauthorized',
        description: 'You are logged out. Logging in again...',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Protected Page</CardTitle>
          <CardDescription>
            Only authenticated users can see this content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">User Information:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>ID: {user?.id}</li>
                <li>Email: {user?.email}</li>
                <li>Name: {user?.firstName} {user?.lastName}</li>
              </ul>
            </div>
            
            <p className="text-sm">
              This is a protected page that requires authentication.
              You're currently logged in!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

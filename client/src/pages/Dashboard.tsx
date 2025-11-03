import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileCode, Calendar, Layers } from 'lucide-react';
import { format } from 'date-fns';
import type { GeneratedProject } from '@shared/schema';
import { analytics } from '@/utils/events';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch user's projects
  const { data: projects, isLoading: projectsLoading } = useQuery<GeneratedProject[]>({
    queryKey: ['/api/projects'],
    enabled: isAuthenticated,
  });

  // Fetch usage stats
  const { data: usageData, error: usageError } = useQuery({
    queryKey: ['/api/usage/check', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch('/api/usage/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (!response.ok) throw new Error('Failed to fetch usage stats');
      return response.json();
    },
  });

  useEffect(() => {
    analytics.track('dashboard_view');
  }, []);

  const handleDownload = (projectId: string, projectTitle: string) => {
    const downloadUrl = `/api/projects/${projectId}/download`;
    window.open(downloadUrl, '_blank');
    analytics.track('project_download', { projectId, projectTitle });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Checking authentication</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to access your dashboard</p>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - FlashFusion</title>
        <meta name="description" content="View and manage your AI-generated projects" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-dashboard-title">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || user?.email || 'User'}!
            </p>
          </div>

          {/* Usage Stats */}
          <Card className="mb-8" data-testid="card-usage-stats">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent>
              {usageError ? (
                <p className="text-sm text-muted-foreground">
                  Unable to load usage statistics. Please try again later.
                </p>
              ) : !usageData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Plan</p>
                    <Badge variant="default" className="text-lg capitalize">
                      {user?.plan || 'Free'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Generations Used</p>
                    <p className="text-2xl font-bold" data-testid="text-usage-count">
                      {usageData.currentUsage} / {usageData.usageLimit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                    <p className="text-2xl font-bold text-primary">
                      {usageData.usageLimit - usageData.currentUsage}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
          </div>

          {/* Loading State */}
          {projectsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!projectsLoading && (!projects || projects.length === 0) && (
            <Card className="text-center py-12" data-testid="card-empty-state">
              <CardContent>
                <FileCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start creating AI-powered applications to see them here
                </p>
                <Button asChild data-testid="button-create-project">
                  <a href="/#workflows">Create Your First Project</a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          {!projectsLoading && projects && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const files = JSON.parse(project.files) as Array<{ path: string; content: string }>;
                const metadata = project.metadata ? JSON.parse(project.metadata) : {};

                return (
                  <Card key={project.id} className="hover-elevate" data-testid={`card-project-${project.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg" data-testid={`text-project-title-${project.id}`}>
                          {project.title}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {project.projectType}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          <span>{files.length} files</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        {metadata.model && (
                          <div className="text-xs">
                            Generated with {metadata.model}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleDownload(project.id, project.title)}
                        className="w-full"
                        variant="default"
                        data-testid={`button-download-${project.id}`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Download,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/events';

// Types
interface AnalyticsStats {
  totalEvents: number;
  uniqueRoutes: number;
  topEvents: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  timeline: Array<{
    date: string;
    events: number;
    uniqueUsers: number;
  }>;
  routeDistribution: Array<{
    route: string;
    visits: number;
  }>;
  growth: {
    eventsChange: number;
    usersChange: number;
  };
}

// Mock data generator for demo purposes
function generateMockData(): AnalyticsStats {
  const eventTypes = [
    'landing_view',
    'cta_click',
    'generation_started',
    'generation_completed',
    'pricing_view',
    'upgrade_click',
  ];

  const routes = ['/', '/pricing', '/workflows', '/dashboard', '/billing'];

  // Generate timeline data for last 30 days
  const timeline = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      events: Math.floor(Math.random() * 500) + 100,
      uniqueUsers: Math.floor(Math.random() * 200) + 50,
    };
  });

  // Generate top events
  const topEvents = eventTypes.map((name) => ({
    name,
    count: Math.floor(Math.random() * 5000) + 500,
    percentage: 0,
  }));

  const totalEventCount = topEvents.reduce((sum, e) => sum + e.count, 0);
  topEvents.forEach((event) => {
    event.percentage = Math.round((event.count / totalEventCount) * 100);
  });
  topEvents.sort((a, b) => b.count - a.count);

  // Generate route distribution
  const routeDistribution = routes.map((route) => ({
    route,
    visits: Math.floor(Math.random() * 3000) + 500,
  }));

  return {
    totalEvents: timeline.reduce((sum, day) => sum + day.events, 0),
    uniqueRoutes: routes.length,
    topEvents: topEvents.slice(0, 6),
    timeline,
    routeDistribution,
    growth: {
      eventsChange: Math.floor(Math.random() * 40) - 10,
      usersChange: Math.floor(Math.random() * 30) - 5,
    },
  };
}

// Chart colors
const CHART_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

export default function Dashboard() {
  const { toast } = useToast();
  const [useMockData, setUseMockData] = useState(false);

  // Fetch analytics data from API
  const { data: apiData, isLoading, error } = useQuery<AnalyticsStats>({
    queryKey: ['/api/analytics/stats'],
    retry: 1,
  });

  // Use mock data if API fails or in demo mode
  const mockData = generateMockData();
  const data = useMockData || error ? mockData : apiData;

  useEffect(() => {
    analytics.track('landing_view');

    // Use mock data if API request fails
    if (error) {
      setUseMockData(true);
      toast({
        title: 'Using Demo Data',
        description: 'Unable to fetch real analytics. Showing sample data.',
      });
    }
  }, [error, toast]);

  // Export functions
  const exportToJSON = () => {
    if (!data) return;

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    analytics.track('cta_click', { action: 'export_json' });
    toast({
      title: 'Export Successful',
      description: 'Analytics data exported as JSON.',
    });
  };

  const exportToCSV = () => {
    if (!data) return;

    // Convert timeline to CSV
    const headers = ['Date', 'Events', 'Unique Users'];
    const rows = data.timeline.map((row) => [
      row.date,
      row.events.toString(),
      row.uniqueUsers.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    analytics.track('cta_click', { action: 'export_csv' });
    toast({
      title: 'Export Successful',
      description: 'Analytics data exported as CSV.',
    });
  };

  if (isLoading && !useMockData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - FlashFusion</title>
        <meta name="description" content="View comprehensive analytics and insights for your FlashFusion account." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights and metrics for your account
              </p>
              {useMockData && (
                <Badge variant="outline" className="mt-2">
                  Demo Mode
                </Badge>
              )}
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={exportToJSON}>
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalEvents.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      data.growth.eventsChange >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {data.growth.eventsChange >= 0 ? '+' : ''}
                    {data.growth.eventsChange}%
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Routes</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.uniqueRoutes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active routes tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Events</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.totalEvents / data.timeline.length).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Over {data.timeline.length} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    data.timeline.reduce((sum, day) => sum + day.uniqueUsers, 0) /
                      data.timeline.length
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      data.growth.usersChange >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {data.growth.usersChange >= 0 ? '+' : ''}
                    {data.growth.usersChange}%
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="timeline">
                <Calendar className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="events">
                <Activity className="mr-2 h-4 w-4" />
                Top Events
              </TabsTrigger>
              <TabsTrigger value="routes">
                <BarChart3 className="mr-2 h-4 w-4" />
                Routes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>
                    Events and unique users over the last {data.timeline.length} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data.timeline}>
                      <defs>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        className="text-xs"
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="events"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorEvents)"
                        name="Events"
                      />
                      <Area
                        type="monotone"
                        dataKey="uniqueUsers"
                        stroke="#ec4899"
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        name="Unique Users"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Events</CardTitle>
                    <CardDescription>
                      Most frequently tracked events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={data.topEvents} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={150}
                          className="text-xs"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                          }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Distribution</CardTitle>
                    <CardDescription>
                      Percentage breakdown of events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={data.topEvents}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) =>
                            `${name}: ${percentage}%`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {data.topEvents.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="routes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Route Distribution</CardTitle>
                  <CardDescription>
                    Page visits by route
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.routeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="route" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="visits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

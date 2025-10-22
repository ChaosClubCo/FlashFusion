import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Check,
  Zap,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/events';
import { queryClient } from '@/lib/queryClient';

// Types
interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  price: number;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  number: string;
  status: 'paid' | 'open' | 'void';
  amount: number;
  currency: string;
  date: string;
  pdfUrl?: string;
}

interface UsageMetrics {
  generations: {
    used: number;
    limit: number;
  };
  apiCalls: {
    used: number;
    limit: number;
  };
  storage: {
    used: number;
    limit: number;
  };
}

interface BillingData {
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  usage: UsageMetrics;
}

// Plan details
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 generations per month',
      'Basic support',
      '100 API calls per day',
      '1GB storage',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: [
      'Unlimited generations',
      'Priority support',
      '10,000 API calls per day',
      '50GB storage',
      'Advanced analytics',
      'Custom domains',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Unlimited API calls',
      'Unlimited storage',
      'SLA guarantee',
      'Custom integrations',
      'White-label options',
    ],
  },
};

// Mock data generator
function generateMockBillingData(): BillingData {
  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    subscription: {
      id: 'sub_mock_123',
      plan: 'pro',
      status: 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      price: 29,
    },
    paymentMethods: [
      {
        id: 'pm_mock_1',
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
    ],
    invoices: Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        id: `inv_mock_${i}`,
        number: `INV-${2024}-${String(1000 + i).padStart(4, '0')}`,
        status: 'paid' as const,
        amount: 29,
        currency: 'USD',
        date: date.toISOString(),
        pdfUrl: `/api/invoices/${i}/pdf`,
      };
    }),
    usage: {
      generations: {
        used: 127,
        limit: -1, // unlimited
      },
      apiCalls: {
        used: 3450,
        limit: 10000,
      },
      storage: {
        used: 12.5,
        limit: 50,
      },
    },
  };
}

export default function Billing() {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');

  // Fetch billing data from API
  const { data: apiData, isLoading, error } = useQuery<BillingData>({
    queryKey: ['/api/billing'],
    queryFn: async () => {
      const response = await fetch('/api/billing');
      if (!response.ok) throw new Error('Failed to fetch billing data');
      return response.json();
    },
    retry: 1,
  });

  // Use mock data if API fails
  const mockData = generateMockBillingData();
  const data = error ? mockData : apiData;

  useEffect(() => {
    analytics.track('landing_view');

    if (error) {
      toast({
        title: 'Using Demo Data',
        description: 'Unable to fetch billing information. Showing sample data.',
      });
    }
  }, [error, toast]);

  // Mutations
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/billing/subscription/cancel', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will remain active until the end of the billing period.',
      });
      setShowCancelDialog(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const upgradePlanMutation = useMutation({
    mutationFn: async (plan: 'pro' | 'enterprise') => {
      const response = await fetch('/api/billing/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!response.ok) throw new Error('Failed to upgrade plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      toast({
        title: 'Plan Updated',
        description: 'Your subscription has been upgraded successfully.',
      });
      setShowUpgradeDialog(false);
      analytics.track('upgrade_click', { plan: selectedPlan });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to upgrade plan. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const downloadInvoice = async (invoiceId: string) => {
    try {
      analytics.track('cta_click', { action: 'download_invoice' });
      toast({
        title: 'Download Started',
        description: 'Your invoice is being downloaded.',
      });
      // In a real app, this would download the PDF
      window.open(`/api/invoices/${invoiceId}/pdf`, '_blank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download invoice.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No billing information available.</p>
        </div>
      </div>
    );
  }

  const currentPlan = PLANS[data.subscription.plan];

  return (
    <>
      <Helmet>
        <title>Billing & Subscription - FlashFusion</title>
        <meta name="description" content="Manage your subscription, payment methods, and billing history." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>

          {/* Alert for cancelled subscription */}
          {data.subscription.cancelAtPeriodEnd && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be cancelled on{' '}
                {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}.
                You will retain access until then.
              </AlertDescription>
            </Alert>
          )}

          {/* Current Subscription */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Subscription</CardTitle>
                    <CardDescription>
                      Your active plan and billing cycle
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      data.subscription.status === 'active'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {data.subscription.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      {data.subscription.plan === 'pro' && (
                        <Zap className="h-5 w-5 text-yellow-500" />
                      )}
                      {data.subscription.plan === 'enterprise' && (
                        <Shield className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <p className="text-3xl font-bold mt-1">
                      ${currentPlan.price}
                      <span className="text-sm text-muted-foreground font-normal">
                        /month
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Current billing period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(data.subscription.currentPeriodStart).toLocaleDateString()}{' '}
                      -{' '}
                      {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {data.subscription.plan !== 'enterprise' && (
                  <Button onClick={() => setShowUpgradeDialog(true)}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                )}
                {data.subscription.plan !== 'free' && !data.subscription.cancelAtPeriodEnd && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Usage Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>
                  Current usage across services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Generations</span>
                    <span className="text-sm text-muted-foreground">
                      {data.usage.generations.limit === -1
                        ? `${data.usage.generations.used} (Unlimited)`
                        : `${data.usage.generations.used} / ${data.usage.generations.limit}`}
                    </span>
                  </div>
                  {data.usage.generations.limit !== -1 && (
                    <Progress
                      value={(data.usage.generations.used / data.usage.generations.limit) * 100}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Calls</span>
                    <span className="text-sm text-muted-foreground">
                      {data.usage.apiCalls.used.toLocaleString()} /{' '}
                      {data.usage.apiCalls.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(data.usage.apiCalls.used / data.usage.apiCalls.limit) * 100}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-muted-foreground">
                      {data.usage.storage.used} GB / {data.usage.storage.limit} GB
                    </span>
                  </div>
                  <Progress
                    value={(data.usage.storage.used / data.usage.storage.limit) * 100}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {method.brand} ending in {method.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="outline">Default</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.number}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invoice.currency} ${invoice.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === 'paid'
                              ? 'default'
                              : invoice.status === 'open'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You will retain access
              until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelSubscriptionMutation.mutate()}
              disabled={cancelSubscriptionMutation.isPending}
            >
              {cancelSubscriptionMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your needs
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {(Object.keys(PLANS) as Array<'free' | 'pro' | 'enterprise'>)
              .filter((key) => key !== 'free')
              .map((planKey) => {
                const plan = PLANS[planKey];
                return (
                  <Card
                    key={planKey}
                    className={`cursor-pointer transition-colors ${
                      selectedPlan === planKey
                        ? 'border-primary'
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedPlan(planKey)}
                  >
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        ${plan.price}
                        <span className="text-sm text-muted-foreground font-normal">
                          /month
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => upgradePlanMutation.mutate(selectedPlan as 'pro' | 'enterprise')}
              disabled={upgradePlanMutation.isPending}
            >
              {upgradePlanMutation.isPending ? 'Upgrading...' : 'Upgrade Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

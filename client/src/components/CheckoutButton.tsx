import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Check } from 'lucide-react';
import { redirectToCheckout, type PlanType, getPlanName, formatPrice, getPlanPrice } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  plan: PlanType;
  userId: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  showPrice?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * CheckoutButton Component
 *
 * A reusable button component that initiates Stripe Checkout flow
 * for upgrading/subscribing to a plan.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CheckoutButton plan="pro" userId={user.id} />
 *
 * // Custom button with callbacks
 * <CheckoutButton
 *   plan="enterprise"
 *   userId={user.id}
 *   variant="outline"
 *   size="lg"
 *   showPrice
 *   onSuccess={() => console.log('Checkout started')}
 *   onError={(error) => console.error(error)}
 * >
 *   Upgrade to Enterprise
 * </CheckoutButton>
 * ```
 */
export function CheckoutButton({
  plan,
  userId,
  variant = 'default',
  size = 'default',
  className = '',
  children,
  disabled = false,
  showPrice = false,
  onSuccess,
  onError,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!userId) {
      const errorMsg = 'You must be logged in to upgrade your plan';
      toast({
        title: 'Authentication Required',
        description: errorMsg,
        variant: 'destructive',
      });
      onError?.(errorMsg);
      return;
    }

    if (plan === 'free') {
      const errorMsg = 'Free plan does not require checkout';
      toast({
        title: 'Invalid Plan',
        description: errorMsg,
        variant: 'destructive',
      });
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await redirectToCheckout(plan, userId);

      if (error) {
        throw new Error(error);
      }

      // If we get here, redirect is in progress
      onSuccess?.();

      // Show success toast
      toast({
        title: 'Redirecting to Checkout',
        description: 'Please wait while we redirect you to Stripe Checkout...',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout';

      console.error('Checkout error:', error);

      toast({
        title: 'Checkout Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  // Default button text based on plan
  const defaultButtonText = children || (
    <>
      {showPrice ? (
        <>
          Upgrade to {getPlanName(plan)} - {formatPrice(getPlanPrice(plan))}/mo
        </>
      ) : (
        <>
          Upgrade to {getPlanName(plan)}
        </>
      )}
    </>
  );

  return (
    <Button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {defaultButtonText}
        </>
      )}
    </Button>
  );
}

interface ManageSubscriptionButtonProps {
  userId: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * ManageSubscriptionButton Component
 *
 * A button component that redirects users to Stripe Customer Portal
 * to manage their subscription (cancel, update payment method, etc.)
 *
 * @example
 * ```tsx
 * <ManageSubscriptionButton userId={user.id} />
 * ```
 */
export function ManageSubscriptionButton({
  userId,
  variant = 'outline',
  size = 'default',
  className = '',
  children = 'Manage Subscription',
  disabled = false,
  onSuccess,
  onError,
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    if (!userId) {
      const errorMsg = 'You must be logged in to manage your subscription';
      toast({
        title: 'Authentication Required',
        description: errorMsg,
        variant: 'destructive',
      });
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const { redirectToPortal } = await import('@/lib/stripe');
      const { error } = await redirectToPortal(userId);

      if (error) {
        throw new Error(error);
      }

      // If we get here, redirect is in progress
      onSuccess?.();

      // Show success toast
      toast({
        title: 'Redirecting to Customer Portal',
        description: 'Please wait while we redirect you to manage your subscription...',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access customer portal';

      console.error('Portal error:', error);

      toast({
        title: 'Portal Access Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children}
        </>
      )}
    </Button>
  );
}

interface PlanCardProps {
  plan: PlanType;
  userId: string;
  currentPlan?: PlanType;
  features?: string[];
  className?: string;
  recommended?: boolean;
}

/**
 * PlanCard Component
 *
 * A complete pricing card with plan details and checkout button.
 * Perfect for pricing pages.
 *
 * @example
 * ```tsx
 * <PlanCard
 *   plan="pro"
 *   userId={user.id}
 *   currentPlan={user.plan}
 *   recommended
 * />
 * ```
 */
export function PlanCard({
  plan,
  userId,
  currentPlan,
  features = [],
  className = '',
  recommended = false,
}: PlanCardProps) {
  const planName = getPlanName(plan);
  const planPrice = getPlanPrice(plan);
  const isCurrentPlan = currentPlan === plan;

  return (
    <div
      className={`relative rounded-lg border ${
        recommended ? 'border-primary shadow-lg scale-105' : 'border-border'
      } ${className} p-6 flex flex-col`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
          Recommended
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">{planName}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{formatPrice(planPrice)}</span>
          {plan !== 'free' && <span className="text-muted-foreground">/month</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <Button disabled className="w-full">
          Current Plan
        </Button>
      ) : plan === 'free' ? (
        <Button variant="outline" className="w-full" disabled>
          Downgrade Available
        </Button>
      ) : (
        <CheckoutButton
          plan={plan}
          userId={userId}
          className="w-full"
          variant={recommended ? 'default' : 'outline'}
        />
      )}
    </div>
  );
}

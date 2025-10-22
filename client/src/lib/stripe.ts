import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe.js with your publishable key
// Make sure to set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be limited.');
}

// Singleton instance of Stripe
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe.js instance (lazy loaded)
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise || Promise.resolve(null);
}

/**
 * Plan type definition
 */
export type PlanType = 'free' | 'pro' | 'enterprise';

/**
 * Plan configuration
 */
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    usageLimit: 10,
    features: [
      '10 AI generations per month',
      'Basic templates',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29, // $29/month
    usageLimit: 100,
    features: [
      '100 AI generations per month',
      'Premium templates',
      'Priority support',
      'Advanced features',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99, // $99/month
    usageLimit: -1, // Unlimited
    features: [
      'Unlimited AI generations',
      'All templates',
      'Dedicated support',
      'Custom features',
      'API access',
    ],
  },
} as const;

/**
 * Redirect to Stripe Checkout for a specific plan
 */
export async function redirectToCheckout(
  plan: PlanType,
  userId: string
): Promise<{ error?: string }> {
  try {
    if (plan === 'free') {
      throw new Error('Free plan does not require checkout');
    }

    // Create checkout session on backend
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        plan,
        userId,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Stripe checkout error:', error);
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to redirect to checkout',
    };
  }
}

/**
 * Redirect to Stripe Customer Portal for managing subscription
 */
export async function redirectToPortal(userId: string): Promise<{ error?: string }> {
  try {
    // Create portal session on backend
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Customer Portal
    window.location.href = url;

    return {};
  } catch (error) {
    console.error('Error redirecting to portal:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to redirect to portal',
    };
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price from cents (Stripe uses cents)
 */
export function formatPriceFromCents(cents: number, currency: string = 'USD'): string {
  return formatPrice(cents / 100, currency);
}

/**
 * Get plan name by type
 */
export function getPlanName(plan: PlanType): string {
  return PLANS[plan]?.name || 'Unknown';
}

/**
 * Get plan price by type
 */
export function getPlanPrice(plan: PlanType): number {
  return PLANS[plan]?.price || 0;
}

/**
 * Get plan features by type
 */
export function getPlanFeatures(plan: PlanType): string[] {
  return PLANS[plan]?.features || [];
}

/**
 * Get plan usage limit by type
 */
export function getPlanUsageLimit(plan: PlanType): number {
  return PLANS[plan]?.usageLimit || 0;
}

/**
 * Check if a plan is a paid plan
 */
export function isPaidPlan(plan: PlanType): boolean {
  return plan !== 'free';
}

/**
 * Get all plans
 */
export function getAllPlans(): typeof PLANS {
  return PLANS;
}

/**
 * Compare plans (returns true if newPlan is an upgrade)
 */
export function isUpgrade(currentPlan: PlanType, newPlan: PlanType): boolean {
  const planOrder: Record<PlanType, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  return planOrder[newPlan] > planOrder[currentPlan];
}

/**
 * Compare plans (returns true if newPlan is a downgrade)
 */
export function isDowngrade(currentPlan: PlanType, newPlan: PlanType): boolean {
  const planOrder: Record<PlanType, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  return planOrder[newPlan] < planOrder[currentPlan];
}

/**
 * Get usage percentage
 */
export function getUsagePercentage(currentUsage: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  if (limit === 0) return 100;
  return Math.min((currentUsage / limit) * 100, 100);
}

/**
 * Check if user is at usage limit
 */
export function isAtUsageLimit(currentUsage: number, limit: number): boolean {
  if (limit === -1) return false; // Unlimited
  return currentUsage >= limit;
}

/**
 * Get usage warning level (returns 'none', 'warning', or 'danger')
 */
export function getUsageWarningLevel(
  currentUsage: number,
  limit: number
): 'none' | 'warning' | 'danger' {
  const percentage = getUsagePercentage(currentUsage, limit);

  if (percentage >= 100) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'none';
}

/**
 * Format usage display (e.g., "5 of 10 used" or "50 used" for unlimited)
 */
export function formatUsage(currentUsage: number, limit: number): string {
  if (limit === -1) {
    return `${currentUsage} used`;
  }
  return `${currentUsage} of ${limit} used`;
}

import Stripe from 'stripe';
import { storage } from './storage';
import type { Request, Response } from 'express';

// Initialize Stripe with API key from environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover' as any, // Use latest API version
  typescript: true,
});

// Plan price mapping
// These should match your Stripe Price IDs in your Stripe Dashboard
export const PLAN_PRICES = {
  free: {
    priceId: null, // Free plan has no Stripe price
    name: 'Free',
    usageLimit: 10,
    features: ['10 AI generations per month', 'Basic templates', 'Community support'],
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly', // Replace with actual Stripe Price ID
    name: 'Pro',
    usageLimit: 100,
    features: ['100 AI generations per month', 'Premium templates', 'Priority support', 'Advanced features'],
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly', // Replace with actual Stripe Price ID
    name: 'Enterprise',
    usageLimit: -1, // Unlimited
    features: ['Unlimited AI generations', 'All templates', 'Dedicated support', 'Custom features', 'API access'],
  },
} as const;

export type PlanType = keyof typeof PLAN_PRICES;

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  plan: PlanType,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    if (plan === 'free') {
      throw new Error('Free plan does not require checkout');
    }

    const planConfig = PLAN_PRICES[plan];
    if (!planConfig.priceId) {
      throw new Error(`No price ID configured for plan: ${plan}`);
    }

    // Get user from database
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create or retrieve Stripe customer
    let customerId = await getStripeCustomerId(userId, user.email || undefined);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(
  userId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  try {
    // Get user from database
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get or create Stripe customer
    const customerId = await getStripeCustomerId(userId, user.email || undefined);

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Get or create Stripe customer ID for a user
 */
async function getStripeCustomerId(userId: string, email?: string): Promise<string> {
  // In a production app, you'd store the Stripe customer ID in the database
  // For now, we'll search for existing customer or create a new one

  try {
    if (email) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        return customers.data[0].id;
      }
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error getting/creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    res.status(500).send('Webhook secret not configured');
    return;
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).send('Webhook handler failed');
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan as PlanType;

  if (!userId || !plan) {
    console.error('Missing userId or plan in checkout session metadata');
    return;
  }

  console.log(`Checkout session completed for user ${userId}, plan: ${plan}`);

  // Update user plan in database
  await updateUserSubscription(userId, plan, 'active');
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  const plan = subscription.metadata?.plan as PlanType;

  if (!userId || !plan) {
    console.error('Missing userId or plan in subscription metadata');
    return;
  }

  console.log(`Subscription created for user ${userId}, plan: ${plan}`);

  // Update user plan in database
  await updateUserSubscription(userId, plan, subscription.status);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  const plan = subscription.metadata?.plan as PlanType;

  if (!userId || !plan) {
    console.error('Missing userId or plan in subscription metadata');
    return;
  }

  console.log(`Subscription updated for user ${userId}, plan: ${plan}, status: ${subscription.status}`);

  // Update user plan based on subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await updateUserSubscription(userId, plan, subscription.status);
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    // Downgrade to free plan
    await updateUserSubscription(userId, 'free', subscription.status);
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  console.log(`Subscription deleted for user ${userId}`);

  // Downgrade user to free plan
  await updateUserSubscription(userId, 'free', 'canceled');
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  console.log(`Invoice payment succeeded: ${invoice.id}`);

  // Get subscription from invoice
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan as PlanType;

    if (userId && plan) {
      // Reset usage limit for the new billing period
      const planConfig = PLAN_PRICES[plan];
      await storage.updateUserUsage(userId, 0); // Reset to 0 for new billing period
      console.log(`Usage reset for user ${userId} after successful payment`);
    }
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log(`Invoice payment failed: ${invoice.id}`);

  // Get subscription from invoice
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const userId = subscription.metadata?.userId;

    if (userId) {
      // You might want to send an email notification here
      // or temporarily restrict access until payment is resolved
      console.warn(`Payment failed for user ${userId}`);
    }
  }
}

/**
 * Update user subscription in database
 */
async function updateUserSubscription(
  userId: string,
  plan: PlanType,
  status: string
): Promise<void> {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    const planConfig = PLAN_PRICES[plan];

    // In a real application, you would extend the storage module to support updating plan and usage limit
    // For now, we'll log the update that needs to happen
    console.log(`Update user ${userId}:`, {
      plan,
      usageLimit: planConfig.usageLimit,
      status,
    });

    // This would be the ideal implementation:
    // await storage.updateUserPlan(userId, {
    //   plan,
    //   usageLimit: planConfig.usageLimit,
    //   subscriptionStatus: status,
    // });

    // Since we don't have updateUserPlan method, we can use updateUserUsage to at least update the limit
    // You'll need to extend the storage module to support full plan updates
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

/**
 * Get price information for all plans
 */
export function getPlanPrices(): typeof PLAN_PRICES {
  return PLAN_PRICES;
}

/**
 * Validate if a plan exists
 */
export function isValidPlan(plan: string): plan is PlanType {
  return plan in PLAN_PRICES;
}

/**
 * Get user's current subscription status from Stripe
 */
export async function getUserSubscription(userId: string): Promise<{
  plan: PlanType;
  status: string;
  currentPeriodEnd?: Date;
} | null> {
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.email) {
      return null;
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return { plan: 'free', status: 'active' };
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { plan: 'free', status: 'active' };
    }

    const subscription = subscriptions.data[0];
    const plan = (subscription.metadata?.plan as PlanType) || 'free';

    return {
      plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

# Stripe Payment Integration Guide

This document provides comprehensive information about the Stripe payment integration in FlashFusion.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Client Components](#client-components)
6. [Webhook Events](#webhook-events)
7. [Testing](#testing)
8. [Production Deployment](#production-deployment)

## Overview

FlashFusion includes a complete Stripe payment integration supporting:

- **Subscription Plans**: Free, Pro, and Enterprise tiers
- **Checkout Flow**: Secure Stripe Checkout for plan upgrades
- **Customer Portal**: Self-service subscription management
- **Webhook Handling**: Automatic subscription status updates
- **Usage Tracking**: Plan-based usage limits and monitoring

## Setup Instructions

### 1. Install Dependencies

Dependencies are already included in package.json:
- `stripe` (backend)
- `@stripe/stripe-js` (frontend)

### 2. Configure Stripe Account

1. **Create a Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**: https://dashboard.stripe.com/apikeys
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

3. **Create Products and Prices**:
   - Go to https://dashboard.stripe.com/products
   - Create two products:
     - **Pro Plan** ($29/month)
     - **Enterprise Plan** ($99/month)
   - For each product, create a **recurring monthly price**
   - Copy the Price IDs (start with `price_`)

4. **Configure Webhooks**:
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)

### 3. Set Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Stripe Price IDs
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
```

## Architecture

### Server-Side (`/server/stripe.ts`)

- **Stripe SDK Initialization**: Configured with secret key
- **Checkout Session Creation**: Generates secure checkout URLs
- **Customer Portal Sessions**: Creates self-service portal links
- **Webhook Handler**: Processes subscription events
- **Plan Management**: Handles plan configurations and pricing

### Client-Side (`/client/src/lib/stripe.ts`)

- **Stripe.js Loading**: Lazy-loads Stripe.js library
- **Checkout Redirect**: Initiates checkout flow
- **Portal Redirect**: Opens customer portal
- **Utility Functions**: Price formatting, plan comparisons, usage tracking

### Routes (`/server/routes.ts`)

- `POST /api/stripe/create-checkout-session` - Start checkout
- `POST /api/stripe/create-portal-session` - Open portal
- `POST /api/stripe/webhook` - Receive webhooks

### Components (`/client/src/components/CheckoutButton.tsx`)

- `<CheckoutButton />` - Upgrade plan button
- `<ManageSubscriptionButton />` - Manage subscription button
- `<PlanCard />` - Complete pricing card with checkout

## API Endpoints

### Create Checkout Session

**Endpoint**: `POST /api/stripe/create-checkout-session`

**Request Body**:
```json
{
  "plan": "pro" | "enterprise",
  "userId": "user-123",
  "successUrl": "https://your-app.com/dashboard?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://your-app.com/pricing"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_..."
}
```

**Example Usage**:
```typescript
const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: 'pro',
    userId: user.id,
    successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/pricing`,
  }),
});

const { sessionId } = await response.json();
```

### Create Portal Session

**Endpoint**: `POST /api/stripe/create-portal-session`

**Request Body**:
```json
{
  "userId": "user-123",
  "returnUrl": "https://your-app.com/dashboard"
}
```

**Response**:
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

### Webhook Endpoint

**Endpoint**: `POST /api/stripe/webhook`

**Headers Required**:
- `stripe-signature` - Webhook signature for verification

**Handled Events**:
- `checkout.session.completed` - Checkout completed successfully
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment successful (resets usage)
- `invoice.payment_failed` - Payment failed (notify user)

## Client Components

### CheckoutButton

Initiates the Stripe Checkout flow for plan upgrades.

**Basic Usage**:
```tsx
import { CheckoutButton } from '@/components/CheckoutButton';

function PricingPage() {
  return (
    <CheckoutButton
      plan="pro"
      userId={user.id}
    />
  );
}
```

**Advanced Usage**:
```tsx
<CheckoutButton
  plan="enterprise"
  userId={user.id}
  variant="outline"
  size="lg"
  showPrice
  onSuccess={() => console.log('Checkout started')}
  onError={(error) => console.error(error)}
>
  Upgrade to Enterprise
</CheckoutButton>
```

**Props**:
- `plan` (required): 'free' | 'pro' | 'enterprise'
- `userId` (required): User ID for subscription
- `variant`: Button style variant
- `size`: Button size
- `className`: Additional CSS classes
- `children`: Custom button text
- `disabled`: Disable button
- `showPrice`: Show price in button text
- `onSuccess`: Success callback
- `onError`: Error callback

### ManageSubscriptionButton

Opens the Stripe Customer Portal for subscription management.

**Usage**:
```tsx
import { ManageSubscriptionButton } from '@/components/CheckoutButton';

function SettingsPage() {
  return (
    <ManageSubscriptionButton
      userId={user.id}
    >
      Manage Billing
    </ManageSubscriptionButton>
  );
}
```

**Props**:
- `userId` (required): User ID
- `variant`: Button style variant
- `size`: Button size
- `className`: Additional CSS classes
- `children`: Custom button text
- `disabled`: Disable button
- `onSuccess`: Success callback
- `onError`: Error callback

### PlanCard

Complete pricing card with plan details and checkout button.

**Usage**:
```tsx
import { PlanCard } from '@/components/CheckoutButton';
import { getPlanFeatures } from '@/lib/stripe';

function PricingPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard
        plan="free"
        userId={user.id}
        currentPlan={user.plan}
        features={getPlanFeatures('free')}
      />
      <PlanCard
        plan="pro"
        userId={user.id}
        currentPlan={user.plan}
        features={getPlanFeatures('pro')}
        recommended
      />
      <PlanCard
        plan="enterprise"
        userId={user.id}
        currentPlan={user.plan}
        features={getPlanFeatures('enterprise')}
      />
    </div>
  );
}
```

## Webhook Events

The webhook handler automatically processes the following events:

### checkout.session.completed
- **Triggered**: When checkout is completed
- **Action**: Updates user plan to subscribed tier

### customer.subscription.created
- **Triggered**: When subscription is created
- **Action**: Activates user's subscription

### customer.subscription.updated
- **Triggered**: When subscription changes (upgrade/downgrade)
- **Action**: Updates user's plan and limits

### customer.subscription.deleted
- **Triggered**: When subscription is cancelled
- **Action**: Downgrades user to free plan

### invoice.payment_succeeded
- **Triggered**: On successful payment
- **Action**: Resets usage counter for new billing period

### invoice.payment_failed
- **Triggered**: When payment fails
- **Action**: Logs warning (optionally notify user)

## Testing

### Test Mode

Stripe provides test mode for development:

1. Use test API keys (starting with `sk_test_` and `pk_test_`)
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0027 6000 3184`
   - Declined: `4000 0000 0000 0002`
3. Use any future expiry date and any 3-digit CVC

### Testing Webhooks Locally

Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### Test Checkout Flow

1. Start your development server
2. Navigate to your pricing page
3. Click upgrade button
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify webhook events in Stripe Dashboard

## Production Deployment

### Pre-Deployment Checklist

- [ ] Switch to live API keys (`sk_live_`, `pk_live_`)
- [ ] Update Stripe Price IDs to production prices
- [ ] Configure production webhook endpoint
- [ ] Test webhook delivery in production
- [ ] Enable webhook signature verification
- [ ] Set up error monitoring for failed payments
- [ ] Configure customer email notifications in Stripe
- [ ] Review Stripe Security settings
- [ ] Enable 3D Secure for payments (recommended)
- [ ] Set up tax collection if required

### Security Best Practices

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Verify webhook signatures** - Always verify `stripe-signature` header
3. **Use HTTPS** - Stripe requires HTTPS for webhooks
4. **Validate user input** - Check plan validity before creating sessions
5. **Rate limit endpoints** - Prevent abuse of checkout creation
6. **Log webhook events** - Monitor for suspicious activity
7. **Handle errors gracefully** - Don't expose internal errors to users

### Monitoring

Monitor these metrics in production:

- Successful checkouts
- Failed payments
- Webhook delivery failures
- Subscription cancellations
- Customer portal access
- Error rates on payment endpoints

### Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe Dashboard](https://dashboard.stripe.com)

## Plan Configuration

Current plan configuration in `server/stripe.ts`:

```typescript
export const PLAN_PRICES = {
  free: {
    priceId: null,
    name: 'Free',
    usageLimit: 10,
    features: ['10 AI generations per month', 'Basic templates', 'Community support'],
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    name: 'Pro',
    usageLimit: 100,
    features: ['100 AI generations per month', 'Premium templates', 'Priority support', 'Advanced features'],
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    name: 'Enterprise',
    usageLimit: -1, // Unlimited
    features: ['Unlimited AI generations', 'All templates', 'Dedicated support', 'Custom features', 'API access'],
  },
};
```

To modify plans:
1. Update the plan configuration in `server/stripe.ts`
2. Update the plan configuration in `client/src/lib/stripe.ts`
3. Create corresponding products/prices in Stripe Dashboard
4. Update environment variables with new Price IDs

## Troubleshooting

### Common Issues

**Issue**: "STRIPE_SECRET_KEY is not set"
- **Solution**: Add `STRIPE_SECRET_KEY` to your `.env` file

**Issue**: "Webhook signature verification failed"
- **Solution**: Ensure `STRIPE_WEBHOOK_SECRET` is correct and webhook endpoint uses raw body

**Issue**: "Stripe failed to load"
- **Solution**: Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly

**Issue**: "No price ID configured for plan"
- **Solution**: Set `STRIPE_PRO_PRICE_ID` and `STRIPE_ENTERPRISE_PRICE_ID` in `.env`

**Issue**: Webhook events not received
- **Solution**: Verify webhook URL is correct and accessible from internet

## Next Steps

After setting up Stripe integration:

1. **Extend User Schema**: Add fields for `stripeCustomerId`, `subscriptionId`, `subscriptionStatus`
2. **Update Storage Module**: Add methods to update user subscription details
3. **Email Notifications**: Send confirmation emails on subscription changes
4. **Analytics**: Track conversion rates and subscription metrics
5. **A/B Testing**: Test different pricing and features
6. **Referral Program**: Offer credits for referrals
7. **Annual Plans**: Add yearly subscription options with discount
8. **Trial Periods**: Implement free trial for Pro/Enterprise plans

## Support

For issues or questions about the Stripe integration:
1. Check this documentation
2. Review Stripe Documentation
3. Check application logs for errors
4. Test with Stripe test mode
5. Contact support if needed

# Stripe Integration Quick Start

Get your Stripe payment integration up and running in 5 minutes.

## Step 1: Get Stripe API Keys

1. Sign up at https://dashboard.stripe.com/register
2. Go to https://dashboard.stripe.com/test/apikeys
3. Copy your **Publishable key** and **Secret key**

## Step 2: Create Products in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**

### Create Pro Plan
- Name: `Pro Plan`
- Price: `$29` USD
- Billing period: `Monthly`
- Click **"Save product"**
- Copy the **Price ID** (starts with `price_`)

### Create Enterprise Plan
- Name: `Enterprise Plan`
- Price: `$99` USD
- Billing period: `Monthly`
- Click **"Save product"**
- Copy the **Price ID** (starts with `price_`)

## Step 3: Set Up Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. Enter your endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Click **"Select events"**
5. Choose these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **"Add endpoint"**
7. Copy the **Signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

Add to your `.env` file:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

# Stripe Price IDs
STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
STRIPE_ENTERPRISE_PRICE_ID=price_YOUR_ENTERPRISE_PRICE_ID
```

## Step 5: Use in Your App

### Add Checkout Button to Pricing Page

```tsx
import { CheckoutButton } from '@/components/CheckoutButton';

export function PricingPage() {
  const user = useUser(); // Your user hook

  return (
    <div>
      <h1>Choose Your Plan</h1>

      {/* Pro Plan */}
      <div>
        <h2>Pro - $29/month</h2>
        <CheckoutButton
          plan="pro"
          userId={user.id}
          showPrice
        />
      </div>

      {/* Enterprise Plan */}
      <div>
        <h2>Enterprise - $99/month</h2>
        <CheckoutButton
          plan="enterprise"
          userId={user.id}
          showPrice
        />
      </div>
    </div>
  );
}
```

### Add Subscription Management to Settings

```tsx
import { ManageSubscriptionButton } from '@/components/CheckoutButton';

export function SettingsPage() {
  const user = useUser();

  return (
    <div>
      <h1>Billing Settings</h1>
      <p>Current Plan: {user.plan}</p>

      <ManageSubscriptionButton userId={user.id}>
        Manage Billing
      </ManageSubscriptionButton>
    </div>
  );
}
```

### Use Complete Pricing Cards

```tsx
import { PlanCard } from '@/components/CheckoutButton';
import { PLANS } from '@/lib/stripe';

export function PricingPage() {
  const user = useUser();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard
        plan="free"
        userId={user.id}
        currentPlan={user.plan}
        features={PLANS.free.features}
      />

      <PlanCard
        plan="pro"
        userId={user.id}
        currentPlan={user.plan}
        features={PLANS.pro.features}
        recommended
      />

      <PlanCard
        plan="enterprise"
        userId={user.id}
        currentPlan={user.plan}
        features={PLANS.enterprise.features}
      />
    </div>
  );
}
```

## Step 6: Test the Integration

### Test Checkout Flow

1. Start your development server: `npm run dev`
2. Navigate to your pricing page
3. Click "Upgrade to Pro"
4. Use test card number: `4242 4242 4242 4242`
5. Expiry: Any future date (e.g., `12/25`)
6. CVC: Any 3 digits (e.g., `123`)
7. Complete the checkout

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:5000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Test Cards

Use these test cards during development:

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0027 6000 3184` | Requires 3D Secure authentication |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

## Common Issues

### "STRIPE_SECRET_KEY is not set"
**Solution**: Add the key to your `.env` file and restart the server

### "Stripe failed to load"
**Solution**: Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set and starts with `pk_`

### Webhook not receiving events
**Solution**: Make sure your webhook URL is publicly accessible. For local testing, use Stripe CLI

### "No price ID configured"
**Solution**: Set `STRIPE_PRO_PRICE_ID` and `STRIPE_ENTERPRISE_PRICE_ID` in `.env`

## Next Steps

- ✅ Set up Stripe account and get API keys
- ✅ Create products and prices
- ✅ Configure webhook endpoint
- ✅ Set environment variables
- ✅ Add checkout buttons to your app
- ✅ Test with test cards
- 📖 Read full documentation: [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)
- 🚀 Deploy to production with live keys

## Going Live

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Create **live products and prices**
3. Get **live API keys** (start with `sk_live_` and `pk_live_`)
4. Update `.env` with live keys
5. Configure **production webhook** endpoint
6. Test checkout flow with real card (in small amount)
7. Monitor in Stripe Dashboard

## Resources

- 📚 [Full Integration Guide](./STRIPE_INTEGRATION.md)
- 🔗 [Stripe Dashboard](https://dashboard.stripe.com)
- 📖 [Stripe Docs](https://stripe.com/docs)
- 🧪 [Testing Guide](https://stripe.com/docs/testing)
- 💬 [Stripe Support](https://support.stripe.com)

---

**Questions?** Check the [full documentation](./STRIPE_INTEGRATION.md) or contact support.

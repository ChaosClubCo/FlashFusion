# Vercel Deployment Guide for FlashFusion

## Overview

FlashFusion is configured for seamless deployment on Vercel with Supabase database integration.

**Your Supabase Project:** `gcqfqzhgludrzkfajljp`

---

## 🚀 Quick Deployment

### Step 1: Connect to Vercel

If you haven't already:

1. Go to https://vercel.com/new
2. Import your GitHub repository: `ChaosClubCo/FlashFusion`
3. Vercel will auto-detect the framework (Vite + Express)

### Step 2: Add Environment Variables

In Vercel Dashboard:

1. Go to your project: **Settings → Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

#### **Required Variables:**

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `DATABASE_URL` | `postgres://postgres.gcqfqzhgludrzkfajljp:[password]@aws-0-[region].pooler.supabase.com:6543/postgres` | Supabase → Settings → Database → Connection String (Transaction mode) |
| `SUPABASE_URL` | `https://gcqfqzhgludrzkfajljp.supabase.co` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase → Settings → API → service_role (keep secret!) |
| `NODE_ENV` | `production` | Set manually |

#### **Optional Variables (for full features):**

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `OPENAI_API_KEY` | `sk-...` | AI code generation |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI endpoint (if using Replit proxy, use their URL) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | `sk-...` | Alternative OpenAI key |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Payment processing |
| `STRIPE_PRO_PRICE_ID` | `price_...` | Pro plan price ID |
| `STRIPE_ENTERPRISE_PRICE_ID` | `price_...` | Enterprise plan price ID |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signature verification |

---

## 📝 Detailed Instructions

### Getting Supabase Credentials

#### 1. Database Connection String
```
Supabase Dashboard → Settings → Database → Connection String
→ Select "Connection pooling"
→ Select "Transaction" mode
→ Copy the URI
```

**Format:**
```
postgres://postgres.gcqfqzhgludrzkfajljp:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password (found in Supabase → Settings → Database).

#### 2. API Credentials
```
Supabase Dashboard → Settings → API
```

Copy:
- **Project URL**: `https://gcqfqzhgludrzkfajljp.supabase.co`
- **anon public**: Safe for client-side use
- **service_role**: Server-only, keep secret!

### Adding Variables in Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/[your-username]/flashfusion/settings/environment-variables
2. For each variable:
   - Click **"Add New"**
   - Enter **Name** (e.g., `DATABASE_URL`)
   - Enter **Value** (paste your credential)
   - Select environments: ✅ Production ✅ Preview ✅ Development
   - Click **"Save"**

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add DATABASE_URL
# Paste your value when prompted
# Select: Production, Preview, Development

vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

#### Method 3: vercel.json (Not Recommended for Secrets)

⚠️ **Don't use this for secrets!** Only for non-sensitive config.

```json
{
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 🔧 Build Configuration

Vercel should auto-detect your configuration, but verify:

### Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Root Directory

- **Root Directory:** `./` (project root)

### Node.js Version

- **Node.js Version:** 22.x (configured in `.node-version` or package.json)

---

## 🧪 Testing Your Deployment

### 1. Test Preview Deployment

When you push to a branch:

```bash
git push origin your-branch
```

Vercel automatically creates a preview deployment:
- Check: https://vercel.com/[your-username]/flashfusion/deployments
- Click on the preview URL
- Test all features

### 2. Test Production Deployment

When you merge to main:

```bash
git checkout main
git merge your-branch
git push origin main
```

Vercel deploys to production:
- URL: `https://flashfusion.vercel.app` (or your custom domain)

### 3. Verify Environment Variables

Check if variables are loaded:

```bash
# In your deployed app
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 🚨 GitHub Actions + Vercel

### Current Setup

The Lighthouse CI workflow uses **mock database credentials** for testing:

```yaml
env:
  DATABASE_URL: postgresql://ci:ci@localhost:5432/lighthouse_ci_test
  NODE_ENV: test
```

This is intentional - Lighthouse only needs to build the app, not connect to a real database.

### If You Want Real Database in CI

Add these GitHub Secrets:

1. Go to: https://github.com/ChaosClubCo/FlashFusion/settings/secrets/actions
2. Add:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Update `.github/workflows/lighthouse-ci.yml`:
   ```yaml
   env:
     DATABASE_URL: ${{ secrets.DATABASE_URL }}
     SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
   ```

**Recommendation:** Keep mock credentials for CI. It's faster and more secure.

---

## 🔐 Security Best Practices

### Environment Variable Scope

| Variable | Safe for Client? | Notes |
|----------|------------------|-------|
| `SUPABASE_URL` | ✅ Yes | Public URL |
| `SUPABASE_ANON_KEY` | ✅ Yes | Protected by RLS |
| `DATABASE_URL` | ❌ No | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No | Full admin access |
| `STRIPE_SECRET_KEY` | ❌ No | Server-only |
| `OPENAI_API_KEY` | ❌ No | Server-only |

### Row Level Security (RLS)

Enable RLS on all Supabase tables:

```sql
-- In Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

### Vercel-Specific Security

- ✅ **Automatic HTTPS** - Vercel provides SSL certificates
- ✅ **Environment encryption** - Variables are encrypted at rest
- ✅ **Preview deployments** - Safe to test with production secrets
- ✅ **Vercel Firewall** - Optional DDoS protection

---

## 📊 Monitoring & Logs

### Vercel Dashboard

1. **Deployments:** https://vercel.com/[your-username]/flashfusion/deployments
2. **Analytics:** Built-in Web Vitals tracking
3. **Logs:** Real-time function logs

### Supabase Dashboard

1. **Database Logs:** https://supabase.com/dashboard/project/gcqfqzhgludrzkfajljp/logs/postgres-logs
2. **API Logs:** Track authentication and API calls
3. **Performance:** Monitor query performance

---

## 🐛 Troubleshooting

### Common Issues

#### "Error: DATABASE_URL must be set"

**Cause:** Environment variable not configured in Vercel

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add `DATABASE_URL`
3. Redeploy: Vercel → Deployments → ⋯ → Redeploy

#### "Build failed: MODULE_NOT_FOUND"

**Cause:** Missing dependencies

**Fix:**
```bash
# Locally
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

#### "Timeout connecting to database"

**Cause:** Wrong connection string or network issue

**Fix:**
1. Verify you're using **Connection Pooling** URL (not Direct Connection)
2. Verify **Transaction mode** (not Session mode)
3. Check Supabase is in "Active" state

#### "Environment variables not loading"

**Cause:** Variables not set for all environments

**Fix:**
1. Vercel → Settings → Environment Variables
2. For each variable, check: ✅ Production ✅ Preview ✅ Development
3. Redeploy after adding variables

#### "Stripe webhook signature verification failed"

**Cause:** `STRIPE_WEBHOOK_SECRET` not set or incorrect

**Fix:**
1. Stripe Dashboard → Developers → Webhooks
2. Add webhook endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Copy the signing secret
4. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 🎯 Deployment Checklist

Before going live:

- [ ] All environment variables added to Vercel
- [ ] Database connection string uses Connection Pooling (Transaction mode)
- [ ] RLS enabled on all Supabase tables
- [ ] Tested preview deployment
- [ ] Verified `/api/health` endpoint returns healthy
- [ ] Custom domain configured (if applicable)
- [ ] Stripe webhook endpoint configured
- [ ] OpenAI API key has sufficient credits
- [ ] Analytics tracking working
- [ ] Error monitoring set up

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Your Supabase Project:** https://supabase.com/dashboard/project/gcqfqzhgludrzkfajljp
- **Your GitHub Repo:** https://github.com/ChaosClubCo/FlashFusion

---

## 🆘 Need Help?

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **FlashFusion Issues:** https://github.com/ChaosClubCo/FlashFusion/issues

---

**Last Updated:** 2025-10-22
**For Project:** FlashFusion (Supabase ID: gcqfqzhgludrzkfajljp)

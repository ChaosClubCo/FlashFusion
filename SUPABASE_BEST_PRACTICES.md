# Supabase & GitHub Actions Best Practices for FlashFusion

## Overview

This document outlines best practices for handling Supabase credentials and database connections in FlashFusion, particularly for GitHub Actions CI/CD workflows.

## Current Setup

### Environment Variables

FlashFusion requires the following environment variables:

**Required for Production:**
- `DATABASE_URL` - Postgres connection string from Supabase
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (server-only, treat as secret)

**Optional:**
- `OPENAI_API_KEY` - For AI code generation
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_PRO_PRICE_ID` - Pro plan Stripe price ID
- `STRIPE_ENTERPRISE_PRICE_ID` - Enterprise plan Stripe price ID

## GitHub Secrets Configuration

### Adding Secrets to Repository

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add the following secrets:

```
DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Where to Find Supabase Values

**Supabase Dashboard → Settings:**

1. **Database → Connection string**
   - Connection pooling → Transaction mode
   - Copy the URI and use as `DATABASE_URL`

2. **API → Project URL**
   - Copy as `SUPABASE_URL`

3. **API → Project API keys**
   - `anon` / `public` key → Copy as `SUPABASE_ANON_KEY`
   - `service_role` key → Copy as `SUPABASE_SERVICE_ROLE_KEY`

## CI/CD Workflow Configuration

### Current Lighthouse CI Setup

The Lighthouse CI workflow now uses a **mock DATABASE_URL** for testing:

```yaml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    env:
      # Mock database URL for CI - not a real database connection
      DATABASE_URL: postgresql://ci:ci@localhost:5432/lighthouse_ci_test
      NODE_ENV: test
```

**Why mock credentials?**
- Lighthouse CI only needs to build the app, not connect to a real database
- Avoids exposing production credentials in CI logs
- Faster execution (no network calls)
- Works without provisioning a test database

### For Tests Requiring Real Database

If you need actual database access in CI (e.g., integration tests):

```yaml
jobs:
  integration-tests:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      NODE_ENV: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm test
```

## Security Best Practices

### 1. Secret Separation

**Client-side (safe to expose):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**Server-side only (must be secret):**
- `DATABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `OPENAI_API_KEY`

### 2. Row Level Security (RLS)

Always enable RLS on Supabase tables:

```sql
-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
ON your_table FOR SELECT
USING (auth.uid() = user_id);
```

This ensures that even if `SUPABASE_ANON_KEY` is exposed, users can only access their own data.

### 3. Never Commit Secrets

**Already protected:**
- `.env` is in `.gitignore`
- `.env.example` contains only placeholders

**Double-check:**
```bash
# Audit your repo for accidentally committed secrets
git log -p | grep -i "database_url\|supabase_service"
```

### 4. Rotate Keys Regularly

If a key is leaked:

1. **Immediately:**
   - Go to Supabase Dashboard → Settings → API
   - Click "Reset" next to the compromised key
   - Update GitHub Secrets with new value

2. **Update production:**
   - Deploy with new credentials
   - Verify functionality

3. **Audit:**
   - Check access logs for suspicious activity
   - Review recent commits for exposure

### 5. Minimal Privilege Principle

**GitHub Actions:**
- Only inject secrets in jobs that need them
- Use separate workflows for different security levels
- Never log secret values (GitHub auto-masks them, but be careful)

**Database Access:**
- Use `SUPABASE_ANON_KEY` for all client operations
- Use `SUPABASE_SERVICE_ROLE_KEY` only for:
  - Server-side admin operations
  - Migration scripts
  - Scheduled jobs

## Local Development

### Setup `.env` File

1. Copy the example:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   SUPABASE_URL=https://[project-ref].supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

3. **Never commit `.env`** - it's already in `.gitignore`

## Production Deployment

### Deployment Platform Configuration

For production deployments (Vercel, Netlify, Railway, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Use the **same variable names** as in `.env.example`
3. Ensure `NODE_ENV=production` is set
4. Enable automatic deployment from your main branch

### Health Checks

Add a health check endpoint to verify database connectivity:

```typescript
// server/routes.ts
app.get('/api/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});
```

## Troubleshooting

### Common Issues

**1. "DATABASE_URL must be set"**
- **Cause:** Environment variable not configured
- **Fix:** Set `DATABASE_URL` in GitHub Secrets or `.env` file

**2. "Missing queryFn" in useQuery**
- **Cause:** React Query hook without fetch function
- **Fix:** Already fixed in commit `4d1a0c0`

**3. "Connection timeout" in CI**
- **Cause:** Trying to connect to real database from CI
- **Fix:** Use mock `DATABASE_URL` for build-only workflows

**4. "Invalid database password"**
- **Cause:** Supabase password contains special characters
- **Fix:** URL-encode the password or use connection pooler

### Getting Help

- **Supabase Docs:** https://supabase.com/docs
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **FlashFusion Issues:** https://github.com/ChaosClubCo/FlashFusion/issues

## Monitoring & Observability

### Recommended Setup

1. **Supabase Dashboard:**
   - Monitor database performance
   - Check API request logs
   - Review authentication events

2. **GitHub Actions:**
   - Review workflow runs regularly
   - Set up notifications for failed builds
   - Monitor secret usage in audit logs

3. **Application Logs:**
   - Log database connection errors
   - Track API response times
   - Monitor authentication failures

## Migration Strategy

When adding new environment variables:

1. Update `.env.example` with placeholder
2. Add to `SUPABASE_BEST_PRACTICES.md` (this file)
3. Update GitHub Secrets
4. Update production deployment configuration
5. Document in PR description

## Checklist for New Team Members

- [ ] Read this document
- [ ] Get Supabase project access
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in Supabase credentials from dashboard
- [ ] Test local development with `npm run dev`
- [ ] Verify you can build with `npm run build`
- [ ] Confirm you have GitHub Secrets access (if needed)
- [ ] Review Row Level Security policies in Supabase

---

**Last Updated:** $(date +%Y-%m-%d)
**Author:** Claude Code Assistant
**Version:** 1.0

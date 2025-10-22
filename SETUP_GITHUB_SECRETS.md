# GitHub Secrets Setup for FlashFusion

## Quick Setup Instructions

Your Supabase project ID is: `gcqfqzhgludrzkfajljp`

### Step 1: Navigate to GitHub Secrets

1. Go to: https://github.com/ChaosClubCo/FlashFusion/settings/secrets/actions
2. Click **"New repository secret"**

### Step 2: Add These Secrets

Add each secret one at a time:

#### **SECRET 1: DATABASE_URL**
```
Name: DATABASE_URL
Value: postgres://postgres.gcqfqzhgludrzkfajljp:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```
**Where to find:** Supabase Dashboard → Settings → Database → Connection String → Transaction mode

**Important:** Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

---

#### **SECRET 2: SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://gcqfqzhgludrzkfajljp.supabase.co
```
**Where to find:** Supabase Dashboard → Settings → API → Project URL

---

#### **SECRET 3: SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGci... (your anon public key)
```
**Where to find:** Supabase Dashboard → Settings → API → Project API keys → anon / public

**Safe for client-side:** This key is safe to use in browser/client code.

---

#### **SECRET 4: SUPABASE_SERVICE_ROLE_KEY**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGci... (your service_role key)
```
**Where to find:** Supabase Dashboard → Settings → API → Project API keys → service_role

**⚠️ CRITICAL:** This is a secret key with admin privileges. NEVER expose in client code or commit to git.

---

### Step 3: Optional Secrets (For Full Features)

#### **OPENAI_API_KEY** (for AI code generation)
```
Name: OPENAI_API_KEY
Value: sk-... (your OpenAI API key)
```
**Where to get:** https://platform.openai.com/api-keys

---

#### **Stripe Keys** (for payment processing)
```
Name: STRIPE_SECRET_KEY
Value: sk_test_... or sk_live_...

Name: STRIPE_PRO_PRICE_ID
Value: price_... (Pro plan price ID)

Name: STRIPE_ENTERPRISE_PRICE_ID
Value: price_... (Enterprise plan price ID)
```
**Where to get:** https://dashboard.stripe.com/apikeys

---

## Verification

After adding all secrets, your secrets list should show:

✅ DATABASE_URL
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ OPENAI_API_KEY (optional)
✅ STRIPE_SECRET_KEY (optional)
✅ STRIPE_PRO_PRICE_ID (optional)
✅ STRIPE_ENTERPRISE_PRICE_ID (optional)

**Note:** Secret values are hidden after creation - this is normal and secure.

---

## Testing

### Test Locally (Development)

1. Create `.env` file in project root:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   ```env
   DATABASE_URL=postgres://postgres.gcqfqzhgludrzkfajljp:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   SUPABASE_URL=https://gcqfqzhgludrzkfajljp.supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

3. Test the connection:
   ```bash
   npm run dev
   ```

4. Check the console - you should see:
   ```
   Server listening on http://localhost:5000
   Database connected
   ```

### Test GitHub Actions

1. Push a commit to trigger the workflow
2. Go to: https://github.com/ChaosClubCo/FlashFusion/actions
3. Wait for the "Lighthouse CI" workflow to complete
4. ✅ It should pass all steps

---

## Troubleshooting

### Common Issues

**"Invalid database password"**
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check for special characters - they may need URL encoding
- Try resetting your database password in Supabase

**"Connection timeout"**
- Verify your IP is allowed in Supabase (should be "Allow all" for development)
- Check if you're using the correct pooler URL (Transaction mode)

**"Secrets not found"**
- Secrets are only available to workflows on branches in your repo, not forks
- Check spelling of secret names (case-sensitive)
- Re-run the workflow after adding secrets

**"TypeError: Cannot read properties of undefined"**
- Make sure all required secrets are added
- Check that secret names match exactly (no extra spaces)

---

## Security Checklist

- [ ] Never commit `.env` to git (already in `.gitignore`)
- [ ] Keep `SUPABASE_SERVICE_ROLE_KEY` server-only
- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Use `SUPABASE_ANON_KEY` for client-side operations only
- [ ] Rotate keys if they're ever exposed
- [ ] Monitor Supabase logs for suspicious activity

---

## Next Steps

After setting up secrets:

1. ✅ **Merge the PR** when CI passes
2. ✅ **Set up database tables** in Supabase (see `shared/schema.ts` for schema)
3. ✅ **Enable RLS policies** for security
4. ✅ **Test all features** locally
5. ✅ **Deploy to production** with same secrets

---

**Need Help?**
- Check `SUPABASE_BEST_PRACTICES.md` for detailed documentation
- Review `STRIPE_INTEGRATION.md` for payment setup
- Open an issue if you encounter problems

**Your Project:**
- Supabase Project: `gcqfqzhgludrzkfajljp`
- Supabase URL: `https://gcqfqzhgludrzkfajljp.supabase.co`
- GitHub Repo: https://github.com/ChaosClubCo/FlashFusion

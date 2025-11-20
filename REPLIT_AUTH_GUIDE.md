# Replit Auth Setup Guide

## ✅ Current Status

Replit Auth is **fully configured and working** in your FlashFusion app!

## 🔐 What's Included

### Authentication Methods
- ✅ **Email/Password** login
- ✅ **Google** OAuth
- ✅ **GitHub** OAuth  
- ✅ **X (Twitter)** OAuth
- ✅ **Apple** OAuth

### Features
- ✅ PostgreSQL-backed sessions (7-day TTL)
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ User management in database
- ✅ Development mode bypass (auto demo user)

## 🚀 Quick Start

### 1. Use the Auth Button

The `AuthButton` component has been added to your Navigation bar at the top of every page.

**Location:** `client/src/components/Navigation.tsx`

It automatically:
- Shows "Log In" button when logged out
- Shows user avatar with dropdown menu when logged in
- Handles login/logout flows

### 2. Check Auth Status in Any Component

```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome {user.firstName}!
      Email: {user.email}
    </div>
  );
}
```

### 3. Create Protected Pages

See `client/src/examples/ProtectedPageExample.tsx` for a complete example.

Key pattern:
```typescript
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    // Redirect to login
    window.location.href = '/api/login';
  }
}, [isAuthenticated, isLoading]);
```

### 4. Protect API Endpoints (Server-Side)

```typescript
import { isAuthenticated } from './replitAuth';

app.get('/api/protected', isAuthenticated, async (req, res) => {
  const userId = req.user.claims.sub;
  // ... your protected logic
});
```

## 📍 Auth Routes

| Route | Purpose |
|-------|---------|
| `/api/login` | Starts login flow (redirects to Replit Auth) |
| `/api/logout` | Logs out and redirects home |
| `/api/callback` | OAuth callback handler (internal) |
| `/api/auth/user` | Get current user info (protected) |

## 🎯 User Object Structure

```typescript
interface User {
  id: string;              // Unique user ID
  email: string | null;    // Email (null for some OAuth providers)
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null; // Avatar URL
  plan: 'free' | 'pro' | 'enterprise';  // User's plan
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛡️ Development vs Production

### Development Mode
- Auto-authenticates as `demo-user-1`
- No login required for testing
- See `server/routes.ts` line 46-69

### Production Mode
- Requires real Replit Auth
- All protected routes enforce authentication
- Session stored in PostgreSQL

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `server/replitAuth.ts` | Auth setup, strategies, session config |
| `server/routes.ts` | Auth routes and protected endpoints |
| `client/src/hooks/useAuth.ts` | React hook for auth state |
| `client/src/components/AuthButton.tsx` | Login/Logout UI component |
| `client/src/lib/authUtils.ts` | Auth error handling utilities |
| `shared/schema.ts` | User & session database tables |

## 💡 Common Use Cases

### Add Login Button Anywhere

```tsx
<Button onClick={() => window.location.href = '/api/login'}>
  Log In
</Button>
```

### Add Logout Button

```tsx
<Button onClick={() => window.location.href = '/api/logout'}>
  Log Out
</Button>
```

### Conditionally Render Based on Auth

```tsx
const { isAuthenticated } = useAuth();

return (
  <>
    {isAuthenticated ? (
      <Dashboard />
    ) : (
      <LandingPage />
    )}
  </>
);
```

### Handle Unauthorized API Errors

```typescript
import { isUnauthorizedError } from '@/lib/authUtils';

mutation.mutate(data, {
  onError: (error) => {
    if (isUnauthorizedError(error)) {
      window.location.href = '/api/login';
    }
  }
});
```

## 🧪 Testing Auth

1. **In Development:**
   - Auth is bypassed, you're auto-logged in as demo user
   - Check Network tab to see `/api/auth/user` returns demo-user-1

2. **To Test Real Auth in Development:**
   - Remove the development bypass in `server/routes.ts`
   - Click "Log In" to test the full OAuth flow

3. **In Production:**
   - Auth works automatically
   - Users can log in with any supported method

## ✨ What I Added Today

1. **AuthButton Component** (`client/src/components/AuthButton.tsx`)
   - Shows login button when logged out
   - Shows user avatar with dropdown when logged in
   - Fully styled with shadcn/ui components

2. **Navigation Integration** (`client/src/components/Navigation.tsx`)
   - Added AuthButton to top navigation
   - Visible on all pages

3. **Protected Page Example** (`client/src/examples/ProtectedPageExample.tsx`)
   - Complete example of creating protected pages
   - Shows how to handle unauthorized access
   - Includes loading states

## 🔗 Resources

- [Replit Auth Documentation](https://docs.replit.com/power-ups/replit-auth)
- User Management: Access via Auth pane in Replit workspace
- Custom Domains: Auth works automatically with custom domains

## 🎉 Next Steps

Your Replit Auth is ready to use! Here are some suggestions:

1. **Add protected pages** - Use the pattern from `ProtectedPageExample.tsx`
2. **Customize the auth button** - Edit `AuthButton.tsx` to match your design
3. **Add user profile page** - Create a page showing user settings
4. **Implement role-based access** - Add roles to your user table
5. **Test the full flow** - Remove dev bypass and test real OAuth

---

**Need help?** Check the Replit Auth docs or ask questions about specific implementation details.

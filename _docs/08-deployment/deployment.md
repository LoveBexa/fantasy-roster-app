# 08 — Deployment & Environment

## Hosting

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend hosting + serverless functions | `https://vercel.com/dashboard` |
| Supabase | Database + Auth + Storage | `https://supabase.com/dashboard` |

---

## Environment Variables

### Required Variables

```bash
# .env.local (local development)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

> **`NEXT_PUBLIC_`** prefix means these are exposed to the browser — this is intentional and safe for Supabase's anon key (which is protected by Row Level Security).

Google OAuth credentials (Client ID + Secret) are configured in the **Supabase Dashboard**, not in the Next.js app env.

### Setting in Vercel

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` → value → All environments
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` → value → All environments
4. Redeploy for changes to take effect

---

## Supabase Client Setup

### Browser Client (client components)
`lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Used by `components/login-form.tsx` for `signInWithOAuth({ provider: "google" })`.

### Server Client (server components + route handlers)
`lib/supabase/server.ts`

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components cannot write cookies; proxy handles refresh.
          }
        },
      },
    }
  )
}
```

> **Next.js 16:** `cookies()` is async — always `await cookies()`.

### Proxy — session refresh (Next.js 16)
`proxy.ts` (project root)

Next.js 16 renamed `middleware.ts` → `proxy.ts`. The current implementation refreshes the Supabase session on each request. **Route protection redirects are not enabled yet** — add them here when signup/login routes are finalised.

```typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse = NextResponse.next({ request })
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

**Planned route protection** (not yet in repo):

```typescript
// After getUser():
// if (!user && !isPublicPath) redirect to `/`
// if (user && pathname === `/`) redirect to `/dashboard`
```

---

## OAuth Callback Route

`app/auth/callback/route.ts` — exchanges the Supabase auth `code` for a session and sets cookies on the response.

```typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const redirectUrl = `${origin}${next}`
    const supabaseResponse = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return supabaseResponse
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
```

**Post-login destination:** `/dashboard` (main app shell with league table UI).

---

## Local development checklist

1. Copy env vars from Supabase → Project Settings → API into `.env.local`
2. Run migrations `001`–`009` in SQL Editor (see [`../03-database/schema.md`](../03-database/schema.md))
3. Configure Google OAuth redirect URLs (below)
4. `npm run dev` → homepage at `http://localhost:3000` · sign in at `/login`
5. Optional demo data: `supabase/seed/demo_roster_players.sql` (replace user id first)

### Data visible in Supabase but not in the app?

The Table Editor bypasses RLS. The app only shows rows where `user_id = auth.uid()`.

See [`../03-database/seed-and-troubleshooting.md`](../03-database/seed-and-troubleshooting.md) for:
- Comparing `auth.users.id` vs `roster_players.user_id`
- Fixing mismatched user ids after seed SQL
- Confirming `.env.local` points at the same Supabase project

Quick check:

```sql
select id, email from auth.users where email = 'your@gmail.com';
```

That `id` must match every `user_id` on your roster rows.

---

## Google OAuth — External Configuration

### Google Cloud Console

OAuth 2.0 client → **Authorized redirect URIs**:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Example: `https://cftxmauuchicnmurwxmk.supabase.co/auth/v1/callback`

### Supabase Dashboard

**Authentication → Providers → Google**
- Enable provider
- Paste Google Client ID and Client Secret

**Authentication → URL Configuration**
- **Site URL** (production): your Vercel URL, e.g. `https://your-app.vercel.app` — **not** `http://localhost:3000` (if Site URL is localhost, Google OAuth on Vercel will redirect users to localhost)
- **Site URL** (local): `http://localhost:3000`
- **Site URL** (prod): `https://your-app.vercel.app`
- **Redirect URLs** (add all that apply):
  - `http://localhost:3000/auth/callback`
  - `https://your-app.vercel.app/auth/callback`

Email sign-up and password reset also use `/auth/callback` — ensure the Email provider is enabled under **Authentication → Providers**.

### Login flow (end-to-end)

1. User clicks **Continue with Google** or submits email/password on `/login`
2. Google: `signInWithOAuth` → Google via Supabase → `/auth/callback?code=...`
3. Email/password: `signInWithPassword` → session set in browser
4. Email sign-up confirm / password reset: email link → `/auth/callback?next=/dashboard` or `/reset-password`
5. Callback exchanges code, sets session cookies
6. User lands on `/dashboard`

---

## Deploying to Vercel

### First Deploy

```bash
# 1. Initialise git
git init
git add .
git commit -m "initial commit"

# 2. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/level-up-roster.git
git push -u origin main

# 3. Import in Vercel
# → vercel.com → Add New Project → Import from GitHub
# → Select level-up-roster repo
# → Framework: Next.js (auto-detected)
# → Add env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
# → Deploy
```

### Subsequent Deploys

```bash
git add .
git commit -m "your commit message"
git push
# Vercel auto-deploys on push to main
```

### Preview Deployments

Every PR/branch push creates a preview URL automatically — use these for testing before merging to main.

---

## App Configuration Notes

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config (requires Next.js 16+ — `.ts` not supported on Next 9) |
| `package.json` | Pin `"next": "16.2.6"` — do not downgrade to Next 9 |
| `app/layout.tsx` | `suppressHydrationWarning` on `<html>` / `<body>` avoids console noise from browser extensions (e.g. Grammarly) |

---

## Monitoring

- **Vercel Analytics**: Enable in Vercel dashboard → Analytics tab
- **Supabase Logs**: Dashboard → Logs → API logs / Auth logs
- **Error monitoring** (post-MVP): Add Sentry `npm install @sentry/nextjs`

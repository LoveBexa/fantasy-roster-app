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

### Setting in Vercel

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` → value → All environments
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` → value → All environments
4. Redeploy for changes to take effect

---

## Supabase Client Setup

### Browser Client (use in client components)
`lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server Client (use in server components + route handlers)
`lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Middleware (protect routes)
`middleware.ts` (project root)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* same as server.ts */ } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login
  if (!user && !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from auth pages
  if (user && (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/league', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
```

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

## Supabase Auth Redirect URLs

After enabling Google/Apple OAuth in Supabase, add these redirect URLs:

In Supabase → Authentication → URL Configuration:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: 
  - `https://your-app.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

Create `app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(`${origin}/league`)
}
```

---

## Monitoring

- **Vercel Analytics**: Enable in Vercel dashboard → Analytics tab
- **Supabase Logs**: Dashboard → Logs → API logs / Auth logs
- **Error monitoring** (post-MVP): Add Sentry `npm install @sentry/nextjs`

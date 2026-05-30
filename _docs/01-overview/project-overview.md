# 01 — Project Overview

## What Is Level Up Roster?

Level Up Roster is a **dating performance tracker** for women who want to date intentionally. Users add the people they're dating ("roster players"), log daily behaviours against a points system, and see everyone ranked in a live League Table.

The tagline: **"Good dates. Good data. Good energy."**

---

## Core Concept

- Each person you're dating is a **Roster Player**
- You log **daily stat entries** — behaviours (positive or negative) that happened
- Every behaviour has a **point value** (+3 to +15, or -4 to -20)
- Players accumulate points → ranked in the **League Table**
- The app surfaces patterns: who's rising, who's a red flag, who's consistent

---

## Target User

Women (primarily 25–40) who are actively dating multiple people and want to:
1. Cut through emotional fog with objective data
2. Spot patterns before they become problems
3. Make smarter decisions about where to invest their energy

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) | SSR, routing, server components, Turbopack dev |
| Language | TypeScript | Type safety at scale |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Database | Supabase (Postgres) | Auth + DB + Storage in one |
| ORM | Supabase JS client (`@supabase/supabase-js`) | Type-safe DB queries |
| Deployment | Vercel | Zero-config Next.js hosting |
| AI Coding | Cursor + v0.dev | Accelerated development |

---

## Build Phases

### ✅ Phase 0 — Machine Setup
Node.js LTS, VS Code / Cursor, GitHub account

### ✅ Phase 1 — Accounts
Supabase project `level-up-roster`, Vercel connected to GitHub

### ✅ Phase 2 — Project Scaffold
`npx create-next-app@latest`, Supabase client installed, shadcn/ui initialised, `.env.local` configured

### ✅ Phase 3 — Database
All tables created, RLS enabled, seed data loaded (40 scoring behaviours)

### ✅ Phase 4 — Auth *(partially complete)*
- Login UI at `/` (`app/page.tsx`) with split hero + form layout
- **Google OAuth** — live via Supabase (`signInWithOAuth` → `/auth/callback` → `/dashboard`)
- Email/password + Apple buttons — UI only (not wired yet)
- Supabase clients: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Session refresh: `proxy.ts` (Next.js 16; replaces legacy `middleware.ts`)

### 🔄 Phase 5–6 — Dashboard & League Table *(current)*
- **Dashboard page** at `/dashboard` — sidebar, top bar, daily stat input, league table, right rail (UI with mock data)
- Components in `components/dashboard/`
- League table aggregation query + live data — still to do
- Remaining dashboard routes (`/roster`, `/daily-stats`, etc.) — not built yet

### ⏳ Phase 7 — Deploy
Push to GitHub, import to Vercel, add env vars, go live

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Set in:
- Local: `.env.local` in project root
- Production: Vercel → Project Settings → Environment Variables

---

## Project Folder Structure

```
level-up-roster/
├── app/
│   ├── auth/
│   │   └── callback/route.ts   ← OAuth code exchange → redirect /dashboard
│   ├── dashboard/
│   │   └── page.tsx            ← main app shell (stat input + league table)
│   ├── league/
│   │   └── page.tsx            ← legacy placeholder (not used post-login)
│   ├── layout.tsx              ← root layout (fonts, suppressHydrationWarning)
│   └── page.tsx                ← login page (route `/`)
├── components/
│   ├── ui/                     ← shadcn components
│   ├── dashboard/              ← AppSidebar, TopBar, LeagueTable, etc.
│   ├── login-form.tsx
│   ├── login-hero.tsx
│   └── site-navbar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← browser client (@supabase/ssr)
│   │   └── server.ts           ← async server client
│   └── utils.ts
├── proxy.ts                    ← Supabase session refresh (Next.js 16)
├── next.config.ts
└── .env.local
```

Planned (not yet in repo): `app/(auth)/signup`, separate dashboard sub-routes, `types/database.ts`.

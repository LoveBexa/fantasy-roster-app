# 01 — Project Overview

## What Is Level Up Roster?

Level Up Roster (branded **The Roster** in the UI) is a **dating performance tracker** for women who want to date intentionally. Users add the people they're dating ("roster players"), log daily behaviours against a points system, and see everyone ranked in a live League Table.

The tagline: **"Good dates. Good data. Good energy."**

---

## Core Concept

- Each person you're dating is a **Roster Player** (nickname, emoji, status, relationship type)
- You log **daily stat entries** — behaviours (positive or negative) that happened
- Every behaviour has a **point value** (from the `scoring_behaviors` seed table)
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
| Framework | Next.js 16 (App Router) | SSR, routing, server components |
| Language | TypeScript | Type safety at scale |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Database | Supabase (Postgres) | Auth + DB in one |
| DB client | `@supabase/supabase-js` + `@supabase/ssr` | Browser + server clients |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Build Phases

### ✅ Phase 0–3 — Setup & Database
Scaffold, Supabase project, all core tables, RLS, 40 scoring behaviours seeded.

### ✅ Phase 4 — Auth
- Login at `/login` — **Google OAuth + email/password**
- Sign up at `/signup` — email/password + optional nickname
- Forgot / reset password at `/forgot-password`, `/reset-password`
- OAuth callback: `app/auth/callback/route.ts` → `/dashboard`
- Clients: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Session refresh: `proxy.ts` (Next.js 16)

### ✅ Phase 5–6 — Core app + marketing (live data)
- **`/`** — Marketing homepage (`lib/landing/landing-content.ts`)
- **`/dashboard`** — League table from Supabase (`lib/league/league-table.ts`)
- **`/stats`** — Daily stat entry save (`lib/stats/stat-entries.ts`)
- **`/roster`** — Full roster CRUD via server actions (`app/roster/actions.ts`)
- **`/account`** — Profile, nickname, avatar emoji in `user_profiles`
- **`/about`**, **`/how-it-works`** — Marketing pages
- **Mobile nav** — `AppBottomNav` below `lg`

### 🔄 Phase 6 — Polish (in progress)
- Dashboard right rail still mock (MVP cards, awards)
- Route protection in `proxy.ts` not enforced
- Stat entry upsert for same-day re-save not built
- Player photo upload to Storage not wired

### ⏳ Phase 7 — Deploy
Push to GitHub, Vercel env vars, production OAuth URLs.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Set in `.env.local` locally and Vercel project settings for production.

---

## Project Folder Structure

```
fantasy-roster-app/
├── app/
│   ├── auth/callback/route.ts     ← OAuth / email confirm code exchange
│   ├── login/page.tsx             ← Login
│   ├── signup/page.tsx            ← Sign up
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── dashboard/page.tsx         ← League table (live)
│   ├── (dashboard)/stats/page.tsx ← Daily stats (live)
│   ├── roster/
│   │   ├── page.tsx               ← My Roster (live)
│   │   └── actions.ts             ← Server actions for CRUD
│   ├── account/page.tsx           ← Account settings
│   ├── about/page.tsx             ← Marketing
│   ├── how-it-works/page.tsx      ← Marketing
│   ├── layout.tsx
│   └── page.tsx                   ← Marketing homepage (/)
├── components/
│   ├── ui/                        ← shadcn
│   ├── landing/                   ← Homepage sections
│   ├── dashboard/                 ← Sidebar, bottom nav, league table, stat input
│   ├── roster/                    ← Roster table, add/edit/delete
│   ├── account/                   ← Account page content
│   ├── about/                     ← About page content
│   ├── how-it-works/              ← How it works content
│   ├── login-form.tsx
│   ├── login-hero.tsx
│   ├── signup-form.tsx
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   ├── hero-sticky-note.tsx
│   ├── editorial-block.tsx
│   └── site-navbar.tsx
├── lib/
│   ├── db/columns.ts              ← Table + column name constants
│   ├── landing/landing-content.ts ← Homepage editable copy
│   ├── roster/players.ts          ← Roster fetch + helpers
│   ├── stats/stat-entries.ts      ← Behaviours fetch + stat save
│   ├── stats/behavior-icons.ts    ← Icon map per behaviour
│   ├── league/league-table.ts     ← Rankings, form, consistency, snapshots
│   ├── auth/                      ← user-display, user-profile, user-profile-db, get-session-user
│   └── supabase/                  ← client, server, errors
├── supabase/
│   ├── migrations/                ← 001–009 SQL migrations
│   └── seed/demo_roster_players.sql
├── proxy.ts                       ← Session refresh
└── .env.local
```

---

## Key lib modules

| Module | Purpose |
|--------|---------|
| `lib/db/columns.ts` | Single source of truth for Supabase table/column names |
| `lib/roster/players.ts` | `fetchRosterPlayers`, create/update/delete |
| `lib/stats/stat-entries.ts` | `fetchScoringBehaviors`, `saveStatEntry`, form chart |
| `lib/league/league-table.ts` | `fetchLeagueTable`, `syncLeagueSnapshots` |
| `lib/auth/get-session-user.ts` | `getSessionUserContext()` — auth user + `user_profiles` row |
| `lib/auth/user-profile-db.ts` | `saveUserProfile`, `fetchUserProfileRow`, `ensureUserProfileRow` |
| `lib/supabase/errors.ts` | `toError()`, `getErrorMessage()` — Supabase returns plain objects |

See [`03-database/seed-and-troubleshooting.md`](../03-database/seed-and-troubleshooting.md) if data exists in Supabase but not on localhost.

# Level Up Roster — Knowledge Base

> Track the patterns. Protect your energy. Win the league.

This folder is the **single source of truth** for product, design, and engineering decisions on **Level Up Roster** (branded in-app as **The Roster**).

For a GitHub-facing overview and local setup, see the [root README](../README.md).

---

## About the project

**Level Up Roster** is a dating performance tracker — fantasy sports for your dating life. Users add people they're seeing as **roster players**, log **daily stat entries** (40 scored behaviours), and view a ranked **League Table** that surfaces who's rising, who's consistent, and who's a red flag.

**Tagline:** *Good dates. Good data. Good energy.*

### Core loop

1. **Add players** to your roster (nickname, emoji, status, relationship type)
2. **Log behaviours** after dates or interactions (points per behaviour from the seed table)
3. **Review rankings** — totals, form trends, consistency %
4. **Decide with data** — where to invest energy, who to bench, who to cut

### Who it's for

Women (primarily 25–40) actively dating who want to spot patterns early, reduce emotional fog, and date more intentionally.

### How this docs folder fits in

| You need… | Start here |
|-----------|------------|
| Vision, phases, folder structure | [`01-overview/project-overview.md`](./01-overview/project-overview.md) |
| Colours, typography, tokens | [`02-design/design-system.md`](./02-design/design-system.md) |
| Tables, RLS, SQL, migrations | [`03-database/schema.md`](./03-database/schema.md) |
| Demo seed data + empty-app troubleshooting | [`03-database/seed-and-troubleshooting.md`](./03-database/seed-and-troubleshooting.md) |
| Feature list + auth status | [`04-features/features.md`](./04-features/features.md) |
| All 40 behaviours + points | [`05-scoring/behaviours-seed.md`](./05-scoring/behaviours-seed.md) |
| Page layouts + routes | [`06-pages/page-specs.md`](./06-pages/page-specs.md) |
| League table logic + UI | [`06-pages/league-table.md`](./06-pages/league-table.md) |
| Component file paths | [`07-components/components-reference.md`](./07-components/components-reference.md) |
| Env vars, OAuth, deploy | [`08-deployment/deployment.md`](./08-deployment/deployment.md) |

---

## 📁 Knowledge base structure

| Folder | Contents |
|--------|----------|
| [`01-overview/`](./01-overview/) | Project vision, tech stack, build phases |
| [`02-design/`](./02-design/) | Brand identity, colours, typography, design tokens |
| [`03-database/`](./03-database/) | Supabase schema, RLS, migrations, seed SQL |
| [`04-features/`](./04-features/) | Feature specs for every app feature |
| [`05-scoring/`](./05-scoring/) | Full trait/behaviour scoring system (all 40 behaviours) |
| [`06-pages/`](./06-pages/) | Page-by-page specs and data requirements |
| [`07-components/`](./07-components/) | Reusable component library reference |
| [`08-deployment/`](./08-deployment/) | Vercel deployment, env vars, CI/CD |

---

## 🚀 Current status

- **Phase 6 — Live data + marketing** (mostly complete)
- **Done**: Marketing homepage (`/`), auth (Google + email/password + signup + forgot password), roster CRUD via server actions, daily stats, league table, account (nickname + emoji in `user_profiles`), mobile bottom nav
- **Partial**: Right rail on dashboard still mock data; route protection not enforced in `proxy.ts`
- **Known gaps**: Duplicate stat entry same day errors (insert-only, no upsert); player photo upload not wired

### Key routes

| Route | File | Status |
|-------|------|--------|
| `/` | `app/page.tsx` | Marketing homepage — hero, features, dashboard preview, join CTA, editorial |
| `/login` | `app/login/page.tsx` | Login — Google OAuth + email/password; forgot password link |
| `/signup` | `app/signup/page.tsx` | Sign up — email/password + Google; optional nickname |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password reset email request |
| `/reset-password` | `app/reset-password/page.tsx` | Set new password after email link |
| `/dashboard` | `app/dashboard/page.tsx` | League table — **live Supabase data** |
| `/stats` | `app/(dashboard)/stats/page.tsx` | Daily stat input — **live save** |
| `/roster` | `app/roster/page.tsx` | My Roster — **live CRUD** (`?add=1` opens add form) |
| `/account` | `app/account/page.tsx` | Profile, nickname, emoji, logout |
| `/about` | `app/about/page.tsx` | Marketing |
| `/how-it-works` | `app/how-it-works/page.tsx` | Marketing |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth / email confirm → session → `/dashboard` |

### Supabase migrations (run in order in SQL Editor)

| File | Purpose |
|------|---------|
| `001_roster_players.sql` | Roster table + RLS |
| `002_stat_entries.sql` | Stat entries + junction table |
| `003_scoring_behaviors.sql` | Behaviours table + 40-row seed |
| `004_roster_players_columns.sql` | Adds emoji, description, etc. on legacy tables |
| `005_table_grants.sql` | Fixes “permission denied for table …” |
| `006_scoring_behaviors_columns.sql` | Adds description, created_at |
| `007_league_player_snapshots.sql` | Daily rank snapshots for form arrows |
| `008_user_profiles.sql` | Nickname + avatar emoji per user (`user_profiles`) |
| `009_roster_players_rls_fix.sql` | Auto-set `user_id` on roster insert + update RLS |
| `010_roster_players_insert_rls_fix.sql` | Security definer trigger + authenticated insert policy |
| `011_roster_players_rls_complete.sql` | **Run this if RLS still fails** — full select/insert/update/delete policies + triggers |

Demo data (optional): `supabase/seed/demo_roster_players.sql` — see [`03-database/seed-and-troubleshooting.md`](./03-database/seed-and-troubleshooting.md).

---

## ⚡ Quick reference

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind
- **Backend**: Supabase (Postgres + Auth)
- **UI Library**: shadcn/ui
- **Deployment**: Vercel
- **Primary colour**: Burgundy / crimson (`--primary` in `app/globals.css`)
- **Column constants**: `lib/db/columns.ts` (American spelling per schema)
- **Data layer**: `lib/roster/`, `lib/stats/`, `lib/league/`

---

## 🔗 Key external links

- Supabase Dashboard: `https://supabase.com/dashboard`
- Vercel Dashboard: `https://vercel.com/dashboard`

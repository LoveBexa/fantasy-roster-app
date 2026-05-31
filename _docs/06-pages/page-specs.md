# 06 — Page Specifications

> **Routing:** Marketing homepage is **`/`**. Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`. Authenticated app: `/dashboard`, `/stats`, `/roster`, `/account`. Marketing: `/about`, `/how-it-works`.

---

## Public pages

### Homepage — `app/page.tsx` *(route `/`)*

**Status**: ✅ Implemented

**Layout**: `SiteNavbar` (sticky) + `LandingPageContent`

**Sections** (edit copy in `lib/landing/landing-content.ts`):
1. Hero — headline, CTAs, `women-looking-phone.png`, pink sticky note
2. Features bar — MVP Tracking, League Tables, etc.
3. Dashboard preview — coded mock table + MVP / consistency / red flags cards
4. How it works — 3-step preview on cream background
5. Join CTA — “Ready to join?” card + floating testimonial sticky notes (desktop only)
6. Editorial block — “Built with AI in 3 Days”

**CTAs:** JOIN THE LEAGUE → `/login` · HOW IT WORKS → `/how-it-works`

---

### Login — `app/login/page.tsx` *(route `/login`)*

**Status**: ✅ Google OAuth + email/password

**Layout**: Split — `LoginHero` (left) + `LoginForm` (right) · `SiteNavbar` above · `EditorialBlock` below

**LoginForm**:
- Email + password login via `signInWithPassword`
- **Continue with Google** — `signInWithOAuth`
- Forgot password → `/forgot-password`
- Sign up link → `/signup`

**OAuth callback**: `app/auth/callback/route.ts` → `/dashboard` on success, `/login?error=auth` on failure.

---

### Sign up — `app/signup/page.tsx` *(route `/signup`)*

**Status**: ✅ Implemented

**Layout**: Centered `SignupForm` · `EditorialBlock` below (no hero image)

**SignupForm**:
- Optional nickname field (saved to `user_profiles` when migration 008 applied)
- Email + password + confirm password
- Google OAuth sign-up
- Link to `/login`

---

### Forgot / reset password

| Route | File | Purpose |
|-------|------|---------|
| `/forgot-password` | `app/forgot-password/page.tsx` | Request reset email (`resetPasswordForEmail`) |
| `/reset-password` | `app/reset-password/page.tsx` | Set new password after email link (`updateUser`) |

Both use centered form layout + editorial block at bottom. Email/password accounts only — Google users reset via Google.

---

### About — `app/about/page.tsx` *(route `/about`)*

**Status**: ✅ Implemented

**Content**: `components/about/about-page-content.tsx` — hero with `four-women.png`, mission copy, CTA → `/signup`.

---

### How it works — `app/how-it-works/page.tsx` *(route `/how-it-works`)*

**Status**: ✅ Implemented

**Content**: `components/how-it-works/how-it-works-content.tsx` — hero with `women-looking-phone.png`, step cards, CTA → `/signup`.

---

## Dashboard pages

Shared shell on authenticated routes:
- `AppSidebar` — desktop nav (hidden below `lg`)
- `AppBottomNav` — mobile nav (below `lg`)
- `TopBar` — search (UI), user dropdown (“Hi, {nickname}”), logout
- `DashboardMain` — main content wrapper
- `PageHeader` — shared title + subtitle pattern

---

### League Table — `app/dashboard/page.tsx` *(route `/dashboard`)*

**Status**: ✅ Live Supabase data

**Purpose**: Primary post-login destination. Ranked league table.

**Main column**: `<LeagueTable />` — period tabs, rank/points/form/consistency grid

**Right rail**: `<RightRail />` — weekly summary / recent entries (**mock data**)

**Empty state:** “Add players” links to `/roster?add=1`

**CTA:** Link to `/stats` for daily stat entry

See [`league-table.md`](./league-table.md) for calculation details.

---

### Daily Stats — `app/(dashboard)/stats/page.tsx` *(route `/stats`)*

**Status**: ✅ Live save to Supabase

**Purpose**: Core data entry — log behaviours for a player on a given date.

**UI**: `components/dashboard/daily-stat-input.tsx`

**Empty state**: No roster players → link to `/roster`

**On save**:
1. Insert `stat_entries` with computed `total_points`
2. Insert rows into `stat_entry_behaviors`
3. Sync league snapshots (if migration 007 applied)

---

### My Roster — `app/roster/page.tsx` *(route `/roster`)*

**Status**: ✅ Live CRUD via server actions

**Purpose**: Manage roster players.

**Query params:** `?add=1` or `?add=true` — opens add player form on load (used from league table empty state)

**UI**: `components/roster/roster-table.tsx`

**Mutations:** `app/roster/actions.ts` — `createRosterPlayerAction`, `updateRosterPlayerAction`, `deleteRosterPlayerAction`

**Data reads:** `fetchRosterPlayers` from `lib/roster/players.ts`

RLS ensures only the signed-in user's rows are returned.

---

### Account — `app/account/page.tsx` *(route `/account`)*

**Status**: ✅ Implemented

**UI**: `components/account/account-page-content.tsx`

**Sections**:
- Avatar emoji picker (saved to `user_profiles.avatar_emoji`)
- Nickname (saved to `user_profiles.nickname`)
- Connected account (Google or email)
- Delete account (placeholder)
- Log out button

**Session context:** `getSessionUserContext()` in `lib/auth/get-session-user.ts`

---

## Planned pages (not built)

| Route | Purpose |
|-------|---------|
| `/scoring` | Reference page for all 40 behaviours |
| `/history` | Chronological entry log |
| `/awards` | MVP, red flag, consistency awards |
| `/settings` | Notifications, data export |

---

## Deprecated

| Route | Notes |
|-------|-------|
| `app/league/page.tsx` | Legacy placeholder — OAuth no longer redirects here |

---

## Navigation (implemented)

**Desktop sidebar** (`AppSidebar`, `lg+`):

| Label | href |
|-------|------|
| League Table | `/dashboard` |
| Daily Stats | `/stats` |
| My Roster | `/roster` |
| Account | `/account` |

**Mobile bottom nav** (`AppBottomNav`, below `lg`): same four routes + icons.

Defined in `components/dashboard/app-nav-items.ts`.

# 06 — Page Specifications

> **Routing:** Login is **`/`** (`app/page.tsx`). Authenticated app uses `/dashboard`, `/stats`, `/roster`, `/account`. Marketing: `/about`, `/how-it-works`.

---

## Public pages

### Login — `app/page.tsx` *(route `/`)*

**Status**: ✅ Google OAuth · 🔲 email/password disabled · 🔲 Apple disabled

**Layout**: Split — `LoginHero` (left) + `LoginForm` (right) · `SiteNavbar` above

**LoginForm**:
- Heading: "Welcome back, Roster Queen."
- Email + password fields rendered but disabled (`emailPasswordDisabled = true`)
- **Continue with Google** — `signInWithOAuth({ provider: "google", redirectTo: "/auth/callback" })`
- Apple button visible, not wired

**OAuth callback**: `app/auth/callback/route.ts` → `/dashboard` on success, `/?error=auth` on failure.

---

### About — `app/about/page.tsx` *(route `/about`)*

**Status**: ✅ Implemented

**Content**: `components/about/about-page-content.tsx` — hero with `four-women.png`, mission copy, contact links.

---

### How it works — `app/how-it-works/page.tsx` *(route `/how-it-works`)*

**Status**: ✅ Implemented

**Content**: `components/how-it-works/how-it-works-content.tsx` — hero with `women-looking-phone.png`, step cards, fantasy vs roster comparison table.

---

## Dashboard pages

Shared shell on authenticated routes:
- `AppSidebar` — League Table, Daily Stats, My Roster, Account, Log out
- `TopBar` — search (UI), user dropdown, logout
- `DashboardMain` — `max-w-5xl px-8 py-8`
- `PageHeader` — shared title + subtitle pattern

---

### League Table — `app/dashboard/page.tsx` *(route `/dashboard`)*

**Status**: ✅ Live Supabase data

**Purpose**: Primary post-login destination. Ranked league table.

**Main column**: `<LeagueTable />` — period tabs, rank/points/form/consistency grid

**Right rail**: `<RightRail />` — MVP, red flag, awards cards (**mock data**)

**Data**: Client fetch via `fetchLeagueTable()` in `components/dashboard/league-table.tsx`

**CTA on dashboard**: Link to `/stats` for daily stat entry (stat input removed from dashboard page).

See [`league-table.md`](./league-table.md) for calculation details.

---

### Daily Stats — `app/(dashboard)/stats/page.tsx` *(route `/stats`)*

**Status**: ✅ Live save to Supabase

**Purpose**: Core data entry — log behaviours for a player on a given date.

**UI**: `components/dashboard/daily-stat-input.tsx`

**Layout**:
- Page header: "DAILY STAT INPUT"
- Player selector (dropdown from roster)
- Date picker
- Behaviour card grid (all 40 behaviours, tooltips for descriptions)
- Live points total
- 7-day form chart (`FormChart`)
- Notes (250 chars)
- Save → `saveStatEntry()` in `lib/stats/stat-entries.ts`

**Empty state**: No roster players → link to `/roster`

**On save**:
1. Insert `stat_entries` with computed `total_points`
2. Insert rows into `stat_entry_behaviors`
3. Sync league snapshots (if migration 007 applied)

---

### My Roster — `app/roster/page.tsx` *(route `/roster`)*

**Status**: ✅ Live CRUD

**Purpose**: Manage roster players.

**UI**: `components/roster/roster-table.tsx`

**Features**:
- Filter by status (All / Active / Reserve / …)
- Sort by last updated, added date, nickname
- Add player form (`AddPlayerForm`) — scrollable emoji picker (~150 emojis)
- Edit dialog (`EditPlayerDialog`) — same emoji picker
- Delete confirmation (`DeletePlayerDialog`)
- Table columns: emoji, nickname, description, status, relationship, dates, actions

**Data**: `fetchRosterPlayers`, `createRosterPlayer`, `updateRosterPlayer`, `deleteRosterPlayer` from `lib/roster/players.ts`

RLS ensures only the signed-in user's rows are returned — no explicit `user_id` filter in query.

---

### Account — `app/account/page.tsx` *(route `/account`)*

**Status**: ✅ Implemented

**UI**: `components/account/account-page-content.tsx`

**Sections**:
- Profile (email, Google connection badge)
- Nickname + avatar emoji (saved to Supabase `user_metadata`)
- Delete account (placeholder — directs to support email)

---

## Planned pages (not built)

| Route | Purpose |
|-------|---------|
| `app/(auth)/signup` | Email signup |
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

## Sidebar navigation (implemented)

| Label | href |
|-------|------|
| League Table | `/dashboard` |
| Daily Stats | `/stats` |
| My Roster | `/roster` |
| Account | `/account` |

Defined in `components/dashboard/app-sidebar.tsx`.

# 04 — Features Specification

## MVP Features

### Authentication

| Capability | Status | Notes |
|------------|--------|-------|
| Google OAuth | ✅ Implemented | `components/login-form.tsx` → `/auth/callback` → `/dashboard` |
| Email/password login | 🔲 Disabled | UI visible; `emailPasswordDisabled = true` — fields non-functional |
| Apple OAuth | 🔲 Disabled | Button visible; not wired |
| Sign up page | ⏳ Not built | Login page links placeholder |
| OAuth callback | ✅ Implemented | `app/auth/callback/route.ts` |
| Session refresh | ✅ Implemented | `proxy.ts` via `getUser()` |
| Protected routes | ⏳ Not enforced | Unauthenticated users can hit `/dashboard` URLs; data empty without session |
| Logout | ✅ Implemented | `lib/auth/use-logout.ts` — sidebar + account |

**Google OAuth setup:** See [`08-deployment/deployment.md`](../08-deployment/deployment.md).

---

### ✅ Roster Management (`/roster`)

| Capability | Status |
|------------|--------|
| List players | ✅ Live from Supabase |
| Add player | ✅ Nickname, emoji, description, status, relationship, notes |
| Edit player | ✅ Dialog with full emoji picker |
| Delete player | ✅ Confirmation dialog |
| Filter by status | ✅ All / Active / Reserve / etc. |
| Sort | ✅ Last updated, added, nickname |
| Photo upload | ⏳ Column exists; UI not wired |

**Data:** `lib/roster/players.ts` · UI: `components/roster/roster-table.tsx`

**Player fields:** nickname, emoji (~150 options), description, status, relationship status, notes (250 chars).

---

### ✅ Daily Stat Entry (`/stats`)

| Capability | Status |
|------------|--------|
| Player dropdown | ✅ From roster |
| Date picker | ✅ Defaults to today |
| Behaviour grid | ✅ All 40 behaviours; icons via `behavior-icons.ts` |
| Live points total | ✅ Sums selected behaviour points |
| Form chart | ✅ Last 7 days per selected player |
| Save entry | ✅ Inserts `stat_entries` + `stat_entry_behaviors` |
| Edit same-day entry | ⏳ Not built — duplicate day throws unique constraint error |
| Notes | ✅ Optional, 250 chars |

**Data:** `lib/stats/stat-entries.ts` · UI: `components/dashboard/daily-stat-input.tsx`

---

### ✅ League Table (`/dashboard`)

| Capability | Status |
|------------|--------|
| Ranked players by points | ✅ Live |
| Period tabs | ✅ Overall / This Season / This Month / This Week |
| Points delta | ✅ Diff between last two entries in period |
| Form arrows | ✅ Rank change day-to-day (up to 3) |
| Consistency % | ✅ From behaviour points last 30 days |
| Daily snapshots | ✅ Upsert on load + after stat save (needs migration 007) |
| Empty state | ✅ CTA to add players / log stats |
| MVP / awards sidebar | 🔲 Mock data in `RightRail` |

**Data:** `lib/league/league-table.ts` · UI: `components/dashboard/league-table.tsx`

---

### ✅ Account (`/account`)

| Capability | Status |
|------------|--------|
| View email / Google connection | ✅ |
| Edit nickname | ✅ Saved to `user_metadata.nickname` |
| Avatar emoji picker | ✅ Saved to `user_metadata.avatar_emoji` |
| Delete account | 🔲 Placeholder action — emails support |

---

### ✅ Marketing pages

| Page | Route | Status |
|------|-------|--------|
| About | `/about` | ✅ `components/about/about-page-content.tsx` |
| How it works | `/how-it-works` | ✅ `components/how-it-works/how-it-works-content.tsx` |
| Site nav links | `SiteNavbar` | ✅ ABOUT · HOW IT WORKS |

---

### ⏳ Not built yet

- Scoring system reference page (`/scoring`)
- History timeline (`/history`)
- Awards page (`/awards`)
- Insights / analytics
- Chat analyser
- Custom behaviours
- Player photo upload to Storage
- Route protection redirects in `proxy.ts`
- Stat entry upsert / edit flow

---

## Post-MVP Features (Backlog)

### 🔮 Insights / Analytics
Trend charts, category breakdown, day-of-week patterns.

### 🔮 Chat Analyser
Paste WhatsApp export → AI suggests stat entry.

### 🔮 Awards System
Season-end badges (Most Consistent, Biggest Glow-Up, etc.).

### 🔮 Attachment Tracker
Track your emotional investment vs their points score.

### 🔮 Notifications
Weekly recap, “haven't logged in 3 days”, red flag alerts.

### 🔮 Custom Behaviours
User-defined behaviour + point value.

### 🔮 Social / Sharing
Anonymous league screenshot, “Dating Season Wrapped” export.

### 🔮 Mobile App
React Native / Expo with push notifications.

---

## Known issues / limitations

| Issue | Workaround |
|-------|------------|
| Data in Supabase but empty on localhost | See [`03-database/seed-and-troubleshooting.md`](../03-database/seed-and-troubleshooting.md) |
| Second save same player same day fails | Delete entry in Supabase or pick different date |
| Snapshots / form arrows missing | Run migration `007_league_player_snapshots.sql` |
| `permission denied for table` | Run migration `005_table_grants.sql` |

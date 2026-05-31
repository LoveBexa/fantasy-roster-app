# 04 — Features Specification

## MVP Features

### Authentication

| Capability | Status | Notes |
|------------|--------|-------|
| Google OAuth | ✅ Implemented | Login + signup → `/auth/callback?next=/dashboard` |
| Email/password login | ✅ Implemented | `signInWithPassword` in `components/login-form.tsx` |
| Email/password signup | ✅ Implemented | `app/signup/page.tsx` — optional nickname on sign up |
| Forgot password | ✅ Implemented | `resetPasswordForEmail` → `/reset-password` via callback |
| Apple OAuth | ❌ Removed | Google-only for social sign-in |
| OAuth callback | ✅ Implemented | `app/auth/callback/route.ts` |
| Session refresh | ✅ Implemented | `proxy.ts` via `getUser()` |
| Protected routes | ⏳ Not enforced | Unauthenticated users can hit `/dashboard` URLs; data empty without session |
| Logout | ✅ Implemented | `lib/auth/use-logout.ts` — sidebar, top bar, account |

**Google OAuth setup:** See [`08-deployment/deployment.md`](../08-deployment/deployment.md).

**Password reset:** Google accounts use Google’s password flow — forgot-password page is for email/password users only.

---

### ✅ Roster Management (`/roster`)

| Capability | Status |
|------------|--------|
| List players | ✅ Live from Supabase |
| Add player | ✅ Server action — nickname, emoji, description, status, relationship, notes |
| Edit player | ✅ Dialog with full emoji picker |
| Delete player | ✅ Confirmation dialog + server action |
| Filter by status | ✅ All / Active / Reserve / etc. |
| Sort | ✅ Last updated, added, nickname |
| Deep link add form | ✅ `/roster?add=1` opens add player form |
| Photo upload | ⏳ Column exists; UI not wired |

**Data:** `lib/roster/players.ts` · **Mutations:** `app/roster/actions.ts` (server actions) · UI: `components/roster/roster-table.tsx`

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
| Empty state | ✅ “Add players” links to `/roster?add=1` |
| MVP / awards sidebar | 🔲 Mock data in `RightRail` |

**Data:** `lib/league/league-table.ts` · UI: `components/dashboard/league-table.tsx`

---

### ✅ Account (`/account`)

| Capability | Status |
|------------|--------|
| View email / Google connection | ✅ |
| Edit nickname | ✅ Saved to `user_profiles.nickname` (migration 008) |
| Avatar emoji picker | ✅ Saved to `user_profiles.avatar_emoji` |
| Delete account | 🔲 Placeholder action — emails support |

**Display name in TopBar:** `user_profiles.nickname` → email prefix → “there” (not Google full name).

---

### ✅ Marketing & landing

| Page | Route | Status |
|------|-------|--------|
| Homepage | `/` | ✅ `components/landing/landing-page-content.tsx` — editable copy in `lib/landing/landing-content.ts` |
| About | `/about` | ✅ `components/about/about-page-content.tsx` |
| How it works | `/how-it-works` | ✅ `components/how-it-works/how-it-works-content.tsx` |
| Login | `/login` | ✅ Hero + form + editorial block |
| Sign up | `/signup` | ✅ Centered form + editorial block |
| Site nav | `SiteNavbar` | ✅ Sticky on homepage; JOIN THE LEAGUE → `/login` |

**Landing sections:** Hero, features bar, coded dashboard preview, how-it-works steps, join CTA (testimonial sticky notes on desktop), Built with AI editorial block.

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
| RLS error adding roster player | Run `009_roster_players_rls_fix.sql`; log out and back in |
| `user_profiles` table missing | Run migration `008_user_profiles.sql` |
| Nickname always shows Google name | Set nickname on Account page (stored in `user_profiles`) |

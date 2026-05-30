# 06 — Page Specifications

> **Routing note:** The login page currently lives at **`/`** (`app/page.tsx`), not `app/(auth)/login`. The main authenticated shell is **`/dashboard`** (`app/dashboard/page.tsx`). Separate dashboard sub-routes (`/roster`, `/daily-stats`, etc.) are planned but not built yet.

---

## Auth Pages

### Login — `app/page.tsx` *(implemented — route `/`)*

**Status**: ✅ UI complete · ✅ Google OAuth wired · 🔲 email/password · 🔲 Apple

**Design**: Split screen — left hero panel, right form panel  
**Left panel** (`LoginHero`): Olive green background, handwritten taglines, circle badge  
**Right panel** (`LoginForm`):
- Heading: "Welcome back, Boss Babe."
- Subheading (crimson italic): "Log in to check your league."
- Email + Password fields
- "Forgot your password?" link (placeholder)
- Primary CTA: `LOG IN` button (not wired to Supabase yet)
- Divider: "or"
- **Google OAuth button** — calls `supabase.auth.signInWithOAuth({ provider: "google", redirectTo: "/auth/callback" })`
- Apple OAuth button (UI only)
- Footer: "Don't have an account? Sign up →" (placeholder link)

**Data**: No server fetch. Google auth is client-side via `lib/supabase/client.ts`.

**OAuth callback**: `app/auth/callback/route.ts` → redirects to `/dashboard` on success, `/?error=auth` on failure.

---

### Signup — `app/(auth)/signup/page.tsx` *(planned)*

**Status**: ⏳ Not built

**Design**: Split screen — left brand panel, right form panel  
**Left panel**: Brand statement "Join the league. Date like you mean it.", feature icons row (Rank People / See the Stats / Protect Your Energy)  
**Right panel**:
- Heading: "Create your account" (handwritten style)
- Full name, Email, Password, Confirm Password fields
- Terms checkbox
- Primary CTA: `SIGN UP` button (crimson)
- Google OAuth + Apple OAuth
- Footer: "Already in the league? Log in"

**Data**: Supabase `auth.signUp()` → creates user in `auth.users`

---

## Dashboard Pages

### Main Dashboard — `app/dashboard/page.tsx` *(implemented — route `/dashboard`)*

**Status**: ✅ Shell UI with mock data · 🔲 live Supabase queries

**Purpose**: Primary post-login destination. Combines daily stat entry and league table on one screen (v0/Cursor design).

**Layout**:
- `AppSidebar` — left nav (links placeholder `#` for now)
- `TopBar` — search, notifications, user area
- Main column: `DailyStatInput` → dashed divider → `LeagueTable`
- `RightRail` — MVP, red flag, awards cards (mock data)

**Components**: `components/dashboard/*`

**Post-login redirect**: Google OAuth callback sends users here.

---

### League Table — `app/(dashboard)/league/page.tsx` *(planned as standalone route)*

**Status**: UI partially delivered inside `/dashboard` · standalone route not built

**The hero page.** See full spec in [`league-table.md`](./league-table.md).

---

### Legacy placeholder — `app/league/page.tsx`

**Status**: ⚠️ Deprecated — OAuth no longer redirects here. Safe to delete once confirmed unused.

### My Roster — `app/(dashboard)/roster/page.tsx`

**Purpose**: Manage roster players — add, edit, change status  

**Layout**:
- Page title: "MY ROSTER"
- Subheading: "Your lineup. Your rules."
- Grid of player cards (3-col desktop, 2-col tablet, 1-col mobile)
- "+ Add Player" button (top right)

**Player Card**:
- Avatar / photo
- Nickname
- Status badge (Active / Bench / Ghosted / etc.)
- Total points
- Last date logged
- "Log Stats" quick action button
- "Edit" / "···" overflow menu

**Add/Edit Player Modal**:
- Nickname (required)
- Photo upload → Supabase Storage `player-photos` bucket
- Status dropdown
- Save button

**Data fetched**:
```typescript
const { data: players } = await supabase
  .from('roster_players')
  .select('*, stat_entries(total_points)')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

---

### Daily Stats — `app/(dashboard)/daily-stats/page.tsx`

**Purpose**: Log today's behaviours for a specific player  
**This is the core data entry screen.**

**Layout**:
- Page title: "DAILY STAT INPUT ♥"
- Subheading: "Log the tea. Earn the points. See the pattern."
- Date picker (top right, defaults to today)
- Player selector (avatar strip at top — Ben S., Alex M., etc. — tap to select)

**Selected Player Card**:
- Avatar, nickname, @handle, status badge
- "Today's Points Impact" — live updating sum as checkboxes are ticked
- Mini form chart (last 7 days)
- "VIEW PROFILE" link

**Behaviour Checkboxes**:
- Grouped by category
- Each tile: icon + label + point value
- Positive behaviours: white background, green point badge
- Negative behaviours: light pink/red background, red point badge
- Checked state: olive green fill + checkmark

**Weekly Summary Panel** (right sidebar on desktop):
- This week's total points
- Rank change arrow
- Recent entries list (last 5 days)

**Notes Field**:
- Optional textarea, 250 char limit
- Placeholder: "Add any context... the vibes, the tea, the details."

**Actions**:
- `CANCEL` — clears form
- `SAVE ENTRY` — saves to `stat_entries` + `stat_entry_behaviors`

**On Save Logic**:
```typescript
// 1. Calculate total points from selected behaviors
const totalPoints = selectedBehaviors.reduce((sum, b) => sum + b.points, 0)

// 2. Upsert stat_entry (unique on user_id + player_id + entry_date)
const { data: entry } = await supabase
  .from('stat_entries')
  .upsert({ user_id, player_id, entry_date, notes, total_points: totalPoints })
  .select()
  .single()

// 3. Delete existing behaviors for this entry (if editing)
await supabase.from('stat_entry_behaviors').delete().eq('entry_id', entry.id)

// 4. Insert new behaviors
await supabase.from('stat_entry_behaviors').insert(
  selectedBehaviors.map(b => ({ entry_id: entry.id, behavior_id: b.id }))
)
```

---

### Scoring System — `app/(dashboard)/scoring/page.tsx`

**Purpose**: Reference page showing all 40 behaviours and their point values  

**Layout**:
- Page title: "SCORING SYSTEM"
- Subheading: "Know the game. Play to win."
- Tabs or accordion by category
- Each behaviour row: icon, name, points badge, description tooltip

**Data fetched**:
```typescript
const { data: behaviors } = await supabase
  .from('scoring_behaviors')
  .select('*')
  .order('category', { ascending: true })
```

---

### History — `app/(dashboard)/history/page.tsx`

**Purpose**: Timeline of all stat entries across all players  

**Layout**:
- Filter bar: All Players | Date Range | Category
- Chronological list of entries
- Each entry: date, player name + avatar, behaviours logged as chips, total points, notes preview

---

### Awards — `app/(dashboard)/awards/page.tsx`

**Purpose**: Highlight special achievements / milestones  

**Examples**:
- 🏆 MVP of the Week
- 📈 Most Improved
- 🚩 Red Flag Alert
- 👑 Consistency King
- 💣 Love Bomb Index

*(Based on the right panel in the League Table mockup)*

---

### Settings — `app/(dashboard)/settings/page.tsx`

**Sections**:
- Profile (name, email, avatar)
- Notifications preferences
- Account (change password, delete account)
- Data export (CSV download of all entries)

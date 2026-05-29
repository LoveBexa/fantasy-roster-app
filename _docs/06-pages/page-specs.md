# 06 — Page Specifications

All pages live under `app/(dashboard)/` and share the sidebar layout from `layout.tsx`.

---

## Auth Pages

### Login — `app/(auth)/login/page.tsx`

**Design**: Split screen — left image panel, right form panel  
**Left panel**: Photo of three women, olive green background, handwritten text "good dates / better vibes / higher stats", circle badge "DATE SMARTER NOT HARDER"  
**Right panel**:
- Heading: "Welcome back, Boss Babe."
- Subheading (crimson italic): "Log in to check your league."
- Email + Password fields
- "Forgot your password?" link
- Primary CTA: `LOG IN` button (crimson)
- Divider: "or"
- Google OAuth button
- Apple OAuth button
- Footer: "Don't have an account? Sign up →"

**Data**: No data fetch — Supabase Auth client-side

---

### Signup — `app/(auth)/signup/page.tsx`

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

### League Table — `app/(dashboard)/league/page.tsx`

**The hero page.** See full spec in [`league-table.md`](./league-table.md).

---

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

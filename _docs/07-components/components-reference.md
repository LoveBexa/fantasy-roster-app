# 07 — Component Library Reference

All components live in `components/`. Shadcn/ui primitives are in `components/ui/`.

---

## Dashboard Components *(implemented)*

Built for `/dashboard`. Currently use mock/static data — not yet connected to Supabase.

| Component | File | Purpose |
|-----------|------|---------|
| `<AppSidebar />` | `components/dashboard/app-sidebar.tsx` | Left nav, brand header, sticky note |
| `<TopBar />` | `components/dashboard/top-bar.tsx` | Search, notifications, user area |
| `<DailyStatInput />` | `components/dashboard/daily-stat-input.tsx` | Player selector + behaviour checkboxes |
| `<FormChart />` | `components/dashboard/form-chart.tsx` | Mini 7-day points chart (used in stat input) |
| `<LeagueTable />` | `components/dashboard/league-table.tsx` | Ranked players table |
| `<RightRail />` | `components/dashboard/right-rail.tsx` | MVP, red flag, awards sidebar cards |

### Auth / login components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<LoginForm />` | `components/login-form.tsx` | Login form + **Google OAuth** handler |
| `<LoginHero />` | `components/login-hero.tsx` | Left panel hero on login page |
| `<SiteNavbar />` | `components/site-navbar.tsx` | Top nav on login page |
| Icons | `components/doodles.tsx` | `GoogleIcon`, `AppleIcon`, decorative SVGs |

---

## Shared Components *(planned)*

These paths reflect the original spec. Prefer `components/dashboard/` for anything already built.

### `<Sidebar />`
`components/shared/Sidebar.tsx`

Nav items (in order) — **dashboard sidebar uses placeholder `href="#"` until routes exist**:
1. League Table → `/dashboard` (Trophy icon) — *table section on dashboard page today*
2. My Roster → `/roster` (Heart icon)
3. Matches → `/matches` (Calendar icon)
4. Daily Stats → `/daily-stats` (Chart icon)
5. Scoring System → `/scoring` (Star icon)
6. History → `/history` (Clock icon)
7. Insights → `/insights` (TrendingUp icon)
8. Awards → `/awards` (Award icon)
9. Settings → `/settings` (Settings icon)

Bottom of sidebar:
- This Week's Points card (dark green, large number)
- Sticky note quote ("date like you mean it")

---

### `<TopBar />`
`components/shared/TopBar.tsx`

- Search input (left)
- Bell icon with notification dot
- User avatar + "Hi, [name]" dropdown (right)

---

### `<PlayerAvatar />`
`components/shared/PlayerAvatar.tsx`

```typescript
interface PlayerAvatarProps {
  photoUrl?: string
  nickname: string
  size?: 'sm' | 'md' | 'lg'  // sm=32px, md=48px, lg=80px
}
```

Falls back to initials on cream background if no photo.

---

### `<StatusBadge />`
`components/shared/StatusBadge.tsx`

```typescript
type PlayerStatus = 'active' | 'bench' | 'injured' | 'ghosted' | 'free_agent'
```

| Status | Label | Style |
|--------|-------|-------|
| active | ACTIVE | Olive green |
| bench | BENCHED | Grey |
| injured | INJURED | Amber |
| ghosted | GHOSTED | Dark grey + ghost emoji |
| free_agent | FREE AGENT | Pink/blush |

---

### `<PointsBadge />`
`components/shared/PointsBadge.tsx`

```typescript
interface PointsBadgeProps {
  points: number  // positive or negative
  size?: 'sm' | 'lg'
  showSign?: boolean  // default true
}
```

- Positive: crimson text (`#8B1A1A`)
- Negative: red text (`#DC2626`)

---

### `<FormArrows />`
`components/shared/FormArrows.tsx`

Shows up to 3 trend arrows based on recent entry points.

```typescript
interface FormArrowsProps {
  entries: { total_points: number }[]  // last 3 entries
}
// ↑ = positive, ↓ = negative
// Olive green for up, Red for down
```

---

## League Components

### `<LeagueTable />` — implemented
`components/dashboard/league-table.tsx`

Ranked table on `/dashboard`. Mock data today; will receive `RankedPlayer[]` from Supabase server fetch.

```typescript
interface LeagueTableProps {
  players: RankedPlayer[]
  timeFilter: TimeFilter
}
```

### Planned extract (optional future refactor)
`components/league/LeagueTable.tsx` — if league table is split out of the dashboard page later.

---

### `<MVPCard />`
`components/league/MVPCard.tsx`

Right sidebar card. Shows player photo, name, week points, top behaviours.

---

### `<RedFlagCard />`
`components/league/RedFlagCard.tsx`

Right sidebar card. Shows player with most negatives, their red flag behaviours, "VIEW DETAILS" CTA.

---

### `<StatsAtAGlance />`
`components/league/StatsAtAGlance.tsx`

Five metric cards in a row.

---

### `<LineupSection />`
`components/league/LineupSection.tsx`

Three-column starting lineup / bench / injured grid.

---

## Roster Components

### `<PlayerCard />`
`components/roster/PlayerCard.tsx`

Grid card showing a single roster player with quick actions.

---

### `<AddPlayerModal />`
`components/roster/AddPlayerModal.tsx`

Modal form for adding/editing a player. Uses shadcn `Dialog`.

---

## Daily Stats Components

### `<PlayerSelector />`
`components/daily-stats/PlayerSelector.tsx`

Horizontal scrollable avatar strip. Clicking an avatar selects that player.

---

### `<BehaviorGrid />`
`components/daily-stats/BehaviorGrid.tsx`

The checkbox grid of all 40 behaviours, grouped by category.

```typescript
interface BehaviorGridProps {
  behaviors: ScoringBehavior[]
  selected: string[]  // array of behavior IDs
  onToggle: (behaviorId: string) => void
}
```

---

### `<BehaviorTile />`
`components/daily-stats/BehaviorTile.tsx`

Individual behaviour checkbox tile.

```typescript
interface BehaviorTileProps {
  behavior: ScoringBehavior
  isSelected: boolean
  onToggle: () => void
}
```

Styles:
- Unselected positive: white bg, olive point badge
- Unselected negative: light pink bg, red point badge
- Selected: olive green bg, white text, checkmark

---

### `<PointsImpactCounter />`
`components/daily-stats/PointsImpactCounter.tsx`

Live-updating total that animates as behaviours are selected.

---

### `<WeeklySummaryPanel />`
`components/daily-stats/WeeklySummaryPanel.tsx`

Right sidebar showing week total, rank change, and recent entry list.

---

## Types Reference

```typescript
// types/database.ts

interface RosterPlayer {
  id: string
  user_id: string
  nickname: string
  photo_url?: string
  status: 'active' | 'bench' | 'injured' | 'ghosted' | 'free_agent'
  created_at: string
}

interface ScoringBehavior {
  id: string
  category: string
  behavior: string
  points: number
  description?: string
}

interface StatEntry {
  id: string
  user_id: string
  player_id: string
  entry_date: string
  notes?: string
  total_points: number
  created_at: string
}

interface RankedPlayer extends RosterPlayer {
  total_points: number
  week_points: number
  consistency_pct: number
  last_entry_date?: string
  recent_entries: StatEntry[]
}
```

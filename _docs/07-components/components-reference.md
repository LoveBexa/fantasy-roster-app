# 07 — Component Library Reference

All components live in `components/`. Shadcn/ui primitives are in `components/ui/`.

**Types for roster players:** `components/roster/roster-types.ts`  
**DB column constants:** `lib/db/columns.ts`

---

## Dashboard components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<AppSidebar />` | `components/dashboard/app-sidebar.tsx` | Nav: League Table, Daily Stats, My Roster, Account, Log out |
| `<TopBar />` | `components/dashboard/top-bar.tsx` | Search UI, user dropdown, logout |
| `<DashboardMain />` | `components/dashboard/dashboard-main.tsx` | Main content wrapper (`max-w-5xl px-8 py-8`) |
| `<PageHeader />` | `components/dashboard/page-header.tsx` | Shared page title + subtitle + optional icon |
| `<LeagueTable />` | `components/dashboard/league-table.tsx` | Ranked table — **live Supabase** |
| `<DailyStatInput />` | `components/dashboard/daily-stat-input.tsx` | Behaviour grid + save — **live Supabase** |
| `<FormChart />` | `components/dashboard/form-chart.tsx` | 7-day points mini chart |
| `<RightRail />` | `components/dashboard/right-rail.tsx` | MVP / awards sidebar — **mock data** |

---

## Roster components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<RosterTable />` | `components/roster/roster-table.tsx` | Main roster page — list, filter, sort, CRUD |
| `<AddPlayerForm />` | `components/roster/add-player-form.tsx` | Inline add form with scrollable emoji picker |
| `<EditPlayerDialog />` | `components/roster/edit-player-dialog.tsx` | Edit modal with full emoji picker |
| `<DeletePlayerDialog />` | `components/roster/delete-player-dialog.tsx` | Delete confirmation |

**Types / constants:** `components/roster/roster-types.ts`
- `Player`, `PlayerStatus`, `RelationshipStatus`
- `PLAYER_STATUSES`, `RELATIONSHIP_STATUSES`, `EMOJI_OPTIONS` (~150 emojis)

---

## Account components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<AccountPageContent />` | `components/account/account-page-content.tsx` | Profile, nickname, emoji, delete account UI |

---

## Marketing components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<AboutPageContent />` | `components/about/about-page-content.tsx` | About page body |
| `<HowItWorksContent />` | `components/how-it-works/how-it-works-content.tsx` | How it works page body |
| `<SiteNavbar />` | `components/site-navbar.tsx` | Public nav — ABOUT, HOW IT WORKS, JOIN THE LEAGUE |

---

## Auth / login components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<LoginForm />` | `components/login-form.tsx` | Google OAuth (`emailPasswordDisabled = true`) |
| `<LoginHero />` | `components/login-hero.tsx` | Left panel hero on login page |
| Icons | `components/doodles.tsx` | `GoogleIcon`, `HeartDoodle`, `StarDoodle`, `CrownDoodle`, etc. |

---

## Lib modules (data layer)

| Module | Key exports |
|--------|-------------|
| `lib/roster/players.ts` | `fetchRosterPlayers`, `createRosterPlayer`, `updateRosterPlayer`, `deleteRosterPlayer`, `rowToPlayer` |
| `lib/stats/stat-entries.ts` | `fetchScoringBehaviors`, `saveStatEntry`, `fetchPlayerWeeklyForm` |
| `lib/stats/behavior-icons.ts` | Icon mapping per behaviour name |
| `lib/league/league-table.ts` | `fetchLeagueTable`, `syncLeagueSnapshots`, `LeaguePeriod`, `LeagueTableRow` |
| `lib/auth/user-display.ts` | `getUserDisplay()` for TopBar |
| `lib/auth/user-profile.ts` | `getUserProfile()` for Account page |
| `lib/auth/use-logout.ts` | Client logout hook |
| `lib/supabase/errors.ts` | `toError()`, `getErrorMessage()` |

---

## Shared / planned components

These were in the original spec but not yet extracted as standalone files:

| Component | Planned path | Notes |
|-----------|--------------|-------|
| `<PlayerAvatar />` | `components/shared/PlayerAvatar.tsx` | Use emoji from roster today |
| `<StatusBadge />` | `components/shared/StatusBadge.tsx` | Inline in roster table for now |
| `<PointsBadge />` | `components/shared/PointsBadge.tsx` | Used inline in stat input |
| `<FormArrows />` | Inline in league table | ↑/↓ in `league-table.tsx` |
| `<BehaviorGrid />` | Part of `DailyStatInput` | Flat card grid, not category accordion |

---

## Types reference

App types live in component/lib files rather than a central `types/database.ts`:

```typescript
// components/roster/roster-types.ts
interface Player {
  id: string
  nickname: string
  description: string
  emoji: string
  status: "Active" | "Reserve" | "Free Agent" | "Ghosted" | "Removed"
  relationshipStatus: RelationshipStatus | null
  addedDate: string
  lastUpdated: string
  notes?: string
  photoUrl?: string
}

// lib/league/league-table.ts
interface LeagueTableRow {
  playerId: string
  rank: number
  nickname: string
  emoji: string
  tint: string
  points: number
  delta: number
  form: ("up" | "down")[]
  consistency: number
}

// lib/stats/stat-entries.ts
interface ScoringBehaviorRow {
  id: string
  category: string
  behavior: string
  points: number
  description: string | null
}
```

---

## Public assets

| File | Used on |
|------|---------|
| `public/images/three-women.png` | Login hero |
| `public/images/four-women.png` | About page hero |
| `public/images/women-looking-phone.png` | How it works hero |

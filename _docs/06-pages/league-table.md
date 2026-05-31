# 06 — League Table Page Spec

**Route:** `/dashboard` → `<LeagueTable />` in `components/dashboard/league-table.tsx`  
**Data layer:** `lib/league/league-table.ts`  
**Status:** ✅ Live Supabase data · 🔲 Right rail still mock

---

## Purpose

The hero screen of the app. Shows all roster players ranked by total points, with period filters, form trends, and consistency scores.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Header: "LEAGUE TABLE"                                    │
│  Subheading: "Rank your dates. Track the stats. Don't settle."  │
├─────────────────────────────────────────────┬───────────────────┤
│  Period Tabs                                │                   │
│  [OVERALL] [THIS SEASON] [THIS MONTH]       │  RightRail        │
│  [THIS WEEK]                                │  (mock MVP cards) │
│                                             │                   │
│  Main Rankings Table                        │                   │
│  ┌──────────────────────────────────────┐   │                   │
│  │ RANK │ PLAYER │ POINTS │ FORM │ CON% │   │                   │
│  │  1   │ 🍝 Italiano │ 62 │ ↑↓  │ 78%  │   │                   │
│  │ ...  │  ...   │  ...   │  ... │  ... │   │                   │
│  └──────────────────────────────────────┘   │                   │
│                                             │                   │
│  CTA: Enter daily stats → /stats            │                   │
└─────────────────────────────────────────────┴───────────────────┘
```

---

## Period filter tabs

```typescript
type LeaguePeriod = "Overall" | "This Season" | "This Month" | "This Week"
```

Default: `Overall`. Switching tabs re-fetches with a different date range on `stat_entries.entry_date`.

| Period | Start date |
|--------|------------|
| Overall | No filter |
| This Season | Jan 1 of current year |
| This Month | 1st of current month |
| This Week | 6 days ago through today |

---

## Rankings table columns

| Column | Source |
|--------|--------|
| **Rank** | Sum of `total_points` in period, descending; #1 gets crown doodle |
| **Player** | `nickname` + `emoji` from `roster_players` |
| **Points** | Period total; green **delta** = last entry pts − previous entry pts in period |
| **Form** | Up to 3 ↑/↓ arrows from day-to-day **rank** changes (cumulative history) |
| **Consistency** | % pill — see formula below |

Player row tints rotate through `PLAYER_TINTS` in `league-table.ts`.

---

## Metrics (implemented)

### Points

```typescript
// Sum stat_entries.total_points for entries in selected period
sumPointsByPlayer(periodEntries)
```

### Delta

Difference between the two most recent entries **within the period** (not week-over-week).

### Form arrows

Built from cumulative rank history across all entry dates:
- Compare rank on consecutive days where entries exist
- Last up to 3 changes → `↑` if rank improved (lower number), `↓` if worsened

Uses `buildCumulativeRankHistory()` + optional `league_player_snapshots` for persistence.

### Consistency %

Over the last 30 days of behaviour links:

```
positive behaviour points ÷ total abs(behaviour points) × 100
```

Fetched via `fetchBehaviorPointsLast30Days()` joining `stat_entry_behaviors` → `scoring_behaviors`.

---

## Snapshots

`syncLeagueSnapshots()` upserts today's rank + cumulative total per player into `league_player_snapshots`.

Called:
- On league table load
- After saving a stat entry

Requires migration `007_league_player_snapshots.sql`. Failures are caught silently until migration is applied.

---

## Data fetching (client)

```typescript
// components/dashboard/league-table.tsx
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
const rows = await fetchLeagueTable(supabase, user.id, period)
```

Server page (`app/dashboard/page.tsx`) only loads user display for TopBar; table data is client-fetched.

---

## Empty states

| Condition | Message |
|-----------|---------|
| Not signed in | "Sign in to view your league table." |
| No players | "No roster players yet. Add players and log daily stats…" |
| Error | Red alert with message from `getErrorMessage()` |

---

## Right rail (mock — not wired)

`components/dashboard/right-rail.tsx` still uses static data for:

- MVP of the Week
- Most Improved
- Red Flag Alert
- Consistency King
- Love Bomb Index

Future: compute from same `fetchLeagueTable` aggregates or dedicated queries.

---

## Planned sidebar cards (spec)

| Card | Logic (when built) |
|------|-------------------|
| MVP of the Week | Highest week points |
| Most Improved | Biggest positive delta vs prior week |
| Red Flag Alert | Most negative points last 14 days |
| Consistency King | Highest consistency % |
| Love Bomb Index | Most "Lovebombing" behaviours logged |

---

## Demo data

Run `supabase/seed/demo_roster_players.sql` for 6 players with 3 days of entries. Expected overall ranking:

1. Italiano (62) · 2. Gym Guy #2 (48) · 3. Love Handles Harry (24) · 4. Hammer Toe Tom (20) · 5. Yo-yo Dude (-18) · 6. Dandruff Guy (-27)

See [`../03-database/seed-and-troubleshooting.md`](../03-database/seed-and-troubleshooting.md).

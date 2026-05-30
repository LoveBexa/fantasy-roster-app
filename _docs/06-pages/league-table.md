# 06 — League Table Page Spec

**Primary route (implemented UI)**: `app/dashboard/page.tsx` → `<LeagueTable />` in `components/dashboard/league-table.tsx`  
**Standalone route (planned)**: `app/(dashboard)/league/page.tsx`  
**Status**: 🔄 UI shell built with mock data · ⏳ Supabase aggregation query  
**Design ref**: `ChatGPT_Image_May_27__2026__09_46_04_PM.png`

---

## Purpose

The hero screen of the app. Shows all roster players ranked by total points, with performance highlights and stats at a glance.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Header: "LEAGUE TABLE" + dashed divider                   │
│  Subheading: "Rank your dates. Track the stats. Don't settle."  │
├─────────────────────────────────────────────┬───────────────────┤
│  Time Filter Tabs                           │                   │
│  [OVERALL] [THIS SEASON] [THIS MONTH]       │  MVP OF THE WEEK  │
│  [THIS WEEK]                                │  card             │
│                                             ├───────────────────┤
│  Main Rankings Table                        │  MOST IMPROVED    │
│  ┌──────────────────────────────────────┐   │  card             │
│  │ RANK │ PLAYER │ POINTS │ FORM │ CON% │   ├───────────────────┤
│  │  1   │ Ben S. │  245   │ ↑↑↑  │ 82%  │   │  RED FLAG ALERT   │
│  │  2   │ Alex M.│  228   │  ↑↑  │ 74%  │   │  card             │
│  │ ...  │  ...   │  ...   │  ... │  ... │   ├───────────────────┤
│  └──────────────────────────────────────┘   │  CONSISTENCY KING │
│                                             │  card             │
│  [VIEW FULL LEAGUE →]                       ├───────────────────┤
│                                             │  LOVE BOMB INDEX  │
│  STATS AT A GLANCE                          │  card             │
│  [Avg Reply] [Dates/Player] [Plans%]        │                   │
│  [Ghosted]  [Avg Rating]                    │                   │
│                                             │                   │
│  STARTING LINEUP | BENCHWARMERS | INJURED   │                   │
└─────────────────────────────────────────────┴───────────────────┘
```

---

## Components

### Time Filter Tabs

```typescript
type TimeFilter = 'overall' | 'season' | 'month' | 'week'
```

- Default: `overall`
- Switching tabs re-fetches with different date range

---

### Rankings Table

Columns: Rank | Player | Points | Form | Consistency %

**Rank column**:
- #1 gets crown icon 👑 and gold highlight row background
- "You" badge on the user's own row (if applicable — future feature)

**Points column**:
- Total points in crimson, large
- Weekly delta below in smaller text (e.g. "+32")

**Form column**:
- Up to 3 arrows based on last 3 entries
- `↑` = positive entry, `↓` = negative entry
- All up `↑↑↑` = hot streak
- Mix = inconsistent
- All down `↓↓` = red flag territory

**Consistency %**:
- Shown in a pill/badge
- `>75%` = olive green
- `50–75%` = amber
- `<50%` = red

---

### MVP of the Week Card (right sidebar)

```
┌──────────────────────────┐
│  MVP OF THE WEEK ⭐       │
│  [Player photo]          │
│  [MVP badge]             │
│  Ben S.                  │
│  +32 PTS                 │
│  • Planned a surprise... │
│  • Great Communication   │
│  keep it up, king ♥      │
└──────────────────────────┘
```

Logic: Player with highest `week_points` in current week

---

### Most Improved Card

Player with biggest positive delta: `this_week_points - last_week_points`

---

### Red Flag Alert Card

Player with most negative points in last 14 days. Shows their top negative behaviours.

---

### Consistency King Card

Player with highest consistency % (most frequent entries)

---

### Love Bomb Index Card

Player with the most "Lovebombing" behaviours logged. Shows a heat meter bar. "Proceed with caution."

---

### Stats at a Glance

Five summary stats shown as metric cards:

| Stat | How Calculated |
|------|---------------|
| Avg Reply Time | Manual input field (future) or estimated from entry patterns |
| Dates per Player (avg) | Count of entries per player / active players |
| Plans Made by Them | Count of "Plans thoughtful date" behaviours logged |
| Ghosted This Season | Count of players with status = 'ghosted' |
| Average Player Rating | avg(total_points) across all active players |

---

### Starting Lineup / Benchwarmers / Injury Reserve

Three-column mini-table at the bottom:

| Section | Filter |
|---------|--------|
| Starting Lineup | `status = 'active'`, top 5 by points |
| Benchwarmers | `status = 'bench'` |
| Injury Reserve | `status = 'injured'` |

Additional sections:
- **Ghosted List**: `status = 'ghosted'`
- **Free Agents**: `status = 'free_agent'`

---

## Data Fetching

**Status**: Not wired yet — dashboard uses mock data. When implemented, fetch in a Server Component on `/dashboard` (or a dedicated league route):

```typescript
// app/dashboard/page.tsx (future)
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: players } = await supabase
    .from("roster_players")
    .select(`
      id, nickname, photo_url, status,
      stat_entries(total_points, entry_date)
    `)
    .eq("user_id", user!.id)

  // Compute aggregates in JS or use the SQL queries from schema.md
  // Pass to <LeagueTable players={...} />
}
```

> Use `@supabase/ssr` (`lib/supabase/server.ts`) — not the deprecated `@supabase/auth-helpers-nextjs`.

---

## Empty State

When user has no roster players yet:
- Illustration / icon
- "Your league is empty."
- "Add your first player to get started."
- CTA: `+ ADD PLAYER` → links to `/roster`

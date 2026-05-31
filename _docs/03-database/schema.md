# 03 — Database Schema

All tables live in Supabase (Postgres). Row Level Security (RLS) is enabled on user-owned tables.

**Column name source of truth in code:** `lib/db/columns.ts`

---

## Tables Overview

| Table | Purpose |
|-------|---------|
| `roster_players` | People the user is dating |
| `scoring_behaviors` | Seed table — 40 behaviours and point values (shared, read-only) |
| `stat_entries` | One daily log per (user, player, date) |
| `stat_entry_behaviors` | Junction — which behaviours were logged in each entry |
| `league_player_snapshots` | Daily cumulative rank + points per player (form arrows) |
| `user_profiles` | Per-user nickname and avatar emoji |

---

## Migrations

Run in Supabase SQL Editor in order:

| File | Purpose |
|------|---------|
| `supabase/migrations/001_roster_players.sql` | Create roster table + RLS |
| `supabase/migrations/002_stat_entries.sql` | Stat entries + behaviours junction |
| `supabase/migrations/003_scoring_behaviors.sql` | Behaviours table + 40-row seed |
| `supabase/migrations/004_roster_players_columns.sql` | Add emoji, description, relationship_status, notes, updated_at |
| `supabase/migrations/005_table_grants.sql` | GRANT select/insert/update/delete to authenticated |
| `supabase/migrations/006_scoring_behaviors_columns.sql` | Add description, created_at on behaviours |
| `supabase/migrations/007_league_player_snapshots.sql` | Snapshots for rank history / form |
| `supabase/migrations/008_user_profiles.sql` | User nickname + avatar profile table + signup trigger |

Demo seed (optional): `supabase/seed/demo_roster_players.sql` — see [`seed-and-troubleshooting.md`](./seed-and-troubleshooting.md).

---

## `roster_players`

Stores each person a user is tracking.

```sql
create table roster_players (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  nickname            text not null,
  description         text not null default '',
  emoji               text not null default '😎',
  status              text not null default 'Active',
  relationship_status text,
  notes               text,
  photo_url           text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
```

### Status values (app)

| Status | Meaning |
|--------|---------|
| `Active` | On the roster, actively tracked |
| `Reserve` | On pause / backup option |
| `Free Agent` | New or potential |
| `Ghosted` | No longer in contact |
| `Removed` | Cut from roster |

Defined in `components/roster/roster-types.ts` → `PLAYER_STATUSES`.

### Relationship status values (app)

`Potential Partner` · `Situationship` · `Casual` · `FWB` · `Breadcrumber` · `Orbiter`

Each has an emoji + description in `RELATIONSHIP_STATUSES`.

### Player emoji picker

~150 emojis in `EMOJI_OPTIONS` (`components/roster/roster-types.ts`), grouped by category (faces, love, red flags, food, animals, etc.).

### RLS

```sql
-- SELECT / INSERT / UPDATE / DELETE all scoped to auth.uid() = user_id
```

---

## `scoring_behaviors`

Seed table — **no user_id**. Read-only reference data for all users.

```sql
create table scoring_behaviors (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  behavior    text not null,
  points      integer not null,
  description text,
  created_at  timestamptz not null default now()
);
```

RLS: select-only for authenticated/anon. Full seed in [`05-scoring/behaviours-seed.md`](../05-scoring/behaviours-seed.md) and `003_scoring_behaviors.sql`.

---

## `stat_entries`

One entry per (user, player, date).

```sql
create table stat_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  player_id    uuid not null references roster_players(id) on delete cascade,
  entry_date   date not null default current_date,
  notes        text,
  total_points integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (user_id, player_id, entry_date)
);
```

> **Note:** App currently **inserts** only (`lib/stats/stat-entries.ts`). Saving again for the same player on the same day hits the unique constraint — upsert/edit not built yet.

### RLS

All operations scoped to `user_id = auth.uid()`.

---

## `stat_entry_behaviors`

```sql
create table stat_entry_behaviors (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references stat_entries(id) on delete cascade,
  behavior_id uuid not null references scoring_behaviors(id) on delete cascade,
  created_at  timestamptz not null default now()
);
```

### RLS

Access via parent entry: `entry_id in (select id from stat_entries where user_id = auth.uid())`.

---

## `league_player_snapshots`

Daily snapshot of cumulative rank and total points per player. Upserted by `syncLeagueSnapshots()` in `lib/league/league-table.ts` on league table load and after stat save.

```sql
create table league_player_snapshots (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  player_id     uuid not null references roster_players(id) on delete cascade,
  snapshot_date date not null default current_date,
  rank          integer not null,
  total_points  integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (user_id, player_id, snapshot_date)
);
```

If migration `007` is not applied, snapshots are skipped gracefully (try/catch in app).

---

## League table calculations (app logic)

Implemented in `lib/league/league-table.ts`:

| Metric | How computed |
|--------|--------------|
| **Points** | Sum of `stat_entries.total_points` in selected period |
| **Delta** | Last entry's points minus previous entry's points in period |
| **Form** | Up to 3 rank-change arrows from cumulative rank history day-to-day |
| **Consistency %** | `positive behaviour points ÷ total abs(behaviour points) × 100` over last 30 days |

Period filters: `Overall` · `This Season` · `This Month` · `This Week`

---

## Key Queries

### League table — total points per player

```sql
select
  rp.id,
  rp.nickname,
  rp.emoji,
  coalesce(sum(se.total_points), 0) as total_points
from roster_players rp
left join stat_entries se on se.player_id = rp.id
where rp.user_id = auth.uid()
group by rp.id, rp.nickname, rp.emoji
order by total_points desc;
```

### List auth users

```sql
select id, email, created_at, last_sign_in_at
from auth.users
order by created_at desc;
```

### Verify roster ownership matches logged-in user

```sql
select rp.nickname, rp.user_id, u.email
from roster_players rp
join auth.users u on u.id = rp.user_id
where u.email = 'your@gmail.com';
```

See [`seed-and-troubleshooting.md`](./seed-and-troubleshooting.md) when Table Editor shows data but the app does not.

---

## Storage (planned)

Supabase Storage bucket: `player-photos` — not wired in UI yet.

- Path pattern: `{user_id}/{player_id}.jpg`
- Max 2MB; jpeg/png/webp

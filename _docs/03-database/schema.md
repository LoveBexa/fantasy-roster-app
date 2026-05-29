# 03 — Database Schema

All tables live in Supabase (Postgres). Row Level Security (RLS) is enabled on every table.

---

## Tables Overview

| Table | Purpose |
|-------|---------|
| `roster_players` | People the user is dating |
| `scoring_behaviors` | Seed table — the 40 behaviours and their point values |
| `stat_entries` | A daily log entry for a specific player on a specific date |
| `stat_entry_behaviors` | Junction table — which behaviours were logged in each entry |

---

## `roster_players`

Stores each person a user is tracking.

```sql
create table roster_players (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  nickname    text not null,
  photo_url   text,
  status      text default 'active',  -- 'active' | 'bench' | 'injured' | 'ghosted' | 'free_agent'
  created_at  timestamp default now()
);
```

### Status Values

| Status | Meaning | Display |
|--------|---------|---------|
| `active` | Starting lineup | Green badge |
| `bench` | Benchwarmer / on pause | Grey badge |
| `injured` | Emotionally unavailable | Orange badge |
| `ghosted` | Never heard from again | Ghost emoji 👻 |
| `free_agent` | New / potential | Star badge |

### RLS Policy

```sql
create policy "Users see only their own players"
on roster_players for all
using (user_id = auth.uid());
```

---

## `scoring_behaviors`

Seed table containing all 40 behaviours with their point values and categories. **Shared across all users** — no user_id.

```sql
create table scoring_behaviors (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  behavior    text not null,
  points      integer not null,  -- positive or negative
  description text,
  created_at  timestamp default now()
);
```

> **Note**: This table does NOT have RLS — it's read-only reference data available to all users.

See [`05-scoring/behaviours-seed.md`](../05-scoring/behaviours-seed.md) for the full seed SQL with all 40 rows.

---

## `stat_entries`

One entry per (user, player, date). A user logs a stat entry for a specific roster player on a given day.

```sql
create table stat_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  player_id   uuid references roster_players(id) on delete cascade,
  entry_date  date not null default current_date,
  notes       text,                -- optional free-text field (max 250 chars)
  total_points integer default 0,  -- computed sum cached here
  created_at  timestamp default now(),
  unique(user_id, player_id, entry_date)  -- one entry per player per day
);
```

### RLS Policy

```sql
create policy "Users see only their own entries"
on stat_entries for all
using (user_id = auth.uid());
```

---

## `stat_entry_behaviors`

Junction table — records which specific behaviours were logged in each stat entry.

```sql
create table stat_entry_behaviors (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid references stat_entries(id) on delete cascade,
  behavior_id uuid references scoring_behaviors(id),
  created_at  timestamp default now()
);
```

### RLS Policy

```sql
create policy "Users see only their own entry behaviors"
on stat_entry_behaviors for all
using (
  entry_id in (
    select id from stat_entries where user_id = auth.uid()
  )
);
```

---

## Key Queries

### League Table — Total Points per Player

```sql
select
  rp.id,
  rp.nickname,
  rp.photo_url,
  rp.status,
  coalesce(sum(se.total_points), 0) as total_points,
  max(se.entry_date) as last_entry_date
from roster_players rp
left join stat_entries se on se.player_id = rp.id
where rp.user_id = auth.uid()
group by rp.id, rp.nickname, rp.photo_url, rp.status
order by total_points desc;
```

### Weekly Points (This Week)

```sql
select
  rp.id,
  rp.nickname,
  coalesce(sum(se.total_points), 0) as week_points
from roster_players rp
left join stat_entries se on se.player_id = rp.id
  and se.entry_date >= date_trunc('week', current_date)
where rp.user_id = auth.uid()
group by rp.id, rp.nickname
order by week_points desc;
```

### Consistency % (entries in last 30 days / 30)

```sql
select
  rp.id,
  rp.nickname,
  count(se.id) as entry_count,
  round(count(se.id)::decimal / 30 * 100) as consistency_pct
from roster_players rp
left join stat_entries se on se.player_id = rp.id
  and se.entry_date >= current_date - interval '30 days'
where rp.user_id = auth.uid()
group by rp.id, rp.nickname;
```

### Red Flag Detection (negative points in last 14 days)

```sql
select
  rp.id,
  rp.nickname,
  coalesce(sum(se.total_points), 0) as recent_points,
  count(se.id) as negative_entries
from roster_players rp
left join stat_entries se on se.player_id = rp.id
  and se.entry_date >= current_date - interval '14 days'
  and se.total_points < 0
where rp.user_id = auth.uid()
group by rp.id, rp.nickname
order by recent_points asc
limit 1;
```

---

## Storage

Supabase Storage bucket: `player-photos`

- Bucket: `player-photos` (public)
- Path pattern: `{user_id}/{player_id}.jpg`
- Max file size: 2MB
- Accepted types: `image/jpeg`, `image/png`, `image/webp`

```sql
-- Storage policy (set in Supabase dashboard)
-- Allow users to manage only their own folder
```

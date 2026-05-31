# 03 — Seed Data & Troubleshooting

---

## Demo roster seed

**File:** `supabase/seed/demo_roster_players.sql`

Inserts 6 funny demo players with 3 days of stat entries each (18 entries total), wired to real `scoring_behaviors` rows.

| Player | Emoji | Expected total pts |
|--------|-------|-------------------|
| Italiano | 🍝 | 62 |
| Gym Guy #2 | 💪 | 48 |
| Love Handles Harry | 🍔 | 24 |
| Hammer Toe Tom | 🦶 | 20 |
| Yo-yo Dude | 🪀 | -18 |
| Dandruff Guy | 🧴 | -27 |

### How to run

1. Find your auth user id:
   ```sql
   select id, email from auth.users;
   ```
2. Open `supabase/seed/demo_roster_players.sql` and **replace every** `REPLACE_WITH_YOUR_USER_ID` with that UUID.
3. Run the full script in Supabase → SQL Editor.

The script is **idempotent** — it deletes the previous demo set for those nicknames before re-inserting.

**Prerequisites:** Migrations `001`–`003` must be applied (roster tables + scoring behaviours seed).

---

## “Data is in Supabase but localhost shows nothing”

This is the most common local-dev issue. The Supabase **Table Editor** shows all rows (admin view). The app only returns rows where:

```sql
roster_players.user_id = auth.uid()
```

If those don't match, the app shows **no error** — just “No players yet” or an empty league table.

### Step 1 — Confirm you're signed in

On `/roster` or `/dashboard`, the top bar should show **“Hi, [name]”**. If it says **“Hi there”** or the roster shows **“Sign in to view your roster”**, log in with Google first.

### Step 2 — Compare user ids

```sql
-- Your auth account
select id as auth_user_id, email
from auth.users
where email = 'your@gmail.com';

-- Who owns roster rows
select
  rp.user_id as roster_user_id,
  u.email,
  count(*) as players
from public.roster_players rp
left join auth.users u on u.id = rp.user_id
group by rp.user_id, u.email;
```

If `auth_user_id` ≠ `roster_user_id`, fix with:

```sql
update public.roster_players
set user_id = 'YOUR-AUTH-USER-ID'
where user_id = 'WRONG-ID-FROM-QUERY';

update public.stat_entries
set user_id = 'YOUR-AUTH-USER-ID'
where user_id = 'WRONG-ID-FROM-QUERY';

update public.league_player_snapshots
set user_id = 'YOUR-AUTH-USER-ID'
where user_id = 'WRONG-ID-FROM-QUERY';
```

Common causes:
- Seed script still had the wrong UUID
- Only some `REPLACE_WITH_YOUR_USER_ID` strings were replaced
- Logged into localhost with a **different Google account** than the one in the DB

### Step 3 — Confirm `.env.local` matches the same Supabase project

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Values must match **Project Settings → API** in the project where you ran migrations and seed SQL. Restart `npm run dev` after changing env vars.

### Step 4 — Google OAuth redirect URLs

Supabase → **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** `http://localhost:3000/auth/callback`

---

## Other common DB errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| `permission denied for table roster_players` | Missing GRANTs | Run `005_table_grants.sql` |
| Column `emoji` / `description` does not exist | Legacy table | Run `004_roster_players_columns.sql` |
| Duplicate key on stat save same day | Unique `(user_id, player_id, entry_date)` | Edit/delete existing entry first; upsert not built yet |
| Form arrows missing | Snapshots table missing | Run `007_league_player_snapshots.sql` |
| RLS error adding roster player | Session/auth mismatch or missing grants | Log out/in; run `005_table_grants.sql` and `009_roster_players_rls_fix.sql` |
| Supabase error not `instanceof Error` | Plain object errors | Handled via `lib/supabase/errors.ts` → `toError()` |

---

## Useful diagnostic queries

```sql
-- All users
select id, email, created_at, last_sign_in_at
from auth.users
order by created_at desc;

-- Roster + entry counts per user
select
  u.email,
  count(distinct rp.id) as players,
  count(se.id) as stat_entries
from auth.users u
left join public.roster_players rp on rp.user_id = u.id
left join public.stat_entries se on se.user_id = u.id
group by u.id, u.email;

-- Leaderboard for a specific user
select
  rp.nickname,
  rp.emoji,
  coalesce(sum(se.total_points), 0) as total_points
from public.roster_players rp
left join public.stat_entries se on se.player_id = rp.id
where rp.user_id = 'YOUR-AUTH-USER-ID'
group by rp.id, rp.nickname, rp.emoji
order by total_points desc;
```

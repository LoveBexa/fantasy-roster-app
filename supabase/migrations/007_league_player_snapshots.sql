-- Run once in Supabase → SQL Editor (after stat_entries exists)
-- Stores daily league rank + cumulative points per player for form arrows.

create table if not exists public.league_player_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  player_id uuid not null references public.roster_players (id) on delete cascade,
  snapshot_date date not null default current_date,
  rank integer not null,
  total_points integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, player_id, snapshot_date)
);

alter table public.league_player_snapshots enable row level security;

drop policy if exists "Users can view own league snapshots" on public.league_player_snapshots;
drop policy if exists "Users can insert own league snapshots" on public.league_player_snapshots;
drop policy if exists "Users can update own league snapshots" on public.league_player_snapshots;
drop policy if exists "Users can delete own league snapshots" on public.league_player_snapshots;

create policy "Users can view own league snapshots"
  on public.league_player_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert own league snapshots"
  on public.league_player_snapshots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own league snapshots"
  on public.league_player_snapshots for update
  using (auth.uid() = user_id);

create policy "Users can delete own league snapshots"
  on public.league_player_snapshots for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.league_player_snapshots to authenticated;

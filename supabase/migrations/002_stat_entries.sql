-- Run once in Supabase → SQL Editor (after roster_players exists)

create table if not exists public.stat_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  player_id uuid not null references public.roster_players (id) on delete cascade,
  entry_date date not null default current_date,
  notes text,
  total_points integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, player_id, entry_date)
);

create table if not exists public.stat_entry_behaviors (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.stat_entries (id) on delete cascade,
  behavior_id uuid not null references public.scoring_behaviors (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.stat_entries enable row level security;
alter table public.stat_entry_behaviors enable row level security;

drop policy if exists "Users can view own stat entries" on public.stat_entries;
drop policy if exists "Users can insert own stat entries" on public.stat_entries;
drop policy if exists "Users can update own stat entries" on public.stat_entries;
drop policy if exists "Users can delete own stat entries" on public.stat_entries;

create policy "Users can view own stat entries"
  on public.stat_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own stat entries"
  on public.stat_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stat entries"
  on public.stat_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own stat entries"
  on public.stat_entries for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view own stat entry behaviors" on public.stat_entry_behaviors;
drop policy if exists "Users can insert own stat entry behaviors" on public.stat_entry_behaviors;
drop policy if exists "Users can delete own stat entry behaviors" on public.stat_entry_behaviors;

create policy "Users can view own stat entry behaviors"
  on public.stat_entry_behaviors for select
  using (
    entry_id in (
      select id from public.stat_entries where user_id = auth.uid()
    )
  );

create policy "Users can insert own stat entry behaviors"
  on public.stat_entry_behaviors for insert
  with check (
    entry_id in (
      select id from public.stat_entries where user_id = auth.uid()
    )
  );

create policy "Users can delete own stat entry behaviors"
  on public.stat_entry_behaviors for delete
  using (
    entry_id in (
      select id from public.stat_entries where user_id = auth.uid()
    )
  );

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.stat_entries to authenticated;
grant select, insert, update, delete on public.stat_entry_behaviors to authenticated;

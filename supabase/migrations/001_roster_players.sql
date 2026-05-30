-- Run once in Supabase → SQL Editor
-- Creates roster_players with RLS for the My Roster page

create table if not exists public.roster_players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nickname text not null,
  description text not null default '',
  emoji text not null default '😎',
  status text not null default 'Active',
  relationship_status text,
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.roster_players enable row level security;

drop policy if exists "Users can view own roster players" on public.roster_players;
drop policy if exists "Users can insert own roster players" on public.roster_players;
drop policy if exists "Users can update own roster players" on public.roster_players;
drop policy if exists "Users can delete own roster players" on public.roster_players;

create policy "Users can view own roster players"
  on public.roster_players for select
  using (auth.uid() = user_id);

create policy "Users can insert own roster players"
  on public.roster_players for insert
  with check (auth.uid() = user_id);

create policy "Users can update own roster players"
  on public.roster_players for update
  using (auth.uid() = user_id);

create policy "Users can delete own roster players"
  on public.roster_players for delete
  using (auth.uid() = user_id);

create or replace function public.set_roster_players_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roster_players_updated_at on public.roster_players;

create trigger roster_players_updated_at
  before update on public.roster_players
  for each row
  execute function public.set_roster_players_updated_at();

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.roster_players to authenticated;

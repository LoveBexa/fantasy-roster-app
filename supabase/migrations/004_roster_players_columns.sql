-- Run once in Supabase → SQL Editor if roster_players was created before migration 001
-- Adds columns the app expects (safe to re-run).

alter table public.roster_players
  add column if not exists description text not null default '';

alter table public.roster_players
  add column if not exists emoji text not null default '😎';

alter table public.roster_players
  add column if not exists relationship_status text;

alter table public.roster_players
  add column if not exists notes text;

alter table public.roster_players
  add column if not exists updated_at timestamptz;

update public.roster_players
set updated_at = created_at
where updated_at is null;

alter table public.roster_players
  alter column updated_at set default now();

alter table public.roster_players
  alter column updated_at set not null;

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

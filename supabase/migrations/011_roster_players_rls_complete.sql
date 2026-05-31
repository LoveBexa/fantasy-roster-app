-- Complete roster_players RLS fix: insert, update, delete, and select for authenticated users.
-- Run once in Supabase → SQL Editor (safe to re-run).

-- Assign user_id from JWT on every insert (client may omit user_id).
create or replace function public.set_roster_player_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.user_id := (select auth.uid());
  if new.user_id is null then
    raise exception 'Not authenticated';
  end if;
  return new;
end;
$$;

drop trigger if exists roster_players_set_user_id on public.roster_players;

create trigger roster_players_set_user_id
  before insert on public.roster_players
  for each row
  execute function public.set_roster_player_user_id();

-- Prevent changing owner on update.
create or replace function public.prevent_roster_player_user_id_change()
returns trigger
language plpgsql
as $$
begin
  new.user_id := old.user_id;
  return new;
end;
$$;

drop trigger if exists roster_players_prevent_user_id_change on public.roster_players;

create trigger roster_players_prevent_user_id_change
  before update on public.roster_players
  for each row
  execute function public.prevent_roster_player_user_id_change();

alter table public.roster_players enable row level security;

drop policy if exists "Users can view own roster players" on public.roster_players;
drop policy if exists "Users can insert own roster players" on public.roster_players;
drop policy if exists "Users can update own roster players" on public.roster_players;
drop policy if exists "Users can delete own roster players" on public.roster_players;

-- (select auth.uid()) is the Supabase-recommended form for RLS policies.
create policy "Users can view own roster players"
  on public.roster_players for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own roster players"
  on public.roster_players for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own roster players"
  on public.roster_players for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own roster players"
  on public.roster_players for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.roster_players to authenticated;

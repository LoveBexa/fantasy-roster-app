-- Hardens roster insert RLS: force user_id from JWT and scope insert policy to authenticated.

create or replace function public.set_roster_player_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  new.user_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists roster_players_set_user_id on public.roster_players;

create trigger roster_players_set_user_id
  before insert on public.roster_players
  for each row
  execute function public.set_roster_player_user_id();

drop policy if exists "Users can insert own roster players" on public.roster_players;

create policy "Users can insert own roster players"
  on public.roster_players for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.roster_players to authenticated;

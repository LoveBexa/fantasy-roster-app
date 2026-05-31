-- Ensures roster inserts always bind to the authenticated user and tightens update RLS.

create or replace function public.set_roster_player_user_id()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is not null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists roster_players_set_user_id on public.roster_players;

create trigger roster_players_set_user_id
  before insert on public.roster_players
  for each row
  execute function public.set_roster_player_user_id();

drop policy if exists "Users can update own roster players" on public.roster_players;

create policy "Users can update own roster players"
  on public.roster_players for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.roster_players to authenticated;

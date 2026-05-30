-- Run once in Supabase → SQL Editor
-- Fixes "permission denied for table ..." when RLS policies exist but role grants are missing.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.roster_players to authenticated;
grant select, insert, update, delete on public.stat_entries to authenticated;
grant select, insert, update, delete on public.stat_entry_behaviors to authenticated;

-- Reference data (read-only for app users)
grant select on public.scoring_behaviors to anon, authenticated;

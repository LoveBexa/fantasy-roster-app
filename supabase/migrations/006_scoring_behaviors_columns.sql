-- Run once in Supabase → SQL Editor
-- Adds columns missing from older scoring_behaviors tables (safe to re-run).

alter table public.scoring_behaviors
  add column if not exists description text;

alter table public.scoring_behaviors
  add column if not exists created_at timestamptz;

update public.scoring_behaviors
set created_at = now()
where created_at is null;

alter table public.scoring_behaviors
  alter column created_at set default now();

alter table public.scoring_behaviors
  alter column created_at set not null;

-- Backfill empty descriptions from behaviour name if you had rows without them
update public.scoring_behaviors
set description = behavior
where description is null or description = '';

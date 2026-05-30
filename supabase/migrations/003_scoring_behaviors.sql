-- Run once in Supabase → SQL Editor
-- Creates scoring_behaviors (if missing), grants read access, and seeds the 40 behaviours.

create table if not exists public.scoring_behaviors (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  behavior text not null,
  points integer not null,
  description text,
  created_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select on public.scoring_behaviors to anon, authenticated;

alter table public.scoring_behaviors enable row level security;

drop policy if exists "Anyone can read scoring behaviors" on public.scoring_behaviors;

create policy "Anyone can read scoring behaviors"
  on public.scoring_behaviors
  for select
  to authenticated, anon
  using (true);

insert into public.scoring_behaviors (category, behavior, points, description)
select * from (values
  ('Effort & Planning', 'Plans thoughtful date', 10, 'Planning dinners, activities, logistics, effortful dates'),
  ('Effort & Planning', 'Picks you up / organises transport', 8, 'Driving, coordinating, convenience'),
  ('Effort & Planning', 'Arrives early', 6, 'Excited / conscientious behavior'),
  ('Effort & Planning', 'Forward plans consistently', 7, 'Makes future plans and follows through'),
  ('Effort & Planning', 'Bails last minute', -12, 'Cancels late / inconsistent reliability'),
  ('Effort & Planning', 'Overbooks / double books', -10, 'Conflicting plans / absent behavior'),
  ('Communication', 'Replies consistently', 9, 'Steady WhatsApp communication'),
  ('Communication', 'Asks meaningful questions', 10, 'Curiosity, asking why, emotional understanding'),
  ('Communication', 'Only gives factual answers', -6, 'Low emotional/intellectual engagement'),
  ('Communication', 'Live engaging conversation', 8, 'Present, active chatting energy'),
  ('Communication', 'Disappears during conflict', -12, 'Avoidant shutdown behavior'),
  ('Communication', 'Transparent about intentions', 7, 'Self-aware and honest'),
  ('Communication', 'Lovebombing', -8, 'Over-intense validation/attention early on'),
  ('Emotional Safety', 'Makes you feel safe', 12, 'Emotional openness without pressure'),
  ('Emotional Safety', 'Remembers small details', 10, 'Attention and care'),
  ('Emotional Safety', 'Supportive during hard times', 12, 'Shows up emotionally'),
  ('Emotional Safety', 'Always on your team', 9, 'Protective / validating energy'),
  ('Emotional Safety', 'Emotionally avoidant', -10, 'Uses work/hobbies to escape feelings'),
  ('Emotional Safety', 'Inconsistent reliability', -11, 'Words do not match actions'),
  ('Attraction & Chemistry', 'Comfort and ease', 8, 'Relaxed, friendshippy connection'),
  ('Attraction & Chemistry', 'Strong chemistry', 7, 'Excitement / spark'),
  ('Attraction & Chemistry', 'Hyperfocus obsession', -7, 'Over-investment too quickly'),
  ('Attraction & Chemistry', 'Gets attached too fast', -6, 'Emotional overattachment'),
  ('Lifestyle Compatibility', 'Busy but still makes time', 9, 'Prioritises connection'),
  ('Lifestyle Compatibility', 'Too unavailable / absent', -9, 'Always busy / missing'),
  ('Lifestyle Compatibility', 'Lives very far away', -5, 'Logistical friction'),
  ('Lifestyle Compatibility', 'Shared interests / hobbies', 6, 'Gym dates, creative talks, etc'),
  ('Dating Intentions', 'Relationship energy', 8, 'Consistent caring behavior'),
  ('Dating Intentions', 'Only wants casual / shagging', -8, 'Misaligned intentions'),
  ('Dating Intentions', 'Leads someone on', -10, 'Mixed signals / ambiguity'),
  ('Dating Intentions', 'Clear intentions', 10, 'Communicates what they want'),
  ('Social & Personality', 'Interesting / passionate', 9, 'Feels alive and engaged in life'),
  ('Social & Personality', 'Social intelligence', 8, 'Understands concepts and nuance'),
  ('Social & Personality', 'Flirty and playful', 5, 'Light teasing / chemistry'),
  ('Social & Personality', 'Codependent behavior', -7, 'Overly dependent dynamics'),
  ('Social & Personality', 'Immature behavior', -8, 'Emotional inconsistency'),
  ('Roster Dynamics', 'Multiple active options', 3, 'Protects emotional balance'),
  ('Roster Dynamics', 'No roster loneliness', -4, 'Attachment from scarcity'),
  ('Roster Dynamics', 'Benchwarmer / background orbiting', -2, 'Watches stories, low effort lingering'),
  ('Roster Dynamics', 'Consistent main player', 15, 'Reliable high-value roster slot')
) as seed(category, behavior, points, description)
where not exists (select 1 from public.scoring_behaviors limit 1);

-- Demo roster seed: 6 funny players + 3 days of stat entries for the leaderboard
-- Run in Supabase → SQL Editor
--
-- 1) Find your user id:
--    select id, email from auth.users;
-- 2) Replace REPLACE_WITH_YOUR_USER_ID below (both occurrences)
-- 3) Run the whole script

-- ---------------------------------------------------------------------------
-- Cleanup (safe to re-run — only removes this demo set for your user)
-- ---------------------------------------------------------------------------
delete from public.stat_entry_behaviors
where entry_id in (
  select se.id
  from public.stat_entries se
  join public.roster_players rp on rp.id = se.player_id
  where rp.user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
    and rp.nickname in (
      'Dandruff Guy',
      'Gym Guy #2',
      'Love Handles Harry',
      'Hammer Toe Tom',
      'Yo-yo Dude',
      'Italiano'
    )
);

delete from public.stat_entries
where user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
  and player_id in (
    select id from public.roster_players
    where user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
      and nickname in (
        'Dandruff Guy',
        'Gym Guy #2',
        'Love Handles Harry',
        'Hammer Toe Tom',
        'Yo-yo Dude',
        'Italiano'
      )
  );

delete from public.league_player_snapshots
where user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
  and player_id in (
    select id from public.roster_players
    where user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
      and nickname in (
        'Dandruff Guy',
        'Gym Guy #2',
        'Love Handles Harry',
        'Hammer Toe Tom',
        'Yo-yo Dude',
        'Italiano'
      )
  );

delete from public.roster_players
where user_id = 'REPLACE_WITH_YOUR_USER_ID'::uuid
  and nickname in (
    'Dandruff Guy',
    'Gym Guy #2',
    'Love Handles Harry',
    'Hammer Toe Tom',
    'Yo-yo Dude',
    'Italiano'
  );

-- ---------------------------------------------------------------------------
-- Players
-- ---------------------------------------------------------------------------
insert into public.roster_players (
  id, user_id, nickname, description, emoji, status, relationship_status, notes
) values
  (
    'a1000001-0001-4001-8001-000000000001',
    'REPLACE_WITH_YOUR_USER_ID',
    'Dandruff Guy',
    'Great hair, questionable shoulders. Flakes on plans and on your black top.',
    '🧴',
    'Active',
    'Situationship',
    'Bring a lint roller if you see him. He said he would “work on it.”'
  ),
  (
    'a1000002-0002-4002-8002-000000000002',
    'Gym Guy #2',
    'Gym Guy #2',
    'There is already a Gym Guy. This one supersets conversations with bicep curls.',
    '💪',
    'Active',
    'Casual',
    'Protein shake dates only. Asked if carbs are a red flag.'
  ),
  (
    'a1000003-0003-4003-8003-000000000003',
    'Love Handles Harry',
    'Soft heart, softer middle. Always brings snacks and emotional availability.',
    '🍔',
    'Reserve',
    'Potential Partner',
    'Ordered you both desserts “for research.” No regrets.'
  ),
  (
    'a1000004-0004-4004-8004-000000000004',
    'Hammer Toe Tom',
    'Walks like a pirate who lost a bet. Texts like a stand-up open mic.',
    '🦶',
    'Active',
    'Orbiter',
    'Likes every story, never asks you out. Toe situation is… structural.'
  ),
  (
    'a1000005-0005-4005-8005-000000000005',
    'Yo-yo Dude',
    'Hot one day, cold the next. Emotional whiplash with good cheekbones.',
    '🪀',
    'Active',
    'Breadcrumber',
    '“Miss you” at 2am, “who is this” by brunch.'
  ),
  (
    'a1000006-0006-4006-8006-000000000006',
    'Italiano',
    'Cooks pasta, speaks with his hands, cried at a sunset once (sincerely).',
    '🍝',
    'Active',
    'Potential Partner',
    'Made risotto from scratch on date two. MVP energy.'
  );

-- ---------------------------------------------------------------------------
-- Stat entries (3 days each — totals drive the leaderboard)
-- ---------------------------------------------------------------------------
insert into public.stat_entries (id, user_id, player_id, entry_date, notes, total_points) values
  -- Italiano — day 1: 14
  ('b2000006-0001-4001-8001-000000000601', 'REPLACE_WITH_YOUR_USER_ID', 'a1000006-0006-4006-8006-000000000006', '2026-05-28', 'Wine bar. Remembered my allergy.', 14),
  -- Italiano — day 2: 32
  ('b2000006-0002-4002-8002-000000000602', 'REPLACE_WITH_YOUR_USER_ID', 'a1000006-0006-4006-8006-000000000006', '2026-05-29', 'Homemade pasta night. Unreal.', 32),
  -- Italiano — day 3: 16
  ('b2000006-0003-4003-8003-000000000603', 'REPLACE_WITH_YOUR_USER_ID', 'a1000006-0006-4006-8006-000000000006', '2026-05-30', 'Hand-holding walk. Very cinematic.', 16),

  -- Gym Guy #2 — day 1: 14
  ('b2000002-0001-4001-8001-000000000201', 'REPLACE_WITH_YOUR_USER_ID', 'a1000002-0002-4002-8002-000000000002', '2026-05-28', 'Gym date. He spotted me spiritually.', 14),
  -- Gym Guy #2 — day 2: 16
  ('b2000002-0002-4002-8002-000000000202', 'REPLACE_WITH_YOUR_USER_ID', 'a1000002-0002-4002-8002-000000000002', '2026-05-29', 'Meal prep together. Broccoli discourse.', 16),
  -- Gym Guy #2 — day 3: 18
  ('b2000002-0003-4003-8003-000000000203', 'REPLACE_WITH_YOUR_USER_ID', 'a1000002-0002-4002-8002-000000000002', '2026-05-30', 'Early for hike. Brought electrolytes.', 18),

  -- Love Handles Harry — day 1: 23
  ('b2000003-0001-4001-8001-000000000301', 'REPLACE_WITH_YOUR_USER_ID', 'a1000003-0003-4003-8003-000000000003', '2026-05-28', 'Burger joint. Sweet convo.', 23),
  -- Love Handles Harry — day 2: -15
  ('b2000003-0002-4002-8002-000000000302', 'REPLACE_WITH_YOUR_USER_ID', 'a1000003-0003-4003-8003-000000000003', '2026-05-29', 'Cancelled then sent a meme.', -15),
  -- Love Handles Harry — day 3: 16
  ('b2000003-0003-4003-8003-000000000303', 'REPLACE_WITH_YOUR_USER_ID', 'a1000003-0003-4003-8003-000000000003', '2026-05-30', 'Apology donuts. Sincere.', 16),

  -- Hammer Toe Tom — day 1: 17
  ('b2000004-0001-4001-8001-000000000401', 'REPLACE_WITH_YOUR_USER_ID', 'a1000004-0004-4004-8004-000000000004', '2026-05-28', 'Coffee. Funny, slightly limping.', 17),
  -- Hammer Toe Tom — day 2: -15
  ('b2000004-0002-4002-8002-000000000402', 'REPLACE_WITH_YOUR_USER_ID', 'a1000004-0004-4004-8004-000000000004', '2026-05-29', 'Love-bombed then went quiet.', -15),
  -- Hammer Toe Tom — day 3: 18
  ('b2000004-0003-4003-8003-000000000403', 'REPLACE_WITH_YOUR_USER_ID', 'a1000004-0004-4004-8004-000000000004', '2026-05-30', 'Clear about wanting something real.', 18),

  -- Yo-yo Dude — day 1: -5
  ('b2000005-0001-4001-8001-000000000501', 'REPLACE_WITH_YOUR_USER_ID', 'a1000005-0005-4005-8005-000000000005', '2026-05-28', 'Great vibe then bailed.', -5),
  -- Yo-yo Dude — day 2: -3
  ('b2000005-0002-4002-8002-000000000502', 'REPLACE_WITH_YOUR_USER_ID', 'a1000005-0005-4005-8005-000000000005', '2026-05-29', 'Texted all day, vanished at night.', -3),
  -- Yo-yo Dude — day 3: -10
  ('b2000005-0003-4003-8003-000000000503', 'REPLACE_WITH_YOUR_USER_ID', 'a1000005-0005-4005-8005-000000000005', '2026-05-30', 'Immature joke during serious chat.', -10),

  -- Dandruff Guy — day 1: -8
  ('b2000001-0001-4001-8001-000000000101', 'REPLACE_WITH_YOUR_USER_ID', 'a1000001-0001-4001-8001-000000000001', '2026-05-28', 'Watched stories, sent one-word replies.', -8),
  -- Dandruff Guy — day 2: -15
  ('b2000001-0002-4002-8002-000000000102', 'REPLACE_WITH_YOUR_USER_ID', 'a1000001-0001-4001-8001-000000000001', '2026-05-29', 'Avoided feelings talk. Lives far.', -15),
  -- Dandruff Guy — day 3: -4
  ('b2000001-0003-4003-8003-000000000103', 'REPLACE_WITH_YOUR_USER_ID', 'a1000001-0001-4001-8001-000000000001', '2026-05-30', 'Smart chat then ghosted mid-thread.', -4);

-- ---------------------------------------------------------------------------
-- Behaviours per entry (looked up by name from scoring_behaviors)
-- ---------------------------------------------------------------------------
insert into public.stat_entry_behaviors (entry_id, behavior_id)
select v.entry_id, sb.id
from (
  values
    -- Italiano
    ('b2000006-0001-4001-8001-000000000601'::uuid, 'Replies consistently'),
    ('b2000006-0001-4001-8001-000000000601', 'Flirty and playful'),
    ('b2000006-0002-4002-8002-000000000602', 'Plans thoughtful date'),
    ('b2000006-0002-4002-8002-000000000602', 'Makes you feel safe'),
    ('b2000006-0002-4002-8002-000000000602', 'Remembers small details'),
    ('b2000006-0003-4003-8003-000000000603', 'Strong chemistry'),
    ('b2000006-0003-4003-8003-000000000603', 'Interesting / passionate'),

    -- Gym Guy #2
    ('b2000002-0001-4001-8001-000000000201', 'Shared interests / hobbies'),
    ('b2000002-0001-4001-8001-000000000201', 'Live engaging conversation'),
    ('b2000002-0002-4002-8002-000000000202', 'Busy but still makes time'),
    ('b2000002-0002-4002-8002-000000000202', 'Forward plans consistently'),
    ('b2000002-0003-4003-8003-000000000203', 'Arrives early'),
    ('b2000002-0003-4003-8003-000000000203', 'Supportive during hard times'),

    -- Love Handles Harry
    ('b2000003-0001-4001-8001-000000000301', 'Comfort and ease'),
    ('b2000003-0001-4001-8001-000000000301', 'Flirty and playful'),
    ('b2000003-0001-4001-8001-000000000301', 'Plans thoughtful date'),
    ('b2000003-0002-4002-8002-000000000302', 'Only gives factual answers'),
    ('b2000003-0002-4002-8002-000000000302', 'Too unavailable / absent'),
    ('b2000003-0003-4003-8003-000000000303', 'Transparent about intentions'),
    ('b2000003-0003-4003-8003-000000000303', 'Replies consistently'),

    -- Hammer Toe Tom
    ('b2000004-0001-4001-8001-000000000401', 'Picks you up / organises transport'),
    ('b2000004-0001-4001-8001-000000000401', 'Interesting / passionate'),
    ('b2000004-0002-4002-8002-000000000402', 'Lovebombing'),
    ('b2000004-0002-4002-8002-000000000402', 'Hyperfocus obsession'),
    ('b2000004-0003-4003-8003-000000000403', 'Clear intentions'),
    ('b2000004-0003-4003-8003-000000000403', 'Relationship energy'),

    -- Yo-yo Dude
    ('b2000005-0001-4001-8001-000000000501', 'Strong chemistry'),
    ('b2000005-0001-4001-8001-000000000501', 'Bails last minute'),
    ('b2000005-0002-4002-8002-000000000502', 'Disappears during conflict'),
    ('b2000005-0002-4002-8002-000000000502', 'Replies consistently'),
    ('b2000005-0003-4003-8003-000000000503', 'Immature behavior'),
    ('b2000005-0003-4003-8003-000000000503', 'Benchwarmer / background orbiting'),

    -- Dandruff Guy
    ('b2000001-0001-4001-8001-000000000101', 'Benchwarmer / background orbiting'),
    ('b2000001-0001-4001-8001-000000000101', 'Only gives factual answers'),
    ('b2000001-0002-4002-8002-000000000102', 'Emotionally avoidant'),
    ('b2000001-0002-4002-8002-000000000102', 'Lives very far away'),
    ('b2000001-0003-4003-8003-000000000103', 'Social intelligence'),
    ('b2000001-0003-4003-8003-000000000103', 'Disappears during conflict')
) as v(entry_id, behavior_name)
join public.scoring_behaviors sb on sb.behavior = v.behavior_name;

-- ---------------------------------------------------------------------------
-- Expected overall leaderboard (sum of 3 days)
--   1. Italiano           62
--   2. Gym Guy #2           48
--   3. Love Handles Harry   24
--   4. Hammer Toe Tom       20
--   5. Yo-yo Dude          -18
--   6. Dandruff Guy        -27
-- ---------------------------------------------------------------------------

# 05 — Scoring System

## How Points Work

- Every behaviour has a **fixed point value** (positive or negative)
- User logs behaviours daily against a specific roster player
- Points accumulate over time to build their **total season score**
- Points are also tracked **weekly** to show form (rising / falling)
- **Consistency %** = how often you log entries for them (word vs. action tracking)

---

## Categories

| # | Category | Behaviours | Max Positive | Max Negative |
|---|----------|-----------|-------------|-------------|
| 1 | Effort & Planning | 6 | +31 | -22 |
| 2 | Communication | 7 | +34 | -26 |
| 3 | Emotional Safety | 6 | +43 | -21 |
| 4 | Attraction & Chemistry | 4 | +15 | -13 |
| 5 | Lifestyle Compatibility | 5 | +20 | -14 |
| 6 | Dating Intentions | 4 | +18 | -18 |
| 7 | Social & Personality | 5 | +27 | -15 |
| 8 | Roster Dynamics | 4 | +18 | -6 |

---

## Full Behaviour List (40 Behaviours)

### Effort & Planning

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Plans thoughtful date | +10 | Planning dinners, activities, logistics, effortful dates |
| Picks you up / organises transport | +8 | Driving, coordinating, convenience |
| Arrives early | +6 | Excited / conscientious behavior |
| Forward plans consistently | +7 | Makes future plans and follows through |
| Bails last minute | -12 | Cancels late / inconsistent reliability |
| Overbooks / double books | -10 | Conflicting plans / absent behavior |

### Communication

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Replies consistently | +9 | Steady WhatsApp communication |
| Asks meaningful questions | +10 | Curiosity, asking 'why', emotional understanding |
| Only gives factual answers | -6 | Low emotional/intellectual engagement |
| Live engaging conversation | +8 | Present, active chatting energy |
| Disappears during conflict | -12 | Avoidant shutdown behavior |
| Transparent about intentions | +7 | Self-aware and honest |
| Lovebombing | -8 | Over-intense validation/attention early on |

### Emotional Safety

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Makes you feel safe | +12 | Emotional openness without pressure |
| Remembers small details | +10 | Attention and care |
| Supportive during hard times | +12 | Shows up emotionally |
| Always on your team | +9 | Protective / validating energy |
| Emotionally avoidant | -10 | Uses work/hobbies to escape feelings |
| Inconsistent reliability | -11 | Words do not match actions |

### Attraction & Chemistry

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Comfort and ease | +8 | Relaxed, friendshippy connection |
| Strong chemistry | +7 | Excitement / spark |
| Hyperfocus obsession | -7 | Over-investment too quickly |
| Gets attached too fast | -6 | Emotional overattachment |

### Lifestyle Compatibility

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Busy but still makes time | +9 | Prioritises connection |
| Too unavailable / absent | -9 | Always busy / missing |
| Lives very far away | -5 | Logistical friction |
| Shared interests / hobbies | +6 | Gym dates, creative talks, etc |

### Dating Intentions

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Relationship energy | +8 | Consistent caring behavior |
| Only wants casual / shagging | -8 | Misaligned intentions |
| Leads someone on | -10 | Mixed signals / ambiguity |
| Clear intentions | +10 | Communicates what they want |

### Social & Personality

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Interesting / passionate | +9 | Feels alive and engaged in life |
| Social intelligence | +8 | Understands concepts and nuance |
| Flirty and playful | +5 | Light teasing / chemistry |
| Codependent behavior | -7 | Overly dependent dynamics |
| Immature behavior | -8 | Emotional inconsistency |

### Roster Dynamics

| Behaviour | Points | Description |
|-----------|--------|-------------|
| Multiple active options | +3 | Protects emotional balance |
| No roster loneliness | -4 | Attachment from scarcity |
| Benchwarmer / background orbiting | -2 | Watches stories, low effort lingering |
| Consistent main player | +15 | Reliable high-value roster slot |

---

## Seed SQL

Run this in Supabase SQL Editor to populate `scoring_behaviors`:

```sql
insert into scoring_behaviors (category, behavior, points, description) values
-- Effort & Planning
('Effort & Planning', 'Plans thoughtful date', 10, 'Planning dinners, activities, logistics, effortful dates'),
('Effort & Planning', 'Picks you up / organises transport', 8, 'Driving, coordinating, convenience'),
('Effort & Planning', 'Arrives early', 6, 'Excited / conscientious behavior'),
('Effort & Planning', 'Forward plans consistently', 7, 'Makes future plans and follows through'),
('Effort & Planning', 'Bails last minute', -12, 'Cancels late / inconsistent reliability'),
('Effort & Planning', 'Overbooks / double books', -10, 'Conflicting plans / absent behavior'),
-- Communication
('Communication', 'Replies consistently', 9, 'Steady WhatsApp communication'),
('Communication', 'Asks meaningful questions', 10, 'Curiosity, asking why, emotional understanding'),
('Communication', 'Only gives factual answers', -6, 'Low emotional/intellectual engagement'),
('Communication', 'Live engaging conversation', 8, 'Present, active chatting energy'),
('Communication', 'Disappears during conflict', -12, 'Avoidant shutdown behavior'),
('Communication', 'Transparent about intentions', 7, 'Self-aware and honest'),
('Communication', 'Lovebombing', -8, 'Over-intense validation/attention early on'),
-- Emotional Safety
('Emotional Safety', 'Makes you feel safe', 12, 'Emotional openness without pressure'),
('Emotional Safety', 'Remembers small details', 10, 'Attention and care'),
('Emotional Safety', 'Supportive during hard times', 12, 'Shows up emotionally'),
('Emotional Safety', 'Always on your team', 9, 'Protective / validating energy'),
('Emotional Safety', 'Emotionally avoidant', -10, 'Uses work/hobbies to escape feelings'),
('Emotional Safety', 'Inconsistent reliability', -11, 'Words do not match actions'),
-- Attraction & Chemistry
('Attraction & Chemistry', 'Comfort and ease', 8, 'Relaxed, friendshippy connection'),
('Attraction & Chemistry', 'Strong chemistry', 7, 'Excitement / spark'),
('Attraction & Chemistry', 'Hyperfocus obsession', -7, 'Over-investment too quickly'),
('Attraction & Chemistry', 'Gets attached too fast', -6, 'Emotional overattachment'),
-- Lifestyle Compatibility
('Lifestyle Compatibility', 'Busy but still makes time', 9, 'Prioritises connection'),
('Lifestyle Compatibility', 'Too unavailable / absent', -9, 'Always busy / missing'),
('Lifestyle Compatibility', 'Lives very far away', -5, 'Logistical friction'),
('Lifestyle Compatibility', 'Shared interests / hobbies', 6, 'Gym dates, creative talks, etc'),
-- Dating Intentions
('Dating Intentions', 'Relationship energy', 8, 'Consistent caring behavior'),
('Dating Intentions', 'Only wants casual / shagging', -8, 'Misaligned intentions'),
('Dating Intentions', 'Leads someone on', -10, 'Mixed signals / ambiguity'),
('Dating Intentions', 'Clear intentions', 10, 'Communicates what they want'),
-- Social & Personality
('Social & Personality', 'Interesting / passionate', 9, 'Feels alive and engaged in life'),
('Social & Personality', 'Social intelligence', 8, 'Understands concepts and nuance'),
('Social & Personality', 'Flirty and playful', 5, 'Light teasing / chemistry'),
('Social & Personality', 'Codependent behavior', -7, 'Overly dependent dynamics'),
('Social & Personality', 'Immature behavior', -8, 'Emotional inconsistency'),
-- Roster Dynamics
('Roster Dynamics', 'Multiple active options', 3, 'Protects emotional balance'),
('Roster Dynamics', 'No roster loneliness', -4, 'Attachment from scarcity'),
('Roster Dynamics', 'Benchwarmer / background orbiting', -2, 'Watches stories, low effort lingering'),
('Roster Dynamics', 'Consistent main player', 15, 'Reliable high-value roster slot');
```

---

## Future: Custom Behaviours

Planned feature (post-MVP): Allow users to add their own custom behaviours with custom point values. These would live in a `custom_behaviors` table with a `user_id` column.

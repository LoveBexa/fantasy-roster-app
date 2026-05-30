# 04 — Features Specification

## MVP Features (Phases 1–7)

### Authentication

| Capability | Status | Notes |
|------------|--------|-------|
| Google OAuth | ✅ Implemented | `components/login-form.tsx` → Supabase → `/auth/callback` → `/dashboard` |
| Email/password login | 🔲 UI only | Form renders; submit not wired to `signInWithPassword` |
| Apple OAuth | 🔲 UI only | Button present; not wired |
| Sign up page | ⏳ Not built | Planned at `app/(auth)/signup` |
| Forgot password | 🔲 UI only | Link placeholder |
| OAuth callback | ✅ Implemented | `app/auth/callback/route.ts` |
| Session refresh | ✅ Implemented | `proxy.ts` refreshes tokens via `getUser()` |
| Protected routes | ⏳ Not built | Proxy does not yet redirect unauthenticated users away from `/dashboard` |

**Google OAuth setup (external):**
1. Google Cloud → OAuth client redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
2. Supabase → Auth → Providers → Google (Client ID + Secret)
3. Supabase → URL Configuration → redirect URL: `http://localhost:3000/auth/callback` (+ production URL when deployed)

**Do not** put Google Client Secret in `.env.local` — only Supabase URL + anon key belong in the app.

### ✅ Roster Management
- Add a dating prospect (nickname + optional photo + status)
- Edit nickname, photo, status
- Delete player (soft delete or hard delete)
- Player statuses: Active / Bench / Injured / Ghosted / Free Agent

### ✅ Daily Stat Entry
- Select a player
- Pick a date (defaults to today)
- Choose behaviours from the 40-behaviour grid
- Add optional notes (250 chars)
- Save → points computed and stored
- Edit existing entry (upsert logic)

### ✅ League Table
- Ranked list of all roster players by total points
- Time filters: Overall / This Season / This Month / This Week
- Form arrows (last 3 entries trend)
- Consistency % meter
- MVP of the Week highlight card
- Most Improved highlight card
- Red Flag Alert highlight card
- Consistency King highlight card
- Love Bomb Index card
- Stats at a Glance summary strip
- Starting Lineup / Bench / Injured / Ghosted sections

### ✅ Scoring System Reference
- Full 40-behaviour list
- Grouped by category
- Point values visible
- Descriptions on hover/tap

### ✅ History
- Chronological log of all entries
- Filter by player or date range

---

## Post-MVP Features (Backlog)

### 🔮 Insights / Analytics
- Trend charts per player over time
- Category breakdown (are they bad at Communication vs. Effort?)
- Best/worst day of the week patterns

### 🔮 Chat Analyser
- Paste a WhatsApp conversation export
- AI (Claude API) extracts behaviours and suggests stat entry
- "We detected 3 positive and 1 negative behaviour — want to log them?"

### 🔮 Awards System
- Season-end awards (Most Consistent, Biggest Glow-Up, Most Ghosted, etc.)
- Badge collection visible on profile

### 🔮 Attachment Tracker
- Slider: track your own emotional investment level per player
- Warns when your investment is higher than their points score

### 🔮 Date Timeline
- Visual timeline of dates / interactions per player
- Photo moments, venue tags

### 🔮 Notifications
- Weekly recap push notification
- "You haven't logged [Player] in 3 days"
- Red flag alert notification

### 🔮 Custom Behaviours
- Add your own behaviour with custom point value
- Available only to you

### 🔮 Social / Sharing
- Share anonymous league table screenshot
- Export a "Dating Season Wrapped" graphic

### 🔮 Mobile App
- React Native / Expo version
- Matches the mobile mockups exactly
- Push notifications

---

## Feature Flags

For toggling post-MVP features in development:

```typescript
// lib/features.ts
export const FEATURES = {
  CHAT_ANALYSER: false,
  CUSTOM_BEHAVIORS: false,
  ATTACHMENT_TRACKER: false,
  AWARDS: false,
  INSIGHTS: true,  // enable when Insights page is built
} as const
```

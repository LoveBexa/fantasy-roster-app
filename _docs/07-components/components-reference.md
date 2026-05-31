# 07 — Component Library Reference

All components live in `components/`. Shadcn/ui primitives are in `components/ui/`.

**Types for roster players:** `components/roster/roster-types.ts`  
**DB column constants:** `lib/db/columns.ts`  
**Landing copy:** `lib/landing/landing-content.ts`

---

## Landing / marketing components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<LandingPageContent />` | `components/landing/landing-page-content.tsx` | Homepage section stack |
| `<LandingHero />` | `components/landing/landing-hero.tsx` | Hero + CTAs + hero image |
| `<LandingFeaturesBar />` | `components/landing/landing-features-bar.tsx` | Icon + title + subtext feature row |
| `<LandingDashboardPreview />` | `components/landing/landing-dashboard-preview.tsx` | Coded dashboard mock (not a screenshot) |
| `<LandingHowItWorksPreview />` | `components/landing/landing-how-it-works-preview.tsx` | 3-step preview cards |
| `<LandingJoinCta />` | `components/landing/landing-join-cta.tsx` | Mid-page join card + testimonial sticky notes |
| `<HeroStickyNote />` | `components/hero-sticky-note.tsx` | Shared pink sticky note (hero, login hero) |
| `<EditorialBlock />` | `components/editorial-block.tsx` | “Built with AI in 3 Days” — accepts optional `className` |
| `<SiteNavbar />` | `components/site-navbar.tsx` | Public nav — props: `ctaHref`, `ctaLabel`, `sticky` |
| `<AboutPageContent />` | `components/about/about-page-content.tsx` | About page body |
| `<HowItWorksContent />` | `components/how-it-works/how-it-works-content.tsx` | How it works page body |

---

## Dashboard components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<DashboardShell />` | `components/dashboard/dashboard-shell.tsx` | Sidebar + top bar + bottom nav wrapper |
| `<AppSidebar />` | `components/dashboard/app-sidebar.tsx` | Desktop nav (hidden below `lg`) |
| `<AppBottomNav />` | `components/dashboard/app-bottom-nav.tsx` | Mobile nav (below `lg`) |
| `<TopBar />` | `components/dashboard/top-bar.tsx` | Search UI, “Hi, {name}”, user dropdown |
| `<DashboardMain />` | `components/dashboard/dashboard-main.tsx` | Main content wrapper |
| `<PageHeader />` | `components/dashboard/page-header.tsx` | Shared page title + subtitle + optional icon |
| `<LeagueTable />` | `components/dashboard/league-table.tsx` | Ranked table — **live Supabase** |
| `<DailyStatInput />` | `components/dashboard/daily-stat-input.tsx` | Behaviour grid + save — **live Supabase** |
| `<FormChart />` | `components/dashboard/form-chart.tsx` | 7-day points mini chart |
| `<RightRail />` | `components/dashboard/right-rail.tsx` | Weekly summary / recent entries — **mock data** |

---

## Roster components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<RosterTable />` | `components/roster/roster-table.tsx` | Main roster page — list, filter, sort, CRUD; `initialShowAddForm` prop |
| `<AddPlayerForm />` | `components/roster/add-player-form.tsx` | Inline add form with scrollable emoji picker |
| `<EditPlayerDialog />` | `components/roster/edit-player-dialog.tsx` | Edit modal with full emoji picker |
| `<DeletePlayerDialog />` | `components/roster/delete-player-dialog.tsx` | Delete confirmation |

**Server actions:** `app/roster/actions.ts`

**Types / constants:** `components/roster/roster-types.ts`
- `Player`, `PlayerStatus`, `RelationshipStatus`
- `PLAYER_STATUSES`, `RELATIONSHIP_STATUSES`, `EMOJI_OPTIONS` (~150 emojis)

---

## Account components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<AccountPageContent />` | `components/account/account-page-content.tsx` | Profile, nickname, emoji, delete account UI |

---

## Auth components *(implemented)*

| Component | File | Purpose |
|-----------|------|---------|
| `<LoginForm />` | `components/login-form.tsx` | Email/password + Google OAuth |
| `<LoginHero />` | `components/login-hero.tsx` | Left panel hero on login page |
| `<SignupForm />` | `components/signup-form.tsx` | Sign up — nickname, email, password, Google |
| `<ForgotPasswordForm />` | `components/forgot-password-form.tsx` | Request password reset email |
| `<ResetPasswordForm />` | `components/reset-password-form.tsx` | Set new password after email link |
| Icons | `components/doodles.tsx` | `GoogleIcon`, `HeartDoodle`, `StarDoodle`, `CrownDoodle`, etc. |

---

## Lib modules (data layer)

| Module | Key exports |
|--------|-------------|
| `lib/roster/players.ts` | `fetchRosterPlayers`, `createRosterPlayer`, `updateRosterPlayer`, `deleteRosterPlayer`, `rowToPlayer` |
| `app/roster/actions.ts` | `createRosterPlayerAction`, `updateRosterPlayerAction`, `deleteRosterPlayerAction` |
| `lib/stats/stat-entries.ts` | `fetchScoringBehaviors`, `saveStatEntry`, `fetchPlayerWeeklyForm` |
| `lib/stats/behavior-icons.ts` | Icon mapping per behaviour name |
| `lib/league/league-table.ts` | `fetchLeagueTable`, `syncLeagueSnapshots`, `LeaguePeriod`, `LeagueTableRow` |
| `lib/auth/get-session-user.ts` | `getSessionUserContext()` — user + profile row + display |
| `lib/auth/user-display.ts` | `getUserDisplay(user, profileRow?)` for TopBar |
| `lib/auth/user-profile.ts` | `getUserProfile(user, profileRow?)` for Account page |
| `lib/auth/user-profile-db.ts` | `fetchUserProfileRow`, `saveUserProfile`, `ensureUserProfileRow` |
| `lib/auth/use-logout.ts` | Client logout hook |
| `lib/landing/landing-content.ts` | Editable homepage copy and mock dashboard data |
| `lib/supabase/errors.ts` | `toError()`, `getErrorMessage()` |

---

## Shared / planned components

These were in the original spec but not yet extracted as standalone files:

| Component | Planned path | Notes |
|-----------|--------------|-------|
| `<PlayerAvatar />` | `components/shared/PlayerAvatar.tsx` | Use emoji from roster today |
| `<StatusBadge />` | `components/shared/StatusBadge.tsx` | Inline in roster table for now |
| `<PointsBadge />` | `components/shared/PointsBadge.tsx` | Used inline in stat input |
| `<FormArrows />` | Inline in league table | ↑/↓ in `league-table.tsx` |
| `<BehaviorGrid />` | Part of `DailyStatInput` | Flat card grid, not category accordion |

---

## Types reference

App types live in component/lib files rather than a central `types/database.ts`:

```typescript
// components/roster/roster-types.ts
interface Player {
  id: string
  nickname: string
  description: string
  emoji: string
  status: "Active" | "Reserve" | "Free Agent" | "Ghosted" | "Removed"
  relationshipStatus: RelationshipStatus | null
  addedDate: string
  lastUpdated: string
  notes?: string
  photoUrl?: string
}

// lib/league/league-table.ts
interface LeagueTableRow {
  playerId: string
  rank: number
  nickname: string
  emoji: string
  tint: string
  points: number
  delta: number
  form: ("up" | "down")[]
  consistency: number
}

// lib/auth/user-profile-db.ts
interface UserProfileRow {
  user_id: string
  nickname: string | null
  avatar_emoji: string | null
}
```

---

## Public assets

| File | Used on |
|------|---------|
| `public/images/women-looking-phone.png` | Homepage hero, how-it-works hero |
| `public/images/three-women.png` | Login hero |
| `public/images/four-women.png` | About page hero |
| `public/images/trophy.png` | Editorial sticky note, landing dashboard mock |
| `public/images/sticky_note.png` | Legacy — replaced by `<HeroStickyNote />` component |

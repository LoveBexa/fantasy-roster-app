# 01 — Project Overview

## What Is Level Up Roster?

Level Up Roster is a **dating performance tracker** for women who want to date intentionally. Users add the people they're dating ("roster players"), log daily behaviours against a points system, and see everyone ranked in a live League Table.

The tagline: **"Good dates. Good data. Good energy."**

---

## Core Concept

- Each person you're dating is a **Roster Player**
- You log **daily stat entries** — behaviours (positive or negative) that happened
- Every behaviour has a **point value** (+3 to +15, or -4 to -20)
- Players accumulate points → ranked in the **League Table**
- The app surfaces patterns: who's rising, who's a red flag, who's consistent

---

## Target User

Women (primarily 25–40) who are actively dating multiple people and want to:
1. Cut through emotional fog with objective data
2. Spot patterns before they become problems
3. Make smarter decisions about where to invest their energy

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR, routing, server components |
| Language | TypeScript | Type safety at scale |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Database | Supabase (Postgres) | Auth + DB + Storage in one |
| ORM | Supabase JS client (`@supabase/supabase-js`) | Type-safe DB queries |
| Deployment | Vercel | Zero-config Next.js hosting |
| AI Coding | Cursor + v0.dev | Accelerated development |

---

## Build Phases

### ✅ Phase 0 — Machine Setup
Node.js LTS, VS Code / Cursor, GitHub account

### ✅ Phase 1 — Accounts
Supabase project `level-up-roster`, Vercel connected to GitHub

### ✅ Phase 2 — Project Scaffold
`npx create-next-app@latest`, Supabase client installed, shadcn/ui initialised, `.env.local` configured

### ✅ Phase 3 — Database
All tables created, RLS enabled, seed data loaded (40 scoring behaviours)

### ✅ Phase 4 — Auth
Login page, Signup page, Google + Apple OAuth, Supabase Auth confirmed working

### 🔄 Phase 5 — Core App Pages *(current)*
- Dashboard layout with sidebar nav
- Add Player page
- Daily Stat Input page

### ⏳ Phase 6 — League Table Page
Aggregation query, ranked table, MVP card, Red Flag card

### ⏳ Phase 7 — Deploy
Push to GitHub, import to Vercel, add env vars, go live

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Set in:
- Local: `.env.local` in project root
- Production: Vercel → Project Settings → Environment Variables

---

## Project Folder Structure

```
level-up-roster/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← sidebar nav lives here
│   │   ├── league/page.tsx
│   │   ├── roster/page.tsx
│   │   ├── daily-stats/page.tsx
│   │   ├── scoring/page.tsx
│   │   ├── history/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   └── page.tsx                ← redirects to login/dashboard
├── components/
│   ├── ui/                     ← shadcn components
│   ├── league/
│   ├── roster/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← browser client
│   │   └── server.ts           ← server component client
│   └── utils.ts
├── types/
│   └── database.ts             ← generated Supabase types
└── .env.local
```

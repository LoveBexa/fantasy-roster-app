# Level Up Roster

> Track the patterns. Protect your energy. Win the league.

**Level Up Roster** is a dating performance tracker — think fantasy football, but for your dating life. You add the people you're seeing as **roster players**, log daily behaviours against a points system, and rank everyone in a live **League Table** so patterns show up before emotions take over.

**Tagline:** *Good dates. Good data. Good energy.*

---

## What it does

| Feature | Description |
|---------|-------------|
| **Roster** | Add dating prospects with a nickname, photo, and status (Active, Bench, Ghosted, etc.) |
| **Daily stat entry** | Log what happened today — 40 scored behaviours across categories like communication, effort, and red flags |
| **Points system** | Each behaviour has a fixed value (+3 to +15, or −4 to −20). Entries roll up into player totals |
| **League table** | See everyone ranked by points, with form trends, consistency, and highlight cards (MVP, red flags, etc.) |
| **History & insights** | Review past entries and spot patterns over time *(planned)* |

The goal is intentional dating: cut through the fog, notice who’s consistent vs. who’s draining you, and decide where to invest your energy with clearer data.

---

## Who it’s for

Women (primarily 25–40) who are actively dating and want to:

1. Replace guesswork with observable patterns  
2. Catch red flags early  
3. Treat dating like a skill you can track and improve  

---

## Current status

This repo is under active development. What’s working today:

- **Login** at `/` — split-screen UI with **Google OAuth** (Supabase Auth)
- **Dashboard** at `/dashboard` — sidebar, daily stat input, league table, and awards rail *(UI with mock data)*
- **Backend** — Supabase Postgres schema, RLS, and 40 behaviour seed data are defined in docs

Still to build: live data wiring, email/password auth, roster CRUD, route protection, and production deploy.

Full specs and progress live in [`_docs/`](./_docs/README.md).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Supabase (Postgres, Auth, Storage) |
| Hosting | Vercel *(planned)* |

---

## Getting started

### Prerequisites

- Node.js LTS  
- A [Supabase](https://supabase.com) project  

### Setup

```bash
git clone git@github.com:LoveBexa/fantasy-roster-app.git
cd fantasy-roster-app
npm install
```

Create `.env.local` in the project root *(never commit this file)*:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Production (Vercel) — include https://
NEXT_PUBLIC_SITE_URL=https://therosterleague.com
```

Copy from [`.env.example`](./.env.example). For Google sign-in, set Supabase **Site URL** to `https://therosterleague.com` and allow `https://therosterleague.com/auth/callback` — see [`_docs/08-deployment/deployment.md`](./_docs/08-deployment/deployment.md).

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for local dev. Production: [https://therosterleague.com](https://therosterleague.com). After Google auth you’ll land on `/dashboard`.

---

## Project structure

```
app/
  page.tsx              Login (/)
  dashboard/page.tsx    Main app shell
  auth/callback/        OAuth session exchange
components/
  dashboard/            League table, stat input, sidebar, etc.
  login-form.tsx        Login + Google OAuth
lib/supabase/           Browser + server Supabase clients
_docs/                  Full product & engineering knowledge base
```

---

## Documentation

The [`_docs/`](./_docs/) folder is the single source of truth for design, database schema, scoring rules, page specs, and deployment.

Start here: [`_docs/README.md`](./_docs/README.md)

---

## License

Private project — all rights reserved.

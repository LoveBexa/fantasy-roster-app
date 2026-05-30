# Level Up Roster — Knowledge Base

> Track the patterns. Protect your energy. Win the league.

This knowledge base is the single source of truth for the **Level Up Roster** app — a dating performance tracker that ranks people you're dating using a points-based behaviour system.

---

## 📁 Knowledge Base Structure

| Folder | Contents |
|--------|----------|
| [`01-overview/`](./01-overview/) | Project vision, tech stack, build phases |
| [`02-design/`](./02-design/) | Brand identity, colours, typography, design tokens |
| [`03-database/`](./03-database/) | Supabase schema, RLS policies, SQL reference |
| [`04-features/`](./04-features/) | Feature specs for every app feature |
| [`05-scoring/`](./05-scoring/) | Full trait/behaviour scoring system (all 40 behaviours) |
| [`06-pages/`](./06-pages/) | Page-by-page specs and data requirements |
| [`07-components/`](./07-components/) | Reusable component library reference |
| [`08-deployment/`](./08-deployment/) | Vercel deployment, env vars, CI/CD |

---

## 🚀 Current Status

- **Phase 5–6 — Dashboard & League Table UI** (in progress in Cursor)
- **Completed**: Phases 0–4 (machine setup, accounts, scaffold, database); Google OAuth login wired to Supabase
- **Built in repo**: Login page (`/`), dashboard shell (`/dashboard`) with daily stat input + league table UI, Supabase auth clients + OAuth callback
- **Next**: Wire dashboard to live Supabase data → route protection in `proxy.ts` → email/password + Apple auth → deploy (Phase 7)

---

## ⚡ Quick Reference

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind
- **Backend**: Supabase (Postgres + Auth + Storage)
- **UI Library**: shadcn/ui
- **Deployment**: Vercel
- **Primary Colour**: Crimson `#8B1A1A`
- **Background**: Cream `#FAF6F1`
- **Accent**: Olive `#5C6B3A`

---

## 🔗 Key External Links

- Supabase Dashboard: `https://supabase.com/dashboard`
- Vercel Dashboard: `https://vercel.com/dashboard`
- v0 (UI generation): `https://v0.dev`
- Cursor AI: `https://cursor.com`

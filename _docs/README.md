# Level Up Roster — Knowledge Base

> Track the patterns. Protect your energy. Win the league.

This folder is the **single source of truth** for product, design, and engineering decisions on **Level Up Roster**.

For a GitHub-facing overview and local setup, see the [root README](../README.md).

---

## About the project

**Level Up Roster** is a dating performance tracker — fantasy sports for your dating life. Users add people they're seeing as **roster players**, log **daily stat entries** (40 scored behaviours), and view a ranked **League Table** that surfaces who's rising, who's consistent, and who's a red flag.

**Tagline:** *Good dates. Good data. Good energy.*

### Core loop

1. **Add players** to your roster (nickname, photo, status)
2. **Log behaviours** after dates or interactions (+3 to +15, or −4 to −20 per behaviour)
3. **Review rankings** — totals, form trends, MVP / red-flag highlights
4. **Decide with data** — where to invest energy, who to bench, who to cut

### Who it's for

Women (primarily 25–40) actively dating who want to spot patterns early, reduce emotional fog, and date more intentionally.

### How this docs folder fits in

| You need… | Start here |
|-----------|------------|
| Vision, phases, folder structure | [`01-overview/project-overview.md`](./01-overview/project-overview.md) |
| Colours, typography, tokens | [`02-design/design-system.md`](./02-design/design-system.md) |
| Tables, RLS, SQL | [`03-database/schema.md`](./03-database/schema.md) |
| Feature list + auth status | [`04-features/features.md`](./04-features/features.md) |
| All 40 behaviours + points | [`05-scoring/behaviours-seed.md`](./05-scoring/behaviours-seed.md) |
| Page layouts + routes | [`06-pages/page-specs.md`](./06-pages/page-specs.md) |
| Component file paths | [`07-components/components-reference.md`](./07-components/components-reference.md) |
| Env vars, OAuth, deploy | [`08-deployment/deployment.md`](./08-deployment/deployment.md) |

---

## 📁 Knowledge base structure

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

## 🚀 Current status

- **Phase 5–6 — Dashboard & League Table UI** (in progress)
- **Done**: Scaffold, Supabase schema, Google OAuth login, dashboard UI shell
- **In repo**: Login (`/`), dashboard (`/dashboard`), `lib/supabase/`, `app/auth/callback/`, `proxy.ts`
- **Next**: Wire dashboard to live data → route protection → email/Apple auth → deploy (Phase 7)

Key routes today:

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Login; Google OAuth live |
| `/dashboard` | `app/dashboard/page.tsx` | Stat input + league table (mock data) |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth → session → redirect `/dashboard` |

---

## ⚡ Quick reference

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind
- **Backend**: Supabase (Postgres + Auth + Storage)
- **UI Library**: shadcn/ui
- **Deployment**: Vercel
- **Primary colour**: Crimson `#8B1A1A`
- **Background**: Cream `#FAF6F1`
- **Accent**: Olive `#5C6B3A`

---

## 🔗 Key external links

- Supabase Dashboard: `https://supabase.com/dashboard`
- Vercel Dashboard: `https://vercel.com/dashboard`
- v0 (UI generation): `https://v0.dev`
- Cursor AI: `https://cursor.com`

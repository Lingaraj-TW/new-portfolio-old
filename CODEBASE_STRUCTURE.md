# ProDoc — codebase folder map

How this repository is organized. **URLs come from `app/`** (Next.js App Router). **UI lives in `components/`** by feature. **Copy and MDX live in `content/`**.

---

## Top level

| Folder / file | Purpose |
|---------------|---------|
| `app/` | Routes, layouts, API handlers, server actions |
| `components/` | React UI grouped by feature |
| `content/` | Site copy (`.ts`) and doc MDX under `content/docs/` |
| `lib/` | Shared logic (Supabase, docs pipeline, feedback, assistant) |
| `public/` | Static assets (images, portfolio screenshots, downloads) |
| `supabase/migrations/` | SQL schema + RLS |
| `scripts/` | Dev tooling (e.g. preview screenshots) |
| `archive/my-website/` | Archived Docusaurus site (optional second docs host) |
| `SCOPE.md` | Product scope and portfolio build notes |
| `.env.example` | Env template (copy to `.env.local`) |

---

## `app/` — routes (what users open)

### Marketing & portfolio

| Path | Folder | Role |
|------|--------|------|
| `/` | `app/page.tsx` | Home — hero, products, contact |
| `/about` | `app/about/` | About page |
| `/experience` | `app/experience/` | Experience timeline |
| `/skills` | `app/skills/` | Skills page |
| `/contact` | `app/contact/` | Contact page |
| `/products/*` | `app/products/` | Product marketing pages (ProDoc, ProFeed, ProInsights, …) |
| `/feed` | `app/feed/` | Public feed |

### Documentation (Next.js MDX)

| Path | Folder | Role |
|------|--------|------|
| `/docs/*` | `app/docs/[[...slug]]/` | MDX docs from `content/docs/` |
| `/prodoc/*` | (rewrite in `next.config.ts`) | Alias → `/docs` |

### Products (authenticated / data)

| Path | Folder | Role |
|------|--------|------|
| `/profeed` | `app/profeed/` | Feedback feed, inbox, detail |
| `/profeed/inbox` | `app/profeed/inbox/` | Triage inbox (admin) |
| `/profeed/portal` | `app/profeed/portal/` | Customer portal view |
| `/proinsights` | `app/proinsights/` | Analytics dashboard |
| `/admin` | `app/admin/` | Admin dashboard (posts) |

### Legacy redirects

| Path | Behavior |
|------|----------|
| `/admin/login`, `/portal/*` | Redirect to ProFeed / portal equivalents |
| `/profeed/login` | Redirects to `/profeed` |

### API

| Path | Folder |
|------|--------|
| `POST /api/feedback` | `app/api/feedback/route.ts` |
| `PATCH /api/feedback/[id]` | `app/api/feedback/[id]/` |
| `GET /api/docs/meta/[...slug]` | `app/api/docs/meta/[...slug]/` |
| `GET /api/storage/sign` | `app/api/storage/sign/` |
| `POST /api/contact` | `app/api/contact/` |
| `POST /api/assistant/chat` | `app/api/assistant/chat/` |

### Preview / dev only

| Path | Folder |
|------|--------|
| `/preview/proinsights-mock` | Static ProInsights UI for screenshots |

---

## `components/` — UI by feature

```
components/
├── admin/           # Admin dashboard (login, posts, logout)
├── assistant/       # ProDoc assistant chat widget
├── docs/            # In-app docs feedback widget
├── feed/            # Public feed cards / views
├── home/            # Homepage sections + tech-stack
├── icons/           # Brand icons
├── layout/          # Navbar, footer, marketing shell (canonical)
├── portfolio/       # Legacy re-exports → prefer `layout/` + `products/`
├── products/        # Product pages (heroes, demo blocks, cards)
├── profeed/         # ProFeed shell, inbox, widget, status form
│   ├── inbox/       # Inbox table, filters, badges
│   └── portal/      # Portal list + login/logout
├── proinsights/     # Charts + cross-tab refresh listener
├── shared/          # FadeUp, PageFadeIn, SignedStorageLink
└── ui/              # Small primitives
```

**Rule of thumb:** add new UI next to the feature it serves (`profeed/*` for triage, `home/*` for landing page).

---

## `content/` — data & docs source

| Path | Role |
|------|------|
| `content/homepage.ts`, `navigation.ts`, `about.ts`, … | Marketing copy |
| `content/products/` | Product metadata for cards / pages |
| `content/docs/**/*.mdx` | Documentation pages (compiled by `lib/mdx/`) |

---

## `lib/` — shared logic

| Path | Role |
|------|------|
| `lib/supabase/` | Browser/server clients, middleware session |
| `lib/docs/` | Slugs, paths, MDX compile helpers |
| `lib/feedback/` | Highlights, queries, inbox mapping |
| `lib/profeed/` | Widget helpers (sanitize, canvas, parse) |
| `lib/assistant/` | Assistant knowledge + LLM |
| `lib/feed/` | Feed queries/actions |
| `lib/admin/` | Admin session helpers |
| `lib/types/` | Shared TypeScript types |

---

## `public/` — static files

| Path | Role |
|------|------|
| `public/portfolio/` | Product preview PNGs for home cards |
| `public/images/` | General images (e.g. tech stack) |
| `public/brands/`, `companies/` | Logos |

---

## What to ignore locally

| Path | Why |
|------|-----|
| `node_modules/`, `.next/` | Generated |
| `tmp/` | Local scratch (not part of the app) |
| `.gitnexus/`, `.claude/` | Tooling / agent skills |

---

## Quick “where do I change X?”

| I want to… | Edit |
|------------|------|
| Home page layout / products grid | `app/page.tsx`, `components/home/*` |
| Navbar / footer | `components/layout/*` |
| Doc page content | `content/docs/**/*.mdx` |
| Feedback submit API | `app/api/feedback/route.ts` |
| ProFeed inbox table | `components/profeed/inbox/*`, `app/profeed/inbox/` |
| Status dropdown save | `components/profeed/FeedbackStatusForm.tsx`, `app/profeed/actions.ts` |
| ProInsights charts | `components/proinsights/ProInsightsCharts.tsx` |
| Supabase schema | `supabase/migrations/*.sql` |

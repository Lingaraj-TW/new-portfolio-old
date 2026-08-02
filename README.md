# ProDoc

Portfolio + **documentation ecosystem** for **Linga Raj M** (Senior Technical Writer): a marketing site plus six connected product concepts — three with live demos in this repo.

See **[CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md)** for the folder map and **[SCOPE.md](./SCOPE.md)** for build scope and portfolio notes.

## Products

| Product | What it is | Marketing page | Live in this app |
|---------|------------|----------------|------------------|
| **ProDoc** | MDX docs-as-code (guides, API-style samples, SDK-style content) | `/products/prodoc` | `/prodoc` (rewrites to `/docs`) |
| **ProFeed** | Feedback capture, triage inbox, status workflow | `/products/profeed` | `/profeed`, `/profeed/inbox` |
| **ProInsights** | Analytics dashboard over ProFeed data (charts, trends) | `/products/proinsights` | `/proinsights` (auth); `/preview/proinsights-mock` for screenshots |
| **ProStyle** | Style guide & terminology consistency (concept) | `/products/prostyle` | — |
| **ProReview** | Collaborative doc review workflow (concept) | `/products/proreview` | — |
| **ProOps** | Docs operations, governance, release cadence (concept) | `/products/proops` | — |

Overview of all six: `/products`

**Loop:** readers submit feedback on **ProDoc** → triage in **ProFeed** → metrics in **ProInsights**. **ProStyle**, **ProReview**, and **ProOps** are portfolio concept pages for the wider platform story.

## Features

- **Portfolio** — home, about, experience, skills, contact, product ecosystem cards
- **ProDoc** — MDX documentation with section-level feedback widget
- **ProFeed** — public feed, admin inbox (`/profeed/inbox`), customer portal (`/profeed/portal`)
- **ProInsights** — Recharts dashboards fed from Supabase `feedback` data
- **ProDoc Assistant** — site/docs-aware chat (optional Gemini key)
- **Admin** — content dashboard at `/admin/dashboard` (separate from ProFeed triage)

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage (feedback + attachments)
- [Recharts](https://recharts.org/) — ProInsights charts
- MDX via `next-mdx-remote` (`content/docs/`)

## Local development

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set your Supabase project URL and anon key. Run SQL in `supabase/migrations/` (001 → 002 → 003 as noted in `.env.example`).

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

4. **ProFeed / ProInsights (authenticated)**

   In Supabase Auth, set `app_metadata.role` to `admin` or `customer` for your user. Then open `/profeed/inbox` or `/proinsights`.

5. **Optional**

   - `SUPABASE_SERVICE_ROLE_KEY` — attachment uploads and signed download URLs
   - `GEMINI_API_KEY` — full ProDoc Assistant replies
   - `npm run capture-previews` — regenerate home-page product screenshots under `public/portfolio/`

## Deployment

- **App:** [Vercel](https://vercel.com/) (or any Node host). Use the same env vars as `.env.example`.
- **Database:** Supabase project; apply migrations once per environment.

## License

See [LICENSE](LICENSE).

# ProDoc — project scope & build reference

This document records what this repository is for, what has been implemented, and where to change things. It reflects the **current codebase** and the **portfolio / landing-page work** built in this effort.

---

## 1. Purpose

**ProDoc** is a Next.js application that serves two goals:

1. **Personal portfolio / marketing site** — home page for **Linga Raj M** (Senior Technical Writer): hero, about, skills, experience, contact, and a **Products / Portfolio** section showcasing three demo products.
2. **Documentation ecosystem demo** — a working **Docs-as-code** documentation site with **reader feedback**, **admin triage (ProFeed)**, and **analytics (ProInsights)**, backed by **Supabase** when configured.

The intent is to show how documentation can be treated as a product, with feedback and insights in the same loop as the docs.

---

## 2. The three “products” (conceptual)

| Name | What it is | Entry in the app |
|------|------------|------------------|
| **ProDoc** | MDX-based documentation: guides, API-style content, portable MDX pipeline | Public doc URLs: `/prodoc` rewrites to `/docs` (see rewrites). `NEXT_PUBLIC_PRODOC_URL` can point the “Live demo” link at another host’s `/docs`. |
| **ProFeed** | Feedback triage: list feedback from docs, status, tags, attachments (with RLS) | `/profeed` (auth); `/profeed/login` for sign-in; `/profeed/portal` for a portal-oriented view. |
| **ProInsights** | Analytics-style dashboard over the same `feedback` data (trends, charts) | `/profeed/login` for unauthenticated users; full UI requires the same auth roles. |

> **Auth note:** ProFeed and ProInsights expect Supabase Auth users whose JWT `app_metadata.role` is `admin` or `customer`. Without configuration, these areas show “Supabase is not configured” or redirect to login.

---

## 3. Technology stack (high level)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router) |
| UI | **React 19**, **Tailwind CSS 4** |
| Docs | **MDX** via **next-mdx-remote**, `content/docs` sources, `compileDocMdx` pipeline |
| Data / auth (optional) | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) |
| Charts (ProInsights) | **Recharts** |
| Language | **TypeScript** |

---

## 4. Notable routes & rewrites

- **`/prodoc` → `/docs`** and **`/prodoc/*` → `/docs/*`** (see `next.config.ts`). User-facing “documentation” links use the `/prodoc` path on the same origin unless `NEXT_PUBLIC_PRODOC_URL` is set.
- **Home:** `app/page.tsx` — portfolio sections, `id="featured"` for the product cards, separate `id="portfolio"` for a later section (nav item “Portfolio” may target that anchor).
- **Docs:** `app/docs/[[...slug]]/page.tsx` — dynamic MDX from `content/docs`.
- **API:** e.g. `app/api/feedback` (POST feedback, CORS), `app/api/feedback/[id]`, `app/api/storage/sign` (signed URLs for attachments when service role is configured), `app/api/docs/meta/...` for doc metadata.
- **Preview (portfolio helpers):** `app/preview/proinsights-mock/page.tsx` — **noindex** static page that renders **ProInsights-style UI** with **mock data** and the same `ProInsightsCharts` component. Intended for **screenshot / capture** of the real dashboard look **without** Supabase and **without** logging in. Not indexed by search engines.

---

## 5. Environment variables

See **`.env.example`**. In short:

- **`NEXT_PUBLIC_SUPABASE_URL`**, **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — required for ProFeed/ProInsights/feedback flows to function end-to-end.
- **`NEXT_PUBLIC_PRODOC_URL`** (optional) — if set, “open docs” style links can target another base URL; if unset, this app’s `/prodoc` routes are used.
- **`PRODOC_ALLOWED_ORIGINS`** — CORS for `POST` to `/api/feedback` from your doc origin(s).
- **`SUPABASE_SERVICE_ROLE_KEY`** (optional, server) — attachments, edit-by-secret, and related server operations.

---

## 6. Portfolio & “Products” section (`app/page.tsx`)

The dark card block (inside `id="featured"`) is the main **ecosystem / portfolio** showcase.

### 6.1 Content model

- Data lives in the **`featuredProducts`** array: `title`, `shortDescription`, `tags`, `liveDemoHref`, `previewImage`.
- **`VISIBLE_TAG_COUNT`** caps visible tags; overflow shows a `+N` chip.

### 6.2 Styling & UX decisions (as built)

- **Section label “Portfolio”:** small caps, **orange** (`text-orange-500`), wide letter-spacing.
- **Headline:** “A documentation ecosystem for **SaaS companies**” — accent on “SaaS companies” in light blue (`#7c8ed9`).
- **Subcopy:** gray supporting text (documentation + feedback + insights loop).
- **Per-product card:**
  - **Window chrome (top bar):** three circles in **macOS traffic-light** colors (close / minimize / zoom): `#ff5f57`, `#febc2e`, `#28c840`; title line `{product} · snapshot`.
  - **Preview area:** **16:10** aspect, `next/image` **cover** from **`previewImage`**, `object-top` so the top of each screenshot is preferred.
  - **Body:** product title, italic gray description, tag pills, **Live demo** button (periwinkle, globe icon) using `LiveDemoLink` (external `href` opens in a new tab when `isExternalDocHref` is true).
- **ProDoc “Live demo”** uses `getProdocEntryHref()` from `lib/prodoc-urls.ts` so behavior matches env (same app vs external docs URL).

### 6.3 Preview image assets

- Each product has **`previewImage`** pointing to files under **`public/portfolio/`**:
  - `prodoc.png` — from `/prodoc` (default doc)
  - `profeed.png` — from `/profeed/login`
  - `proinsights.png` — from `/preview/proinsights-mock` (static mock; real `/proinsights` requires auth)
- **Regenerate:** `npm run capture-previews` (runs `next build`, `playwright install chromium`, starts **`next start` on port 3005** so it does not clash with `next dev` on 3000, then runs `shot-previews`). First run may take a while while Chromium is downloaded.

### 6.4 Manual capture (optional)

If you change routes or viewport, edit **`scripts/capture-previews.mjs`**. Viewport is **1280×800** (16:10) to match the card preview.

---

## 7. Content & doc pipeline

- **MDX source:** `content/docs/**/*.mdx` (see `lib/docs/paths.ts` for slugs, nav, and safe slug rules).
- **Compilation:** `compileDocMdx` with GFM, slugify headings, autolink headings, etc.
- **Docusaurus / secondary site:** a **`my-website`** tree exists in-repo for a separate Docusaurus-style experience; the main app’s `content/docs` is the source for the Next.js `/docs` app.

---

## 8. Feedback data model (conceptual)

- **Table `feedback`:** page path, section anchor, body, rating, star rating, tags, highlights (JSON), status, session, timestamps; related **`feedback_attachments`** for files when storage is set up.
- **SQL / migrations:** e.g. `002_portfolio_feedback.sql` (referenced in UI when schema errors appear).

---

## 9. Files that matter for the portfolio / preview story

| File | Role |
|------|------|
| `app/page.tsx` | Home page, `featuredProducts`, portfolio section UI |
| `lib/prodoc-urls.ts` | Doc base URL and “first doc” link behavior |
| `app/preview/proinsights-mock/page.tsx` | Noindex ProInsights **mock** for screenshots / demos |
| `components/ProInsightsCharts.tsx` | Shared charts for real ProInsights + mock page |
| `public/portfolio/*` | Product card PNGs; regenerate via **`npm run capture-previews`** |
| `scripts/capture-previews.mjs` | Playwright script that writes the three PNGs |

---

## 10. Glossary

| Term | Meaning here |
|------|----------------|
| **ProDoc** | Documentation product (MDX site + rewrites) |
| **ProFeed** | Feedback triage / list / portal surfaces |
| **ProInsights** | Analytics dashboard (Recharts) over feedback data |
| **Live demo** | CTA on each card; may open `/prodoc`, `/profeed`, `/proinsights`, or an external `NEXT_PUBLIC_PRODOC_URL` |
| **Portfolio section** | In-app label + dark block describing the ecosystem; uses `id="featured"`; nav “Products” points here |

---

## 11. Revision log (this document)

- **2026-04-22:** Initial scope file added: product overview, stack, routes, env, portfolio UI details, preview/mock strategy, and file pointers. Align this section when you make major product or structural changes.

---

*End of scope document.*

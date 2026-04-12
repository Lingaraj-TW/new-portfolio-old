# ProDoc

Documentation as a product: interactive docs with **section-level feedback** and an **admin triage** dashboard for product teams.

## Features (MVP)

- Public documentation site (MDX, heading anchors for section targeting)
- Feedback widget: helpful / not helpful + optional message, tied to page and section
- Supabase-backed storage with RLS (anonymous submit, authenticated admin)
- Admin UI at `/admin` for listing and updating feedback status

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com/) (Postgres, Auth)

## Local development

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set your Supabase project URL and keys. Apply the SQL in `supabase/migrations/` in the Supabase SQL editor (or use the Supabase CLI).

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. **Admin**

   Create a user in Supabase Auth (or sign up if enabled). Grant admin by setting `app_metadata.role` to `admin` for that user (see `supabase/migrations` notes), then sign in at `/admin/login`.

## Deployment

- **App:** Deploy to [Vercel](https://vercel.com/) (or any Node host). Set the same env vars as `.env.example`.
- **Database:** Use your Supabase project; run migrations once.

## License

See [LICENSE](LICENSE).

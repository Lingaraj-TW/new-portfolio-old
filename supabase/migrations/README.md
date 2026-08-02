# Supabase migrations

## Apply

1. Open your [Supabase project SQL editor](https://supabase.com/dashboard).
2. Paste and run migrations in order: `001_feedback.sql`, `002_portfolio_feedback.sql`,
   `003_profeed_anon_read.sql`, `004_profeed_rich_feedback.sql`, `005_profeed_posts.sql`,
   `006_profeed_writer_image.sql`.

- `003` lets visitors open `/profeed` and see the feedback table without signing in.
- `005` creates the public **content feed** tables (`posts`, `categories`, `tags`) for `/feed`.

## Admin user

1. Create a user under **Authentication → Users** (email + password), or enable email sign-up temporarily.
2. In the SQL editor, set admin role (replace the email):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'you@example.com';
```

3. Sign in at `/admin/login` (hidden route) with username `admin` and password `profeed2024`
   to manage feed posts at `/admin/dashboard` or triage feedback in `/profeed/inbox`.

The JWT `app_metadata.role` must equal `admin` for dashboard access.

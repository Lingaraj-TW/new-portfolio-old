# Supabase migrations

## Apply

1. Open your [Supabase project SQL editor](https://supabase.com/dashboard).
2. Paste and run `001_feedback.sql`.

## Admin user

1. Create a user under **Authentication → Users** (email + password), or enable email sign-up temporarily.
2. In the SQL editor, set admin role (replace the email):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'you@example.com';
```

3. Sign in at `/admin/login` on your deployed or local app.

The JWT `app_metadata.role` must equal `admin` for dashboard access.

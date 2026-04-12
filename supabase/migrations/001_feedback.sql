-- ProDoc: feedback + RLS
-- Run in Supabase SQL Editor or via supabase db push

create extension if not exists "pgcrypto";

do $$ begin
  create type public.feedback_status as enum ('open', 'triaged', 'closed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  section_anchor text,
  body text not null default '',
  rating int,
  status public.feedback_status not null default 'open',
  visitor_session text,
  created_at timestamptz not null default now(),
  constraint feedback_rating_check check (rating is null or rating in (-1, 0, 1))
);

create index if not exists feedback_page_path_idx on public.feedback (page_path);
create index if not exists feedback_status_idx on public.feedback (status);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert_public" on public.feedback;
drop policy if exists "feedback_select_admin" on public.feedback;
drop policy if exists "feedback_update_admin" on public.feedback;

-- Public (anon + authenticated) may insert only new "open" items
create policy "feedback_insert_public"
  on public.feedback
  for insert
  to anon, authenticated
  with check (status = 'open');

-- No broad select for anon/authenticated by default; admins read via JWT claim
create policy "feedback_select_admin"
  on public.feedback
  for select
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

create policy "feedback_update_admin"
  on public.feedback
  for update
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Optional: allow service role full access (bypasses RLS automatically)

comment on table public.feedback is 'Section-level doc feedback; public insert, admin select/update';

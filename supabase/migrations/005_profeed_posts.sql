-- ProFeed public content feed: posts, categories, tags
-- Public read (published posts only); admin writes via JWT role or service role

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_published_idx on public.posts (published) where published = true;
create index if not exists posts_category_id_idx on public.posts (category_id);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;

-- Public read
drop policy if exists "Public read - categories" on public.categories;
create policy "Public read - categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read - tags" on public.tags;
create policy "Public read - tags"
  on public.tags for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read - posts" on public.posts;
create policy "Public read - posts"
  on public.posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public read - post_tags" on public.post_tags;
create policy "Public read - post_tags"
  on public.post_tags for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_tags.post_id and p.published = true
    )
  );

-- Admin write (JWT app_metadata.role = admin)
drop policy if exists "Admin insert - categories" on public.categories;
create policy "Admin insert - categories"
  on public.categories for insert
  to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin update - categories" on public.categories;
create policy "Admin update - categories"
  on public.categories for update
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin delete - categories" on public.categories;
create policy "Admin delete - categories"
  on public.categories for delete
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin insert - tags" on public.tags;
create policy "Admin insert - tags"
  on public.tags for insert
  to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin update - tags" on public.tags;
create policy "Admin update - tags"
  on public.tags for update
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin delete - tags" on public.tags;
create policy "Admin delete - tags"
  on public.tags for delete
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin select all - posts" on public.posts;
create policy "Admin select all - posts"
  on public.posts for select
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin insert - posts" on public.posts;
create policy "Admin insert - posts"
  on public.posts for insert
  to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin update - posts" on public.posts;
create policy "Admin update - posts"
  on public.posts for update
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin delete - posts" on public.posts;
create policy "Admin delete - posts"
  on public.posts for delete
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Admin all - post_tags" on public.post_tags;
create policy "Admin all - post_tags"
  on public.post_tags for all
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

comment on table public.posts is 'ProFeed public portfolio content feed';

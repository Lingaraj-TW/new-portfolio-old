-- ProDoc portfolio: extended feedback, attachments, customer portal reads, storage bucket

alter table public.feedback
  add column if not exists star_rating int,
  add column if not exists tagged_author text,
  add column if not exists tagged_team text,
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists edit_secret uuid default gen_random_uuid() not null;

do $$ begin
  alter table public.feedback drop constraint if exists feedback_star_rating_range;
exception when undefined_object then null; end $$;

alter table public.feedback
  add constraint feedback_star_rating_range
  check (star_rating is null or (star_rating between 1 and 5));

create unique index if not exists feedback_edit_secret_uidx on public.feedback (edit_secret);

create table if not exists public.feedback_attachments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  kind text not null,
  byte_size int not null default 0,
  created_at timestamptz not null default now(),
  constraint feedback_attachments_kind_check check (kind in ('screenshot', 'file'))
);

create index if not exists feedback_attachments_feedback_id_idx
  on public.feedback_attachments (feedback_id);

alter table public.feedback_attachments enable row level security;

drop policy if exists "feedback_attachments_select_admin" on public.feedback_attachments;
create policy "feedback_attachments_select_admin"
  on public.feedback_attachments
  for select
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "feedback_attachments_select_customer" on public.feedback_attachments;
create policy "feedback_attachments_select_customer"
  on public.feedback_attachments
  for select
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'customer');

drop policy if exists "feedback_select_customer" on public.feedback;
create policy "feedback_select_customer"
  on public.feedback
  for select
  to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'customer');

insert into storage.buckets (id, name, public)
values ('feedback-uploads', 'feedback-uploads', false)
on conflict (id) do nothing;

drop policy if exists "storage_feedback_admin_read" on storage.objects;
create policy "storage_feedback_admin_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'feedback-uploads'
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  );

drop policy if exists "storage_feedback_customer_read" on storage.objects;
create policy "storage_feedback_customer_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'feedback-uploads'
    and coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'customer'
  );

comment on column public.feedback.star_rating is '1-5 page quality stars';
comment on column public.feedback.highlights is 'JSON array of text selections or pins from reviewers';
comment on column public.feedback.edit_secret is 'Secret UUID returned once to author for edits; never expose in portal listings';

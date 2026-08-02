-- ProFeed public demo: allow anonymous (anon) read of feedback and attachment rows
-- so the /profeed table can load with the anon key without signing in. Inserts and
-- admin/customer/triage rules stay unchanged. Apply after 001 and 002.

-- Feedback list (read-only) for unauthenticated site visitors
drop policy if exists "feedback_select_anon" on public.feedback;
create policy "feedback_select_anon"
  on public.feedback
  for select
  to anon
  using (true);

-- Attachment metadata joined from feedback list (read-only; download URLs use /api/storage/sign)
drop policy if exists "feedback_attachments_select_anon" on public.feedback_attachments;
create policy "feedback_attachments_select_anon"
  on public.feedback_attachments
  for select
  to anon
  using (true);

comment on table public.feedback is 'Section-level doc feedback; public insert, anon+admin+customer select, admin update';

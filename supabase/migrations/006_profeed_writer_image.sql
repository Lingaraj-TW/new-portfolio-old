-- Optional writer avatar URL for inbox display (per feedback row).
alter table public.feedback
  add column if not exists writer_image text;

comment on column public.feedback.writer_image is 'Optional avatar URL for primary writer in ProFeed inbox UI.';

-- ProFeed rich feedback: multi-tag arrays, voice transcript, optional submitter
-- Backfills from legacy single tagged_author / tagged_team WHERE present.

alter table public.feedback
  add column if not exists tagged_authors text[] not null default '{}'::text[],
  add column if not exists tagged_teams text[] not null default '{}'::text[],
  add column if not exists voice_transcript text,
  add column if not exists submitted_by uuid;

comment on column public.feedback.tagged_authors is 'Multi-select writer tags; legacy tagged_author may mirror the first for compatibility.';
comment on column public.feedback.tagged_teams is 'Multi-select team tags; legacy tagged_team may mirror the first for compatibility.';
comment on column public.feedback.voice_transcript is 'Optional Web Speech API transcript, appended to message in UI.';

-- Backfill arrays from single-value columns
update public.feedback
set
  tagged_authors = case
    when nullif(btrim(tagged_author), '') is not null then array[tagged_author]
    else '{}'::text[]
  end
where coalesce(array_length(tagged_authors, 1), 0) = 0
  and nullif(btrim(tagged_author), '') is not null;

update public.feedback
set
  tagged_teams = case
    when nullif(btrim(tagged_team), '') is not null then array[tagged_team]
    else '{}'::text[]
  end
where coalesce(array_length(tagged_teams, 1), 0) = 0
  and nullif(btrim(tagged_team), '') is not null;

create index if not exists feedback_tagged_authors_gin
  on public.feedback using gin (tagged_authors);
create index if not exists feedback_tagged_teams_gin
  on public.feedback using gin (tagged_teams);

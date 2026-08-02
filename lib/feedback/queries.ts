import type { SupabaseClient } from "@supabase/supabase-js";

import type { FeedbackRowWithAttachments } from "@/lib/types/feedback";

const ATTACHMENTS_FULL =
  "feedback_attachments ( id, file_name, storage_path, kind, mime_type )";

const INBOX_SELECT_RICH = `
  id, page_path, section_anchor, body, rating, star_rating,
  tagged_author, tagged_team, tagged_authors, tagged_teams, voice_transcript, writer_image,
  highlights, status, visitor_session, created_at,
  ${ATTACHMENTS_FULL}
`;

const INBOX_SELECT_BASE = `
  id, page_path, section_anchor, body, rating, star_rating,
  tagged_author, tagged_team,
  highlights, status, visitor_session, created_at,
  ${ATTACHMENTS_FULL}
`;

function isMissingColumnError(message: string): boolean {
  return /column .+ does not exist/i.test(message);
}

export function normalizeFeedbackRow(
  row: Record<string, unknown>,
): FeedbackRowWithAttachments {
  const tagged_author = (row.tagged_author as string | null) ?? null;
  const tagged_team = (row.tagged_team as string | null) ?? null;
  const tagged_authors = row.tagged_authors as string[] | null | undefined;
  const tagged_teams = row.tagged_teams as string[] | null | undefined;

  return {
    ...(row as FeedbackRowWithAttachments),
    tagged_authors:
      tagged_authors && tagged_authors.length
        ? tagged_authors
        : tagged_author
          ? [tagged_author]
          : [],
    tagged_teams:
      tagged_teams && tagged_teams.length
        ? tagged_teams
        : tagged_team
          ? [tagged_team]
          : [],
    voice_transcript: (row.voice_transcript as string | null) ?? null,
  };
}

export async function listFeedbackForInbox(
  supabase: SupabaseClient,
  limit = 200,
): Promise<{ rows: FeedbackRowWithAttachments[]; error: string | null }> {
  const rich = await supabase
    .from("feedback")
    .select(INBOX_SELECT_RICH)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!rich.error) {
    return {
      rows: ((rich.data ?? []) as Record<string, unknown>[]).map(
        normalizeFeedbackRow,
      ),
      error: null,
    };
  }

  if (!isMissingColumnError(rich.error.message)) {
    return { rows: [], error: rich.error.message };
  }

  const base = await supabase
    .from("feedback")
    .select(INBOX_SELECT_BASE)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (base.error) {
    return { rows: [], error: base.error.message };
  }

  return {
    rows: ((base.data ?? []) as Record<string, unknown>[]).map(
      normalizeFeedbackRow,
    ),
    error: null,
  };
}

export async function getFeedbackById(
  supabase: SupabaseClient,
  id: string,
): Promise<{ row: FeedbackRowWithAttachments | null; error: string | null }> {
  const rich = await supabase
    .from("feedback")
    .select(INBOX_SELECT_RICH)
    .eq("id", id)
    .maybeSingle();

  if (!rich.error && rich.data) {
    return {
      row: normalizeFeedbackRow(rich.data as Record<string, unknown>),
      error: null,
    };
  }

  if (rich.error && !isMissingColumnError(rich.error.message)) {
    return { row: null, error: rich.error.message };
  }

  const base = await supabase
    .from("feedback")
    .select(INBOX_SELECT_BASE)
    .eq("id", id)
    .maybeSingle();

  if (base.error) {
    return { row: null, error: base.error.message };
  }

  if (!base.data) {
    return { row: null, error: null };
  }

  return {
    row: normalizeFeedbackRow(base.data as Record<string, unknown>),
    error: null,
  };
}

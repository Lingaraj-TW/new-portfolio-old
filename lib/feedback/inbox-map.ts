import { stripHtmlToText } from "@/lib/profeed/stripHtml";
import type { FeedbackRowWithAttachments } from "@/lib/types/feedback";

import type { InboxRow } from "@/components/profeed/inbox/inbox-types";

function highlightsCount(highlights: unknown): number {
  return Array.isArray(highlights) ? highlights.length : 0;
}

export function mapFeedbackToInboxRow(
  row: FeedbackRowWithAttachments & { writer_image?: string | null },
): InboxRow {
  const authors =
    row.tagged_authors && row.tagged_authors.length
      ? row.tagged_authors
      : row.tagged_author
        ? [row.tagged_author]
        : [];
  const teams =
    row.tagged_teams && row.tagged_teams.length
      ? row.tagged_teams
      : row.tagged_team
        ? [row.tagged_team]
        : [];

  return {
    id: row.id,
    created_at: row.created_at,
    page_path: row.page_path,
    section_anchor: row.section_anchor,
    rating: row.rating,
    star_rating: row.star_rating,
    authors,
    teams,
    writer_image: row.writer_image ?? null,
    highlights_count: highlightsCount(row.highlights),
    message: stripHtmlToText(row.body, 2000),
    voice_transcript: row.voice_transcript ?? null,
    attachments: (row.feedback_attachments ?? []).map((a) => ({
      id: a.id,
      file_name: a.file_name,
      storage_path: a.storage_path,
      kind: a.kind,
      mime_type: a.mime_type ?? null,
    })),
    status: row.status,
  };
}

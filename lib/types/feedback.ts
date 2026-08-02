export type FeedbackStatus = "open" | "triaged" | "closed";

export type HighlightEntry =
  | {
      kind: "text";
      quote: string;
      note?: string;
      /** Heading id when selection maps to a section */
      anchorId?: string;
      startOffset?: number;
      endOffset?: number;
    }
  | {
      kind: "pin";
      xPct: number;
      yPct: number;
      note?: string;
      anchorId?: string;
    };

export type FeedbackRow = {
  id: string;
  page_path: string;
  section_anchor: string | null;
  body: string;
  rating: number | null;
  star_rating: number | null;
  tagged_author: string | null;
  tagged_team: string | null;
  tagged_authors?: string[] | null;
  tagged_teams?: string[] | null;
  voice_transcript?: string | null;
  submitted_by?: string | null;
  highlights: HighlightEntry[] | unknown;
  status: FeedbackStatus;
  visitor_session: string | null;
  edit_secret?: string;
  created_at: string;
};

export type FeedbackAttachmentRow = {
  id: string;
  feedback_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  kind: "screenshot" | "file";
  byte_size: number;
  created_at: string;
};

export type FeedbackRowWithAttachments = FeedbackRow & {
  feedback_attachments?: FeedbackAttachmentRow[] | null;
};

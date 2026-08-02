import type { FeedbackStatus } from "@/lib/types/feedback";

export type InboxAttachment = {
  id: string;
  file_name: string;
  storage_path: string;
  kind: string;
  mime_type: string | null;
};

export type InboxRow = {
  id: string;
  created_at: string;
  page_path: string;
  section_anchor: string | null;
  rating: number | null;
  star_rating: number | null;
  authors: string[];
  teams: string[];
  writer_image: string | null;
  highlights_count: number;
  message: string;
  voice_transcript: string | null;
  attachments: InboxAttachment[];
  status: FeedbackStatus;
};

export function formatHelpfulLabel(rating: number | null): string | null {
  if (rating === 1) return "Helpful";
  if (rating === -1) return "Not helpful";
  if (rating === 0) return "Neutral";
  return null;
}

export function helpfulTone(
  rating: number | null,
): "positive" | "negative" | "neutral" | null {
  if (rating === 1) return "positive";
  if (rating === -1) return "negative";
  if (rating === 0) return "neutral";
  return null;
}

export function pageLeaf(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
] as const;

export function avatarColor(name: string): string {
  return AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

const TEAM_STYLES: Record<string, string> = {
  Docs: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Eng: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Engineering: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Product: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  API: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  PM: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export function teamBadgeClass(name: string): string {
  return (
    TEAM_STYLES[name] ??
    "bg-slate-500/20 text-slate-300 border-slate-500/30"
  );
}

export const STATUS_STYLES: Record<
  FeedbackStatus,
  string
> = {
  open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  triaged: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  closed: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

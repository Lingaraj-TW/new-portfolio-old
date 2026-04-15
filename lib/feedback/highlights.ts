import type { HighlightEntry } from "@/lib/types/feedback";

const MAX_HIGHLIGHTS = 25;
const MAX_QUOTE = 2000;
const MAX_NOTE = 500;

export function parseHighlights(raw: unknown): HighlightEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: HighlightEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    if (rec.kind === "text" && typeof rec.quote === "string") {
      out.push({
        kind: "text",
        quote: rec.quote.slice(0, MAX_QUOTE),
        note:
          typeof rec.note === "string" ? rec.note.slice(0, MAX_NOTE) : undefined,
      });
    }
    if (
      rec.kind === "pin" &&
      typeof rec.xPct === "number" &&
      typeof rec.yPct === "number"
    ) {
      out.push({
        kind: "pin",
        xPct: clampPct(rec.xPct),
        yPct: clampPct(rec.yPct),
        note:
          typeof rec.note === "string" ? rec.note.slice(0, MAX_NOTE) : undefined,
      });
    }
    if (out.length >= MAX_HIGHLIGHTS) break;
  }
  return out;
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function highlightsJsonSizeOk(value: HighlightEntry[]) {
  return JSON.stringify(value).length < 60_000;
}

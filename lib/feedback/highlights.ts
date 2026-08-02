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
          typeof rec.note === "string"
            ? rec.note.slice(0, MAX_NOTE)
            : undefined,
        anchorId:
          typeof rec.anchorId === "string"
            ? rec.anchorId.slice(0, 200)
            : undefined,
        startOffset: numOrUndef(rec.startOffset),
        endOffset: numOrUndef(rec.endOffset),
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
          typeof rec.note === "string"
            ? rec.note.slice(0, MAX_NOTE)
            : undefined,
        anchorId:
          typeof rec.anchorId === "string"
            ? rec.anchorId.slice(0, 200)
            : undefined,
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

function numOrUndef(n: unknown): number | undefined {
  if (typeof n !== "number" || !Number.isFinite(n)) return undefined;
  if (n < 0) return 0;
  if (n > 10_000_000) return 10_000_000;
  return Math.floor(n);
}

export function highlightsJsonSizeOk(value: HighlightEntry[]) {
  return JSON.stringify(value).length < 60_000;
}

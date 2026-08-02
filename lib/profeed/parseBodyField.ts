import {
  plainTextToMessageHtml,
  sanitizeMessageHtml,
} from "./sanitizeMessageHtml";

/**
 * `body` from the client: TipTap HTML when body_format=html, else treated as plain text.
 */
export function parseMessageBody(
  bodyRaw: string,
  bodyFormat: string,
): { body: string; error: string | null } {
  const maxRaw = 64_000;
  const raw = bodyRaw.length > maxRaw ? bodyRaw.slice(0, maxRaw) : bodyRaw;
  if (bodyFormat === "html") {
    const clean = sanitizeMessageHtml(raw);
    return { body: clean, error: null };
  }
  if (bodyFormat === "plain") {
    return { body: plainTextToMessageHtml(raw), error: null };
  }
  return { body: "", error: "Invalid body_format." };
}

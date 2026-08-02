import DOMPurify from "isomorphic-dompurify";

const MAX_HTML = 32_000;

/**
 * Strips/limits HTML for safe storage. Used server-side in POST /api/feedback.
 */
export function sanitizeMessageHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";
  const trimmed =
    dirty.length > MAX_HTML * 2 ? dirty.slice(0, MAX_HTML * 2) : dirty;
  const clean = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "i",
      "u",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "code",
      "pre",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
  return clean.length > MAX_HTML ? clean.slice(0, MAX_HTML) : clean;
}

export function plainTextToMessageHtml(plain: string): string {
  if (!plain || typeof plain !== "string") return "";
  const t = plain.length > 32_000 ? plain.slice(0, 32_000) : plain;
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  if (!t.trim()) return "";
  return `<p>${escape(t).split("\n").join("<br>")}</p>`;
}

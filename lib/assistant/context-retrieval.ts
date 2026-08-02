import "server-only";

import { PRODOC_CONTEXT } from "@/lib/prodocContext";

export type ContextSection = {
  kind: "PAGE" | "CONTENT" | "COMPONENT" | "SUMMARY";
  title: string;
  body: string;
};

const SECTION_HEADER = /^=== (PAGE|CONTENT|COMPONENT|SUMMARY): (.+?) ===$/;

export function parseContextSections(raw: string): ContextSection[] {
  const lines = raw.split("\n");
  const sections: ContextSection[] = [];
  let current: ContextSection | null = null;
  const bodyLines: string[] = [];

  function flush() {
    if (!current) return;
    current.body = bodyLines.join("\n").trim();
    if (current.body) sections.push(current);
    bodyLines.length = 0;
  }

  for (const line of lines) {
    const match = line.match(SECTION_HEADER);
    if (match) {
      flush();
      current = {
        kind: match[1] as ContextSection["kind"],
        title: match[2].trim(),
        body: "",
      };
      continue;
    }
    if (current) bodyLines.push(line);
  }
  flush();
  return sections;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "what",
  "how",
  "tell",
  "me",
  "about",
  "and",
  "or",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "do",
  "does",
  "can",
  "i",
  "you",
  "my",
  "your",
  "this",
  "that",
  "it",
  "be",
  "at",
  "from",
]);

function queryTokens(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreSection(section: ContextSection, tokens: string[]): number {
  if (!tokens.length) return 0;
  const haystack = `${section.title} ${section.body}`.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 1;
    if (section.title.toLowerCase().includes(token)) score += 3;
  }
  // Boost product names
  for (const product of [
    "prodoc",
    "profeed",
    "proinsights",
    "proassist",
    "proapi",
    "prostyle",
    "proreview",
    "proops",
  ]) {
    if (tokens.some((t) => product.includes(t) || t.includes(product.slice(0, 4)))) {
      if (haystack.includes(product)) score += 2;
    }
  }
  return score;
}

export type RetrievedContext = {
  text: string;
  sectionLabels: string[];
};

const MAX_SECTIONS = 5;
const MAX_CHARS = 9_000;

export function retrieveRelevantContext(
  query: string,
  fullContext: string = PRODOC_CONTEXT,
): RetrievedContext {
  const sections = parseContextSections(fullContext);
  const tokens = queryTokens(query);

  const ranked = sections
    .map((section) => ({ section, score: scoreSection(section, tokens) }))
    .sort((a, b) => b.score - a.score);

  const picked: ContextSection[] = [];
  let charCount = 0;

  const platform = sections.find((s) =>
    /platform|ecosystem|overview|home/i.test(s.title),
  );
  if (platform) {
    const excerpt = platform.body.slice(0, 600);
    picked.push({ ...platform, body: excerpt });
    charCount += excerpt.length;
  }

  for (const { section, score } of ranked) {
    if (picked.some((p) => p.title === section.title && p.kind === section.kind)) {
      continue;
    }
    if (score <= 0 && picked.length >= 2) continue;
    if (picked.length >= MAX_SECTIONS) break;
    const remaining = MAX_CHARS - charCount;
    if (remaining < 200) break;
    const body =
      section.body.length > remaining
        ? `${section.body.slice(0, remaining)}…`
        : section.body;
    picked.push({ ...section, body });
    charCount += body.length;
  }

  if (picked.length === 0 && sections.length > 0) {
    const fallback = sections.slice(0, 3);
    for (const section of fallback) {
      picked.push(section);
      charCount += section.body.length;
      if (charCount >= MAX_CHARS) break;
    }
  }

  const sectionLabels = picked.map(
    (s) => `${s.kind === "PAGE" ? "Page" : s.kind === "CONTENT" ? "Content" : s.kind === "COMPONENT" ? "Component" : "Summary"}: ${s.title}`,
  );

  const text = picked
    .map((s) => `=== ${s.kind}: ${s.title} ===\n${s.body}`)
    .join("\n\n");

  return { text, sectionLabels };
}

export function buildProDocSystemPrompt(
  context: string,
  sectionLabels: string[],
): string {
  const sourceHint =
    sectionLabels.length > 0
      ? `\nAvailable source sections for citations:\n${sectionLabels.map((l) => `- ${l}`).join("\n")}`
      : "";

  return `You are ProAssist, the AI documentation assistant for this site. You help users understand ProDoc and its suite of products.
Only answer questions based on the following product documentation provided below.
If the user asks something not covered in this documentation, respond with:
'I can only answer questions about ProDoc and its products. Please check the documentation or contact support.'
Do not make up information. Be concise and helpful.

When you use information from the documentation, end your reply with a short **Sources:** line citing the section names you used (e.g. "Sources: Content: Products Prodoc, Page: Home").

--- DOCUMENTATION ---
${context}${sourceHint}`;
}

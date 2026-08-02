import type { ConversationalResponse } from "./conversational";

function includesAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t));
}

const FACTS: { match: (t: string) => boolean; answer: string }[] = [
  {
    match: (t) => includesAny(t, ["linkedin"]),
    answer:
      "Linga Raj M's LinkedIn profile is https://www.linkedin.com/in/lingarajm/ (display: linkedin.com/in/lingarajm).",
  },
  {
    match: (t) => includesAny(t, ["email", "gmail", "mail address"]),
    answer: "Email: lingaraj.m.tw@gmail.com",
  },
  {
    match: (t) => includesAny(t, ["phone", "call", "mobile number"]),
    answer: "Phone: +91 90038 63614",
  },
  {
    match: (t) => includesAny(t, ["github"]),
    answer: "GitHub: https://github.com/lingaraj-tw/prodoc",
  },
  {
    match: (t) => t.includes("resume") || t.includes("cv"),
    answer:
      "Resume download: /downloads/Linga_Raj_M_Resume.pdf (also linked from the homepage closing section).",
  },
];

/** Best-effort fallback when OpenAI is unavailable — uses facts + retrieved snippets. */
export function answerFromKnowledge(
  userMessage: string,
  base: ConversationalResponse,
): ConversationalResponse {
  const text = userMessage.trim().toLowerCase();

  for (const fact of FACTS) {
    if (fact.match(text)) {
      return {
        reply: fact.answer,
        chips: base.chips,
        command: base.command,
      };
    }
  }

  return base;
}

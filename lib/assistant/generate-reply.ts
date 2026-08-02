import type { ChatTurn } from "./types";

export type { ChatTurn };

export type AssistantReply = {
  reply: string;
  scrollTo?: "experience" | "skills" | "portfolio" | "contact";
};

const SECTION_IDS = ["experience", "skills", "portfolio", "contact"] as const;

function includesAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t));
}

function excerpt(text: string, max = 72) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function wantsNavigation(text: string) {
  return includesAny(text, [
    "show",
    "take me",
    "go to",
    "scroll",
    "open",
    "where is",
    "find",
    "jump",
  ]);
}

export function generateAssistantReply(
  userMessage: string,
  _history: ChatTurn[] = [],
): AssistantReply {
  const raw = userMessage.trim();
  const text = raw.toLowerCase();

  if (!raw) {
    return {
      reply: "Type a question and I'll help — documentation workflows, this site, or how to connect.",
    };
  }

  if (includesAny(text, ["thank", "thanks", "thx", "appreciate"])) {
    return {
      reply: "You're welcome. If anything else comes up about docs or this portfolio, I'm here.",
    };
  }

  if (
    /^(hi|hello|hey|howdy|good (morning|afternoon|evening)|yo)\b/.test(text) ||
    text === "help"
  ) {
    return {
      reply:
        "Hello! Ask me in your own words — for example what Docs-as-Code setup fits your team, where API samples live on this site, or how to reach Linga for a project.",
    };
  }

  if (includesAny(text, ["contact", "email", "phone", "hire", "hiring", "reach", "connect", "role", "job", "contract"])) {
    const nav = wantsNavigation(text) || includesAny(text, ["how do i", "where"]);
    return {
      reply: nav
        ? "Contact details are in the Contact section — email and LinkedIn. Scrolling you there now."
        : "You can reach Linga via the Contact section for documentation strategy, contract technical writing, or full-time roles. Email: lingaraj.m.tw@gmail.com.",
      scrollTo: nav ? "contact" : undefined,
    };
  }

  if (includesAny(text, ["portfolio", "sample", "writing sample", "work sample", "case study", "api guide", "release note"])) {
    const nav = wantsNavigation(text) || text.includes("where");
    return {
      reply: nav
        ? "Portfolio has API guides, release notes, and KB-style pieces — opening that section for you."
        : "The Portfolio section showcases technical writing samples — API documentation, release notes, and knowledge-base style articles. Want me to scroll there?",
      scrollTo: nav ? "portfolio" : undefined,
    };
  }

  if (includesAny(text, ["experience", "career", "background", "resume", "cv", "timeline"])) {
    const nav = wantsNavigation(text);
    return {
      reply: nav
        ? "Experience and credibility highlights are in the Experience section — scrolling there."
        : "The Experience section covers professional background and documentation leadership. Say \"show experience\" if you'd like me to scroll there.",
      scrollTo: nav ? "experience" : undefined,
    };
  }

  if (includesAny(text, ["skill", "tech stack", "tool", "stack"])) {
    const nav = wantsNavigation(text);
    return {
      reply: nav
        ? "Skills and tools are listed in the Skills section — taking you there."
        : "Skills covers doc tools, formats, and platforms Linga works with. Ask me to \"show skills\" to jump to that section.",
      scrollTo: nav ? "skills" : undefined,
    };
  }

  if (includesAny(text, ["prodoc", "flagship", "demo", "ecosystem", "profeed", "proinsights"])) {
    return {
      reply:
        "ProDoc on this page is a flagship docs-as-product concept demo — structured docs, reader feedback (ProFeed), and insights (ProInsights) in one ecosystem. Scroll up to the ProDoc hero and ecosystem diagram for the full picture.",
    };
  }

  if (includesAny(text, ["docs-as-code", "docs as code", "mdx", "gitbook", "docusaurus", "mkdocs", "version control", "markdown repo"])) {
    return {
      reply: `For Docs-as-Code, versioning docs with your codebase keeps reviews and releases aligned. MDX, CI previews, and clear folder IA matter. Regarding "${excerpt(raw)}": start with one golden path doc, then expand templates and ownership — happy to go deeper if you share your stack.`,
    };
  }

  if (includesAny(text, ["api doc", "openapi", "swagger", "rest api", "graphql", "endpoint", "reference"])) {
    return {
      reply: `Strong API docs pair reference with task-based guides: auth, errors, rate limits, and copy-paste examples. On your question — "${excerpt(raw)}" — check the Portfolio section for API guide samples, or describe your API surface and I can suggest an outline.`,
      scrollTo: text.includes("sample") || text.includes("example") ? "portfolio" : undefined,
    };
  }

  if (includesAny(text, ["ai ", " artificial intelligence", "automation", "llm", "gpt", "copilot", "generate"])) {
    return {
      reply: `AI helps with drafts, consistency, and refresh cycles — but accuracy, tone, and IA still need human ownership. For "${excerpt(raw)}", define what must be human-reviewed vs automated, then pilot on one doc set before scaling.`,
    };
  }

  if (includesAny(text, ["architecture", "information architecture", " ia ", "scalable", "structure", "taxonomy", "single source"])) {
    return {
      reply: `Scalable doc architecture needs clear IA, reusable components, ownership, and findability metrics. Thinking about "${excerpt(raw)}": map audiences and journeys first, then align nav and content types to those paths.`,
    };
  }

  if (includesAny(text, ["product doc", "user guide", "onboarding doc", "help center", "knowledge base", "kb "])) {
    return {
      reply: `Product documentation should follow real user journeys — setup, core workflows, troubleshooting. For "${excerpt(raw)}", prioritize tasks over feature lists and keep terminology consistent with the product UI.`,
    };
  }

  if (includesAny(text, ["price", "rate", "cost", "budget", "quote"])) {
    return {
      reply: "For rates and engagement models, the best next step is a direct conversation — use the Contact section with a short note on scope and timeline.",
      scrollTo: wantsNavigation(text) ? "contact" : undefined,
    };
  }

  for (const id of SECTION_IDS) {
    if (text.includes(id) && wantsNavigation(text)) {
      return {
        reply: `Scrolling to ${id.charAt(0).toUpperCase()}${id.slice(1)}.`,
        scrollTo: id,
      };
    }
  }

  if (text.endsWith("?")) {
    return {
      reply: `On "${excerpt(raw)}": this site is built around documentation strategy, Docs-as-Code, API docs, and DX. If you tell me whether you're planning, building, or hiring, I can point you to ProDoc on the page, Portfolio samples, or Contact.`,
    };
  }

  return {
    reply: `I hear you on "${excerpt(raw)}". Linga's focus here is documentation infrastructure — strategy, Docs-as-Code, API docs, and scalable IA. What would help most: navigating the site, a workflow tip, or how to get in touch?`,
  };
}

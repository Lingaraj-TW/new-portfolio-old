import { INITIAL_CHIPS, chipsAfterCommand, getCommandLabel } from "./commands";
import type { AssistantChip, AssistantCommandId, ChatTurn } from "./types";

export type ConversationalResponse = {
  reply: string;
  chips: AssistantChip[];
  command?: AssistantCommandId;
};

function includesAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t));
}

function suggestChips(...ids: AssistantCommandId[]): AssistantChip[] {
  const seen = new Set<string>();
  const out: AssistantChip[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const chip =
      INITIAL_CHIPS.find((c) => c.id === id) ??
      chipsAfterCommand(id).find((c) => c.id === id) ?? {
        id,
        label: getCommandLabel(id),
      };
    out.push(chip);
  }
  return out.slice(0, 4);
}

export function generateConversationalResponse(
  userMessage: string,
  _history: ChatTurn[] = [],
): ConversationalResponse {
  const text = userMessage.trim().toLowerCase();
  const raw = userMessage.trim();

  if (!raw) {
    return {
      reply: "Ask me about documentation, this portfolio, or where to go on the site.",
      chips: INITIAL_CHIPS.slice(0, 4),
    };
  }

  if (includesAny(text, ["thank", "thanks", "thx"])) {
    return {
      reply: "Happy to help. Anything else on docs or this site?",
      chips: INITIAL_CHIPS.slice(0, 3),
    };
  }

  if (/^(hi|hello|hey|howdy|good (morning|afternoon|evening))\b/.test(text) || text === "help") {
    return {
      reply:
        "Hi! I can answer documentation questions and jump you to sections. What are you exploring?",
      chips: INITIAL_CHIPS.slice(0, 4),
    };
  }

  if (includesAny(text, ["who is", "who's", "about linga", "about the author", "who built"])) {
    return {
      reply:
        "Linga Raj M is a Senior Technical Writer and Documentation Architect. This site showcases docs-as-product thinking, writing samples, and the ProDoc ecosystem concept.",
      chips: suggestChips("view-experience", "view-portfolio", "contact"),
      command: text.includes("where") ? "view-experience" : undefined,
    };
  }

  if (includesAny(text, ["linkedin"])) {
    return {
      reply:
        "LinkedIn: https://www.linkedin.com/in/lingarajm/ (linkedin.com/in/lingarajm).",
      chips: suggestChips("contact", "view-portfolio", "view-experience"),
      command: includesAny(text, ["where", "find", "go", "open"]) ? "contact" : undefined,
    };
  }

  if (includesAny(text, ["github"])) {
    return {
      reply: "GitHub: https://github.com/lingaraj-tw/prodoc",
      chips: suggestChips("explore-prodoc", "view-portfolio", "contact"),
    };
  }

  if (includesAny(text, ["contact", "email", "phone", "hire", "hiring", "reach", "contract", "full-time"])) {
    return {
      reply:
        "Email: lingaraj.m.tw@gmail.com · Phone: +91 90038 63614 · LinkedIn: https://www.linkedin.com/in/lingarajm/",
      chips: suggestChips("contact", "view-portfolio", "view-experience"),
      command: includesAny(text, ["where", "find", "go"]) ? "contact" : undefined,
    };
  }

  if (includesAny(text, ["profeed", "pro feed", "feedback"])) {
    return {
      reply:
        "ProFeed is the reader-feedback layer in the ecosystem — triage, tags, and attachments tied to docs. On the homepage it's in the portfolio cards; live feedback widgets appear on doc pages.",
      chips: suggestChips("go-profeed", "explore-prodoc", "ai-workflows"),
      command: includesAny(text, ["where", "see", "show", "go"]) ? "go-profeed" : undefined,
    };
  }

  if (includesAny(text, ["proinsights", "analytics", "insights"])) {
    return {
      reply:
        "ProInsights covers doc analytics — trends, ratings, and hotspots so teams know what to improve. It's part of the ecosystem diagram on the homepage.",
      chips: suggestChips("ai-workflows", "explore-prodoc", "open-products"),
      command: includesAny(text, ["where", "see", "show"]) ? "doc-architecture" : undefined,
    };
  }

  if (includesAny(text, ["prodoc", "flagship", "ecosystem"])) {
    return {
      reply:
        "ProDoc is the docs-as-product hub — MDX guides, API references, and embedded feedback. The homepage demo shows how ProDoc, ProFeed, and ProInsights connect.",
      chips: suggestChips("explore-prodoc", "doc-architecture", "go-profeed"),
      command: includesAny(text, ["where", "see", "demo", "show"]) ? "explore-prodoc" : undefined,
    };
  }

  if (includesAny(text, ["docs-as-code", "docs as code", "mdx", "docusaurus", "mkdocs"])) {
    return {
      reply:
        "Docs-as-Code keeps docs in Git with your app — review in PRs, publish via CI, use MDX for reusable components. Start with one golden-path guide, then templates and ownership rules.",
      chips: suggestChips("docs-as-code", "show-api-docs", "explore-prodoc"),
      command: includesAny(text, ["where", "see", "show"]) ? "docs-as-code" : undefined,
    };
  }

  if (includesAny(text, ["api doc", "openapi", "swagger", "rest api", "graphql", "endpoint"])) {
    return {
      reply:
        "Strong API docs mix reference with task guides: auth, errors, examples, and rate limits. This portfolio includes API guide samples in the Portfolio section.",
      chips: suggestChips("show-api-docs", "docs-as-code", "view-portfolio"),
      command: includesAny(text, ["where", "sample", "see", "show"]) ? "show-api-docs" : undefined,
    };
  }

  if (includesAny(text, ["ai ", "automation", "llm", "gpt", "copilot", "machine learning"])) {
    return {
      reply:
        "AI speeds drafts and consistency checks — humans still own accuracy, tone, and IA. Pilot on one doc set with clear review gates before scaling automation.",
      chips: suggestChips("ai-workflows", "explore-prodoc", "doc-architecture"),
      command: includesAny(text, ["where", "see", "workflow"]) ? "ai-workflows" : undefined,
    };
  }

  if (includesAny(text, ["architecture", "information architecture", " ia ", "taxonomy", "scalable"])) {
    return {
      reply:
        "Doc architecture = audience journeys + IA + reusable components + ownership. Map top tasks first, then nav, content types, and findability metrics.",
      chips: suggestChips("doc-architecture", "docs-as-code", "explore-prodoc"),
      command: includesAny(text, ["where", "see", "show"]) ? "doc-architecture" : undefined,
    };
  }

  if (includesAny(text, ["experience", "career", "resume", "background"])) {
    return {
      reply:
        "The Experience section covers documentation leadership, domains worked in, and credibility highlights.",
      chips: suggestChips("view-experience", "view-portfolio", "contact"),
      command: includesAny(text, ["where", "see", "show"]) ? "view-experience" : undefined,
    };
  }

  if (includesAny(text, ["skill", "tech stack", "tool", "platform"])) {
    return {
      reply:
        "Skills lists doc platforms, formats, AI tools, and delivery workflows Linga uses day to day.",
      chips: suggestChips("view-skills", "docs-as-code", "view-portfolio"),
      command: includesAny(text, ["where", "see", "show"]) ? "view-skills" : undefined,
    };
  }

  if (includesAny(text, ["portfolio", "sample", "writing", "case study", "release note"])) {
    return {
      reply:
        "Portfolio has API guides, release notes, and KB-style samples — good references for structure and tone.",
      chips: suggestChips("view-portfolio", "show-api-docs", "contact"),
      command: includesAny(text, ["where", "see", "show"]) ? "view-portfolio" : undefined,
    };
  }

  if (includesAny(text, ["product doc", "user guide", "help center", "knowledge base", "onboarding"])) {
    return {
      reply:
        "Product docs should follow real user tasks — setup, core flows, troubleshooting — not just feature lists. Keep terms aligned with the UI.",
      chips: suggestChips("explore-prodoc", "doc-architecture", "show-api-docs"),
    };
  }

  if (includesAny(text, ["price", "rate", "budget", "quote", "cost"])) {
    return {
      reply: "For scope and rates, the best step is a quick note via Contact with timeline and doc needs.",
      chips: suggestChips("contact", "view-portfolio"),
      command: "contact",
    };
  }

  if (text.endsWith("?")) {
    return {
      reply:
        "Good question. I focus on documentation strategy, Docs-as-Code, API docs, and DX on this site. Tell me if you want a workflow tip or a tour of a section.",
      chips: INITIAL_CHIPS.slice(0, 4),
    };
  }

  return {
    reply:
      "I can explain documentation approaches here, or guide you to ProDoc, Portfolio, and Contact. What would you like to dig into?",
    chips: INITIAL_CHIPS.slice(0, 4),
  };
}

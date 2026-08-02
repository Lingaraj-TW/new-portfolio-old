import type { AssistantChip, AssistantCommandId, CommandResult } from "./types";

export const assistantMeta = {
  title: "ProAssist",
  subtitle: "Navigate & explore",
  greeting: "I can guide you through the platform.",
  prompt: "What would you like to explore?",
  inputPlaceholder: "Ask or choose an action…",
} as const;

export const INITIAL_CHIPS: AssistantChip[] = [
  { id: "explore-prodoc", label: "Explore ProDoc" },
  { id: "show-api-docs", label: "Show API Docs" },
  { id: "view-experience", label: "View Experience" },
  { id: "open-products", label: "Open Products" },
  { id: "ai-workflows", label: "See AI Workflows" },
  { id: "contact", label: "Contact Me" },
  { id: "doc-architecture", label: "Doc Architecture" },
  { id: "docs-as-code", label: "Docs-as-Code" },
];

const FOLLOW_UP: Partial<Record<AssistantCommandId, AssistantChip[]>> = {
  "explore-prodoc": [
    { id: "go-profeed", label: "Go to ProFeed" },
    { id: "open-products", label: "Open Products" },
    { id: "show-api-docs", label: "API samples" },
    { id: "contact", label: "Contact" },
  ],
  "go-profeed": [
    { id: "explore-prodoc", label: "ProDoc demo" },
    { id: "ai-workflows", label: "AI workflows" },
    { id: "open-products", label: "Products" },
  ],
  "show-api-docs": [
    { id: "view-portfolio", label: "Full portfolio" },
    { id: "docs-as-code", label: "Docs-as-Code" },
    { id: "contact", label: "Contact" },
  ],
  "view-experience": [
    { id: "view-skills", label: "Skills" },
    { id: "view-portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ],
  "open-products": [
    { id: "explore-prodoc", label: "ProDoc demo" },
    { id: "go-profeed", label: "ProFeed" },
    { id: "ai-workflows", label: "Ecosystem" },
  ],
  "ai-workflows": [
    { id: "explore-prodoc", label: "ProDoc demo" },
    { id: "doc-architecture", label: "Architecture" },
    { id: "go-profeed", label: "ProFeed" },
  ],
  contact: [
    { id: "view-experience", label: "Experience" },
    { id: "view-portfolio", label: "Portfolio" },
    { id: "explore-prodoc", label: "ProDoc" },
  ],
  "doc-architecture": [
    { id: "docs-as-code", label: "Docs-as-Code" },
    { id: "explore-prodoc", label: "ProDoc" },
    { id: "ai-workflows", label: "AI workflows" },
  ],
  "docs-as-code": [
    { id: "show-api-docs", label: "API docs" },
    { id: "view-skills", label: "Skills" },
    { id: "explore-prodoc", label: "ProDoc" },
  ],
  "view-skills": [
    { id: "docs-as-code", label: "Docs-as-Code" },
    { id: "view-portfolio", label: "Portfolio" },
  ],
  "view-portfolio": [
    { id: "show-api-docs", label: "API samples" },
    { id: "go-profeed", label: "ProFeed" },
    { id: "contact", label: "Contact" },
  ],
};

export const CHIP_GEMINI_MESSAGES: Partial<Record<AssistantCommandId, string>> = {
  "explore-prodoc": "Tell me about the ProDoc concept",
  "show-api-docs": "Explain the API documentation section",
  "view-experience": "Summarize Linga Raj's work experience",
  "open-products": "What products are showcased here?",
  "ai-workflows": "Explain the AI workflow section",
  contact: "How can I contact Linga Raj or check availability?",
  "doc-architecture": "Explain the documentation architecture",
  "docs-as-code": "What is the Docs-as-Code approach used here?",
  "go-profeed": "Tell me about the ProFeed product",
  "view-skills": "What skills and tools does Linga Raj use?",
  "view-portfolio": "Give me an overview of the portfolio",
};

export const commandReplies: Record<AssistantCommandId, string> = {
  "explore-prodoc": "Taking you to the ProDoc demo.",
  "show-api-docs": "Opening API documentation samples.",
  "view-experience": "Scrolling to Experience.",
  "open-products": "Opening the Products menu.",
  "ai-workflows": "Showing the documentation workflow map.",
  contact: "Heading to Contact.",
  "doc-architecture": "Opening the ecosystem architecture view.",
  "docs-as-code": "Jumping to skills & Docs-as-Code tooling.",
  "go-profeed": "Highlighting ProFeed in the portfolio.",
  "view-skills": "Opening Skills & tech stack.",
  "view-portfolio": "Opening the portfolio section.",
};

export function chipsAfterCommand(
  commandId: AssistantCommandId,
): AssistantChip[] {
  return FOLLOW_UP[commandId] ?? INITIAL_CHIPS.slice(0, 4);
}

export function buildCommandResult(commandId: AssistantCommandId): CommandResult {
  return {
    reply: commandReplies[commandId],
    chips: chipsAfterCommand(commandId),
  };
}

export function getCommandLabel(commandId: AssistantCommandId): string {
  const direct = INITIAL_CHIPS.find((c) => c.id === commandId);
  if (direct) return direct.label;
  for (const list of Object.values(FOLLOW_UP)) {
    const found = list?.find((c) => c.id === commandId);
    if (found) return found.label;
  }
  return commandId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** In-chat deep links — user taps to navigate; assistant never auto-redirects. */
export const COMMAND_ACTION_LINKS: Record<
  AssistantCommandId,
  { href: string; label: string }
> = {
  "explore-prodoc": { href: "/products/prodoc", label: "Go to ProDoc" },
  "show-api-docs": { href: "/proapi/api-reference", label: "Go to API Docs" },
  "view-experience": { href: "/experience", label: "Go to Experience" },
  "open-products": { href: "/products", label: "Go to Products" },
  "ai-workflows": { href: "/platform", label: "Go to Platform" },
  contact: { href: "/contact", label: "Go to Contact" },
  "doc-architecture": { href: "/platform", label: "Go to Platform" },
  "docs-as-code": { href: "/skills", label: "Go to Skills" },
  "go-profeed": { href: "/products/profeed", label: "Go to ProFeed" },
  "view-skills": { href: "/skills", label: "Go to Skills" },
  "view-portfolio": { href: "/products", label: "Go to Products" },
};

export function getCommandActionLink(
  commandId: AssistantCommandId | null | undefined,
): { href: string; label: string } | undefined {
  if (!commandId) return undefined;
  return COMMAND_ACTION_LINKS[commandId];
}

export type AssistantCommandId =
  | "explore-prodoc"
  | "show-api-docs"
  | "view-experience"
  | "open-products"
  | "ai-workflows"
  | "contact"
  | "doc-architecture"
  | "docs-as-code"
  | "go-profeed"
  | "view-skills"
  | "view-portfolio";

export type AssistantChip = {
  id: AssistantCommandId;
  label: string;
};

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  chips?: AssistantChip[];
  /** Optional deep-link shown after an assistant answer (no auto-navigation). */
  actionLink?: { href: string; label: string };
  /** Set when the user picked a quick-action chip. */
  chipCommandId?: AssistantCommandId;
};

export type CommandResult = {
  reply: string;
  chips: AssistantChip[];
};

import { INITIAL_CHIPS, getCommandLabel } from "./commands";
import type { AssistantCommandId } from "./types";

function includesAny(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t));
}

const NAVIGATION_CUES = [
  "go to",
  "take me",
  "show me",
  "show ",
  "open ",
  "view ",
  "see ",
  "jump to",
  "scroll to",
  "navigate",
  "bring me",
  "where is",
  "where can i find",
  "where do i find",
];

const INTENT_RULES: { id: AssistantCommandId; match: (t: string) => boolean }[] = [
  {
    id: "open-products",
    match: (t) =>
      includesAny(t, [
        "products menu",
        "product menu",
        "products dropdown",
        "open products",
        "view products",
      ]),
  },
  {
    id: "go-profeed",
    match: (t) => includesAny(t, ["profeed", "pro feed"]),
  },
  {
    id: "explore-prodoc",
    match: (t) =>
      includesAny(t, ["explore prodoc", "prodoc demo", "concept demo", "go to prodoc"]),
  },
  {
    id: "show-api-docs",
    match: (t) =>
      includesAny(t, ["api doc", "api guide", "api sample", "show api", "openapi"]),
  },
  {
    id: "view-experience",
    match: (t) =>
      includesAny(t, ["experience section", "view experience", "show experience", "my experience"]),
  },
  {
    id: "view-skills",
    match: (t) => includesAny(t, ["skills section", "view skills", "show skills", "tech stack section"]),
  },
  {
    id: "view-portfolio",
    match: (t) =>
      includesAny(t, ["portfolio section", "view portfolio", "show portfolio", "writing samples"]),
  },
  {
    id: "contact",
    match: (t) =>
      includesAny(t, ["contact section", "contact me", "go to contact", "show contact"]),
  },
  {
    id: "ai-workflows",
    match: (t) => includesAny(t, ["ai workflow", "see ai", "show ai workflow", "ai workflows"]),
  },
  {
    id: "doc-architecture",
    match: (t) =>
      includesAny(t, ["doc architecture", "documentation architecture", "show architecture", "ecosystem map"]),
  },
  {
    id: "docs-as-code",
    match: (t) => includesAny(t, ["docs-as-code", "docs as code setup", "show docs-as-code"]),
  },
];

function matchesNavigationCue(text: string) {
  return NAVIGATION_CUES.some((cue) => text.includes(cue));
}

function matchesChipLabel(text: string): AssistantCommandId | null {
  for (const chip of INITIAL_CHIPS) {
    if (text === chip.label.toLowerCase()) return chip.id;
  }
  for (const id of [
    "explore-prodoc",
    "show-api-docs",
    "view-experience",
    "open-products",
    "ai-workflows",
    "contact",
    "doc-architecture",
    "docs-as-code",
    "go-profeed",
    "view-skills",
    "view-portfolio",
  ] as AssistantCommandId[]) {
    if (text === getCommandLabel(id).toLowerCase()) return id;
  }
  return null;
}

/** Only explicit navigation requests — not general questions mentioning a topic. */
export function resolveNavigationIntent(input: string): AssistantCommandId | null {
  const text = input.trim().toLowerCase();
  if (!text) return null;

  const chip = matchesChipLabel(text);
  if (chip) return chip;

  if (!matchesNavigationCue(text)) return null;

  for (const rule of INTENT_RULES) {
    if (rule.match(text)) return rule.id;
  }

  return null;
}

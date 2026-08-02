import type { ProductPageContent } from "./types";

export const proassistContent: ProductPageContent = {
  slug: "proassist",
  metadata: {
    title: "ProAssist — AI-powered documentation assistant",
    description:
      "Ask AI, get citation-based answers, related articles, and smart search from your documentation.",
  },
  hero: {
    title: "ProAssist",
    tagline: "AI-powered documentation assistant.",
    problem:
      "Readers bounce when search fails and support picks up the slack. ProAssist turns your documentation into an instant answer layer — citation-based responses, related articles, and follow-up suggestions with a modern SaaS chat experience.",
  },
  features: [
    {
      title: "Ask AI",
      body: "Natural-language questions answered from your indexed documentation — not generic LLM filler.",
    },
    {
      title: "Citation-based answers",
      body: "Every response links to source pages and sections so users verify and engineers trust the output.",
    },
    {
      title: "Related article recommendations",
      body: "Surface the next best read based on intent — onboarding paths, API guides, and troubleshooting flows.",
    },
    {
      title: "Content summarization",
      body: "Long guides condensed into scannable answers while preserving links back to full context.",
    },
    {
      title: "Missing content suggestions",
      body: "Gap detection from unanswered queries — prioritize new docs where search and AI both fail.",
    },
    {
      title: "Smart search experience",
      body: "Hybrid retrieval blends keyword search with semantic matching for faster discovery.",
    },
  ],
  metrics: [
    { label: "Answer resolution rate", value: "78%", hint: "Without support ticket" },
    { label: "Median time to answer", value: "4s", hint: "Indexed corpus" },
    { label: "Citations per response", value: "2.1 avg", hint: "Source-backed" },
    { label: "Follow-up engagement", value: "+34%", hint: "Suggested questions" },
  ],
  builtForTags: [
    "Self-service support",
    "Developer onboarding",
    "Enterprise knowledge bases",
    "Product-led growth teams",
  ],
  liveDemo: {
    label: "Try ProAssist on this site",
    href: "#",
  },
};

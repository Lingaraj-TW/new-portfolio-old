import type { ProductPageContent } from "./types";

export const proapiContent: ProductPageContent = {
  slug: "proapi",
  metadata: {
    title: "ProAPI — Developer portal and API documentation",
    description:
      "API reference, OpenAPI support, SDK examples, and interactive requests for developer experience.",
  },
  hero: {
    title: "ProAPI",
    tagline: "Developer portal and API documentation.",
    problem:
      "Developers expect Stripe-quality API docs — fast navigation, copy-ready snippets, and try-it examples. ProAPI showcases developer documentation expertise with OpenAPI-backed references, authentication guides, and an API explorer built for adoption.",
  },
  features: [
    {
      title: "API reference",
      body: "Operations, schemas, and examples organized for IDE deep links, CI logs, and support threads.",
    },
    {
      title: "OpenAPI support",
      body: "Spec-driven pages stay in sync with product releases — no hand-maintained endpoint tables.",
    },
    {
      title: "SDK examples",
      body: "Multi-language snippets with copy buttons and version-aware samples for every integration path.",
    },
    {
      title: "Interactive requests",
      body: "Try-it console with auth scaffolding so developers validate calls before writing production code.",
    },
    {
      title: "Authentication guides",
      body: "OAuth, API keys, and scoped tokens explained with procedural walkthroughs and error catalogs.",
    },
    {
      title: "API explorer",
      body: "Browse, filter, and execute endpoints from one surface — the DX layer engineering teams expect.",
    },
  ],
  metrics: [
    { label: "Time to first request", value: "< 12 min", hint: "Onboarding target" },
    { label: "Snippet copy rate", value: "64%", hint: "Per session" },
    { label: "API doc satisfaction", value: "4.6★", hint: "Developer survey" },
    { label: "Integration errors", value: "−28%", hint: "After explorer launch" },
  ],
  builtForTags: [
    "API-first SaaS",
    "Platform engineering",
    "Developer relations",
    "Partner integrations",
  ],
  liveDemo: {
    label: "Browse API documentation",
    href: "/proapi",
  },
};

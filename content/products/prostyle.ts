import type { ProductPageContent } from "./types";

export const prostyleContent: ProductPageContent = {
  slug: "prostyle",
  metadata: {
    title: "ProStyle — Voice, style & terminology governance",
    description:
      "Voice, terminology, and lint concept for documentation at scale.",
  },
  hero: {
    title: "ProStyle",
    tagline: "One voice across every doc—enforced where writers work.",
    problem:
      "Fast teams ship inconsistent terminology, tone drift between squads, and reviewers burn time on the same nits. ProStyle (concept) is a guardrail layer: glossaries, lint rules, and profiles that travel with ProDoc content from draft to production.",
  },
  features: [
    {
      title: "Voice & tone profiles",
      body: "Per-product voices (e.g., “concise / confident” vs “warm / onboarding”) applied consistently across thousands of MDX pages.",
    },
    {
      title: "Terminology glossary",
      body: "Canonical terms, banned synonyms, and enforced casing—so “workspace” doesn’t become “account” mid-journey.",
    },
    {
      title: "CI prose lint",
      body: "Passive voice, reading level, and inclusive language checks run in PR—writers fix before merge, not after launch.",
    },
    {
      title: "Snippet library",
      body: "Approved callouts, legal disclaimers, and beta banners pulled from tokens so updates propagate everywhere.",
    },
    {
      title: "Style diffs in review",
      body: "ProReview (concept) surfaces violations inline so editors don’t trade Google Doc comments for Git.",
    },
    {
      title: "Brand + a11y pairing",
      body: "Contrast checks on diagrams and CTA text alongside voice rules—style isn’t just wording.",
    },
  ],
  metrics: [
    { label: "Lint findings caught in CI", value: "860/mo", hint: "Concept volume" },
    { label: "Terminology drift", value: "−58%", hint: "After glossary rollout" },
    { label: "Review cycles", value: "−1.2", hint: "Avg per PR" },
    { label: "Voice compliance", value: "94%", hint: "Pages passing profile" },
  ],
  builtForTags: [
    "Multi-brand SaaS",
    "Big doc sets (1000+ pages)",
    "Regulated terminology",
    "Global teams + localization handoff",
  ],
};

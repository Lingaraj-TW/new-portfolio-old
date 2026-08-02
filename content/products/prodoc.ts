import type { ProductPageContent } from "./types";

export const prodocContent: ProductPageContent = {
  slug: "prodoc",
  metadata: {
    title: "ProDoc — Modern docs-as-code platform",
    description:
      "Documentation hub for product and developer docs — MDX guides, API references, search, and feedback hooks.",
  },
  hero: {
    title: "ProDoc",
    tagline: "Modern docs-as-code platform for product and developer documentation.",
    problem:
      "Product teams need documentation that ships with releases, stays findable, and improves from reader signals — not a wiki that drifts out of date. ProDoc is the authoring hub: versioned MDX, structured IA, search, and hooks into feedback and analytics.",
  },
  features: [
    {
      title: "Versioned documentation",
      body: "Doc sets track product releases — readers always know what changed and whether their integration still applies.",
    },
    {
      title: "MDX + compile pipeline",
      body: "Portable MDX with GFM, slugged headings, and a server compile path so writers ship the same source to preview and production.",
    },
    {
      title: "Search & categories",
      body: "Diátaxis-friendly IA — tutorials, guides, reference, and explanation routes that mirror how engineers actually search.",
    },
    {
      title: "Feedback widget",
      body: "Stars, helpful votes, and anchored notes route into triage — product signals show up next to the paragraph they reference.",
    },
    {
      title: "Content health indicators",
      body: "Stale pages, broken links, and low engagement surfaces so teams prioritize rewrites before support tickets spike.",
    },
    {
      title: "Insights handoff",
      body: "Exports and views feed ProInsights so prioritization is evidence-led, not loudest-voice-led.",
    },
  ],
  governanceFeatures: [
    {
      title: "Voice & terminology",
      body: "Glossaries, tone profiles, and canonical terms enforced in CI — one voice across every doc at scale.",
    },
    {
      title: "Editorial review",
      body: "Structured checklists, MDX-aware diffs, and SME routing so every merge raises accuracy and compliance.",
    },
    {
      title: "Docs-as-Code operations",
      body: "Lint → build → preview → promotion pipelines with merge gates, release trains, and observability.",
    },
    {
      title: "Prose lint in CI",
      body: "Passive voice, reading level, and inclusive language checks run in PR — writers fix before merge.",
    },
    {
      title: "Merge gates & approvals",
      body: "Require review sign-off and green lint before promoting versioned doc sets to production.",
    },
    {
      title: "Cross-product hooks",
      body: "Webhooks to ProFeed, exporters to ProInsights, and automation that keeps the ecosystem aligned.",
    },
  ],
  metrics: [
    { label: "API & developer docs", value: "OpenAPI", hint: "Cognizant QNXT" },
    { label: "KB built from scratch", value: "Document360", hint: "EvoSuite" },
    { label: "Localization programs", value: "DE · ES", hint: "Evora" },
    { label: "Structured authoring", value: "XML/DITA", hint: "CADES" },
  ],
  builtForTags: [
    "Product-led SaaS",
    "Platform & API teams",
    "Healthcare & regulated releases",
    "Mobile + web multi-surface products",
  ],
  flowStepsHeading: "How it runs",
  flowSteps: [
    {
      title: "Author in Git",
      body: "Writers branch, review, and merge — Docs-as-Code with the same rigor as product code.",
    },
    {
      title: "Publish pipeline",
      body: "CI validates links, builds MDX, and promotes versioned doc sets on green builds.",
    },
    {
      title: "Measure & tighten",
      body: "Feedback and analytics close the loop so the next sprint targets real friction.",
    },
  ],
  liveDemo: {
    label: "Live ProDoc docs",
    href: "__PRODOC_ENTRY__",
  },
};

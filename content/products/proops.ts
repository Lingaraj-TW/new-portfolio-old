import type { ProductPageContent } from "./types";

export const proopsContent: ProductPageContent = {
  slug: "proops",
  metadata: {
    title: "ProOps — Documentation operations & release orchestration",
    description:
      "Docs-as-Code operations concept — CI, previews, releases, and ecosystem orchestration.",
  },
  hero: {
    title: "ProOps",
    tagline: "Operate documentation like critical infrastructure—because it is.",
    problem:
      "Docs break when pipelines are an afterthought: stale previews, untraced failures, and releases that diverge from the product. ProOps (concept) is the control plane for the whole ecosystem—pipelines, gates, and signals that keep ProDoc, ProStyle, ProReview, ProFeed, and ProInsights aligned.",
  },
  features: [
    {
      title: "Pipeline canvas",
      body: "Lint → build → link check → preview deploy → promotion—visual DAG so writers see blockers, not mystery failures.",
    },
    {
      title: "Environment parity",
      body: "Staging previews mirror production IA, search config, and feature flags so reviews match what readers get.",
    },
    {
      title: "Release trains",
      body: "Cut versioned doc sets alongside product semver; rollback is one promotion revert, not a restore ticket.",
    },
    {
      title: "Secrets & config",
      body: "Masked env for preview bots, indexed-or-not controls, and branch policies tuned for docs repos.",
    },
    {
      title: "Cross-product hooks",
      body: "Fan-out to ProFeed webhooks, ProInsights exporters, and ProReview gates—operations as orchestration, not silos.",
    },
    {
      title: "Observability",
      body: "Build durations, flake rate, and deploy health on a single board—treat broken pipelines as product incidents.",
    },
  ],
  metrics: [
    { label: "Pipeline success rate", value: "99.2%", hint: "30d" },
    { label: "Mean time to preview", value: "4m 12s", hint: "PR open → link" },
    { label: "Rollback events", value: "0", hint: "Current train" },
    { label: "Cost / million builds", value: "↓ 18%", hint: "After cache tier" },
  ],
  builtForTags: [
    "Platform engineering",
    "Docs platform teams",
    "GitHub/GitLab mono-org setups",
    "Compliance-heavy change control",
  ],
};

export const proopsPipelineRows = [
  { step: "prostyle/lint", state: "passed", t: "42s" },
  { step: "mdx/build", state: "passed", t: "2m 10s" },
  { step: "link-check / external", state: "passed", t: "1m 04s" },
  { step: "preview/deploy", state: "passed", t: "58s" },
  { step: "proreview/gate", state: "running", t: "—" },
  { step: "promote/production", state: "pending", t: "—" },
] as const;

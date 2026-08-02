import type { ProductPageContent } from "./types";

export const proreviewContent: ProductPageContent = {
  slug: "proreview",
  metadata: {
    title: "ProReview — Collaborative documentation review",
    description:
      "Editorial QA concept for documentation pull requests — structure, accuracy, and style in one pass.",
  },
  hero: {
    title: "ProReview",
    tagline: "Editorial QA that treats docs like code—without slowing release trains.",
    problem:
      "“LGTM” reviews don’t catch broken procedures, wrong flags, or contradictory API examples. ProReview (concept) bundles checklist, diff, and SME routing so every merge raises the bar—and the audit trail is obvious.",
  },
  features: [
    {
      title: "Structured review checklist",
      body: "Accuracy, procedures, links, accessibility, and release impact—each reviewer signs the dimensions they own.",
    },
    {
      title: "Inline diffs for docs",
      body: "MDX-aware diff with callouts for headings, includes, and generated API sections—no plain-text noise.",
    },
    {
      title: "ProStyle integration",
      body: "Voice and terminology violations surface as review comments with one-click suggestions.",
    },
    {
      title: "SME routing",
      body: "Auto-assign security, data, or legal reviewers when frontmatter tags touch regulated topics.",
    },
    {
      title: "Evidence links",
      body: "Attach Jira / ADO issues so approvals map to shipped work—audit-friendly for healthcare and fintech.",
    },
    {
      title: "Merge gates",
      body: "ProOps (concept) gates can require ProReview approval + green lint before promoting a release branch.",
    },
  ],
  metrics: [
    { label: "Median review time", value: "3.5h", hint: "Docs PRs" },
    { label: "Defects caught pre-merge", value: "72%", hint: "vs post-release" },
    { label: "Checklist completion", value: "100%", hint: "Release branches" },
    { label: "SME SLA hit rate", value: "89%", hint: "Security & legal" },
  ],
  builtForTags: [
    "Docs + Eng pair programming",
    "Platform squads with shared repos",
    "Regulated industries",
    "High-stakes API changes",
  ],
};

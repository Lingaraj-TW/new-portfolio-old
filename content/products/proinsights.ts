import type { ProductPageContent } from "./types";

export const proinsightsContent: ProductPageContent = {
  slug: "proinsights",
  metadata: {
    title: "ProInsights — Documentation analytics",
    description:
      "Measure documentation effectiveness — usage, feedback trends, search success, and content health.",
  },
  hero: {
    title: "ProInsights",
    tagline: "Documentation analytics and content performance.",
    problem:
      "Dashboards built for marketing clicks don’t help docs teams. ProInsights (concept) aggregates the same evidence ProFeed captures—stars, helpful votes, highlights, and attachments—so you prioritize with reader behavior, not hunches.",
  },
  features: [
    {
      title: "Feedback funnel view",
      body: "Open vs triaged vs closed trends so leadership can see whether the docs org is keeping pace.",
    },
    {
      title: "Hot pages & hotspots",
      body: "Rank pages by volume and highlight density—where readers struggle maps to where writers invest.",
    },
    {
      title: "Team & author lenses",
      body: "Slice by tagged owner to balance workload and spot overloaded SMEs.",
    },
    {
      title: "Star distribution",
      body: "Star histograms show whether content is “fine” or genuinely delightful—spot outliers fast.",
    },
    {
      title: "Attachment intelligence",
      body: "Count uploads with feedback to understand when text alone isn’t enough for fixes.",
    },
    {
      title: "Release correlation",
      body: "Concept: overlay changelog trains with spikes in feedback to catch doc drift after ships.",
    },
  ],
  metrics: [
    { label: "Pages with spikes", value: "7", hint: "Rolling 14 days" },
    { label: "Mean time to triage", value: "6h", hint: "Org target" },
    { label: "Highlight density", value: "Top 3 pages", hint: "Visual QA backlog" },
    { label: "Star uplift", value: "+0.3", hint: "After rewrite sprint" },
  ],
  builtForTags: [
    "Docs leadership",
    "Product ops + PMM",
    "Engineering managers",
    "Support planning",
  ],
  liveDemo: {
    label: "Live ProInsights",
    href: "/proinsights",
  },
};

export const proinsightsMockStats = {
  totalFeedback: 51,
  averageStars: 4.12,
  helpfulPercent: 0.72,
  ratedCount: 38,
  helpfulCount: 29,
  notHelpfulCount: 11,
  attachments: 12,
  dashboardTitle: "Mock dashboard (static data)",
  dashboardSubtitle:
    "Mirrors the authenticated ProInsights layout—without Supabase.",
};

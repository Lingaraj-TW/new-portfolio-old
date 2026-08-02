import type { ProductPageContent } from "./types";

export const profeedContent: ProductPageContent = {
  slug: "profeed",
  metadata: {
    title: "ProFeed — Documentation feedback platform",
    description:
      "Capture documentation issues, feature requests, and improvement signals with triage workflows.",
  },
  hero: {
    title: "ProFeed",
    tagline: "Documentation feedback and customer insight platform.",
    problem:
      "Untriaged feedback becomes duplicate bugs, slow releases, and tribal knowledge in chat. ProFeed (concept) centralizes reader signals from ProDoc—anchored, tagged, and ready for owners with clear SLAs.",
  },
  features: [
    {
      title: "In-context capture",
      body: "Highlights, stars, and section anchors tie feedback to the exact paragraph—no vague “docs are wrong” tickets.",
    },
    {
      title: "Triage board",
      body: "Statuses (open / triaged / closed), filters by page, team, and author so on-call writers don’t drown in noise.",
    },
    {
      title: "Tagged routing",
      body: "Tag engineering, docs, or support owners so the right queue gets pinged without a manual forward chain.",
    },
    {
      title: "Attachments & voice",
      body: "Screenshots, logs, and short voice notes attach to a row so repro steps survive handoffs.",
    },
    {
      title: "RLS-ready model",
      body: "Concept mirrors Supabase Row Level Security patterns—customer vs admin visibility by role.",
    },
    {
      title: "Portal handoff",
      body: "Customer portal surfaces mirror internal triage so external partners see status without Slack archaeology.",
    },
  ],
  metrics: [
    { label: "Median triage time", value: "6h", hint: "Concept SLA" },
    { label: "Feedback with anchor", value: "91%", hint: "Section-specific" },
    { label: "Tags applied", value: "2.4 avg", hint: "Per row" },
    { label: "Reopened tickets", value: "−41%", hint: "QoQ trend" },
  ],
  builtForTags: [
    "Docs & DX teams",
    "Customer success",
    "Support partnering on KB",
    "Compliance-heavy releases",
  ],
  liveDemo: {
    label: "Live ProFeed inbox",
    href: "/profeed/inbox",
  },
};

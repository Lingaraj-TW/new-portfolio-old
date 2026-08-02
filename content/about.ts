export const aboutPage = {
  metadata: {
    title: "About Me",
    description:
      "Senior Technical Writer with eight years building documentation infrastructure for healthcare SaaS, enterprise B2B, and mobile products.",
  },
  heading: "About me",
  intro:
    "Over eight years I have designed high-fidelity content ecosystems for healthcare SaaS, enterprise B2B, and mobile products—API references, user manuals, Docs-as-Code pipelines, and knowledge bases that reduce support overhead and accelerate adoption. I partner with engineering, product, QA, and support so documentation stays trustworthy at release and scales as the product evolves.",
  quote:
    "Clear documentation turns product intent into customer self-sufficiency.",
  stats: [
    { value: "8+", label: "Years of experience" },
    { value: "7", label: "Focus areas" },
    { value: "6", label: "ProDoc apps built" },
  ],
  careAboutHeading: "What I care about",
  careAboutItems: [
    {
      icon: "users" as const,
      text: "Audience-first structure (task, reference, and conceptual content where it helps).",
    },
    {
      icon: "trendingUp" as const,
      text: "Measurable outcomes: fewer escalations, faster first success, cleaner releases.",
    },
    {
      icon: "gitBranch" as const,
      text: "Close work with engineering, QA, and support so docs stay accurate as the product ships.",
    },
  ],
  photo: {
    src: "/images/profile-photo.jpg",
    alt: "Linga Raj M",
  },
};

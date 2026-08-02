import "server-only";

import { aboutPage } from "@/content/about";
import { contactPage, footer, quickFacts } from "@/content/contact";
import { experience, experiencePage } from "@/content/experience";
import {
  closingSection,
  ecosystemSection,
  featuredProducts,
  hero,
  highlights,
  portfolioSection,
  siteBrand,
} from "@/content/homepage";
import { productNavItems, productsOverview } from "@/content/products";
import { prodocContent } from "@/content/products/prodoc";
import { proassistContent } from "@/content/products/proassist";
import { profeedContent } from "@/content/products/profeed";
import { proinsightsContent } from "@/content/products/proinsights";
import { proapiContent } from "@/content/products/proapi";
import { primaryNav } from "@/content/navigation";
import { techStackSection } from "@/content/skills";

let cachedKnowledge: string | null = null;

function formatProductContent(
  name: string,
  content: {
    hero: { title: string; tagline: string };
    features: { title: string; body: string }[];
  },
  href: string,
) {
  return [
    `## ${name} (${href})`,
    content.hero.tagline,
    ...content.features.map((f) => `- ${f.title}: ${f.body}`),
  ].join("\n");
}

function buildStructuredSiteKnowledge(): string {
  const contactLines = contactPage.links
    .map((l) => `- ${l.label}: ${l.value} → ${l.href}`)
    .join("\n");

  const experienceLines = experience
    .map(
      (e) =>
        `- ${e.role} @ ${e.org} (${e.period}, ${e.location})${e.current ? " [current]" : ""}: ${e.bullets.join(" ")}`,
    )
    .join("\n");

  const productLines = featuredProducts
    .map((p) => `- ${p.title}: ${p.shortDescription} Demo: ${p.liveDemoHref}`)
    .join("\n");

  const navLines = primaryNav.map((n) => `- ${n.label}: ${n.href}`).join("\n");

  const skillCategories = techStackSection.categories
    .map((c) => `- ${c.title}: ${c.description}`)
    .join("\n");

  return `
# Site knowledge — Linga Raj M portfolio (ProDoc)

## Person
- Name: ${siteBrand.name}
- Title: ${siteBrand.subtitle}
- Availability: ${quickFacts.rows.find((r) => r.label === "Availability")?.values.map((v) => v.text).join("; ")}
- Languages: ${quickFacts.rows.find((r) => r.label === "Languages")?.values.map((v) => v.text).join("; ")}

## Contact (use exact URLs when asked)
${contactLines}
- GitHub: https://github.com/lingaraj-tw/prodoc
- Resume PDF: /downloads/Linga_Raj_M_Resume.pdf

## Homepage hero
- ${hero.eyebrow}
- Headline: ${hero.headline}
- Summary: ${hero.subtitle}
- Platform: /platform

## Navigation / sections
${navLines}
- Ecosystem section: #ecosystem — ${ecosystemSection.heading}
- ProDoc demo on home: #prodoc-demo
- ProFeed card on portfolio: #profeed

## About
${aboutPage.intro}
Stats: ${aboutPage.stats.map((s) => `${s.value} ${s.label}`).join(", ")}

## Experience
${experiencePage.homeIntro}
${experienceLines}

## Skills & tech stack
${techStackSection.title}: ${techStackSection.subtitle}
${skillCategories}
AI tools: ${quickFacts.rows.find((r) => r.label === "AI Tools")?.values.map((v) => v.text).join("; ")}
Formats: ${quickFacts.rows.find((r) => r.label === "Formats")?.values.map((v) => v.text).join("; ")}
Domains: ${quickFacts.rows.find((r) => r.label === "Domains")?.values.map((v) => v.text).join("; ")}

## Portfolio products
${portfolioSection.description}
${productLines}

## Product pages
${productsOverview.description}
${productNavItems.map((p) => `- ${p.name}: ${p.subtitle} → ${p.href}`).join("\n")}

${formatProductContent("ProDoc", prodocContent, "/products/prodoc")}
${formatProductContent("ProAssist", proassistContent, "/products/proassist")}
${formatProductContent("ProFeed", profeedContent, "/products/profeed")}
${formatProductContent("ProInsights", proinsightsContent, "/products/proinsights")}
${formatProductContent("ProAPI", proapiContent, "/products/proapi")}

## Governance (under ProDoc)
Style, editorial review, and docs-as-code operations are integrated into ProDoc — not standalone products.
${prodocContent.governanceFeatures?.map((f) => `- ${f.title}: ${f.body}`).join("\n") ?? ""}

## Key achievements
${highlights.map((h) => `- ${h.title}: ${h.body}`).join("\n")}

## What I deliver
${closingSection.description}
${closingSection.pillars.map((p) => `- ${p.title}: ${p.body}`).join("\n")}
Hiring: ${closingSection.cta.subline}

## Footer links
${footer.connect.map((c) => `- ${c.label}: ${c.href}`).join("\n")}
`.trim();
}

/** Structured site knowledge for the assistant system prompt (cached). */
export function getAssistantKnowledge(): string {
  if (cachedKnowledge) return cachedKnowledge;
  cachedKnowledge = buildStructuredSiteKnowledge();
  return cachedKnowledge;
}

/** Lightweight keyword retrieval for non-LLM fallback. */
export function retrieveKnowledgeSnippets(query: string, maxSnippets = 4): string[] {
  const kb = getAssistantKnowledge();
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);
  if (!terms.length) return [];

  const paragraphs = kb.split(/\n\n+/);
  const scored = paragraphs
    .map((p) => {
      const lower = p.toLowerCase();
      const score = terms.reduce((n, t) => n + (lower.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxSnippets).map((x) => x.p.trim());
}

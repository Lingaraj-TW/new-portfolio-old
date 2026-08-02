"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { getEcosystemEntryHref } from "@/lib/prodoc-urls";
import { ProDocBrandLogo } from "@/components/products/ProDocBrandLogo";
import {
  LogoBlueprintGrid,
  LogoFoldedDocumentP,
  LogoHexEcosystem,
  LogoKnowledgeCube,
  LogoLighthouseBeacon,
  LogoNeuralDocument,
  LogoOpenBookCircuit,
  LogoOrbitDocumentCore,
} from "@/components/products/prodoc/prodoc-logo-marks";

const STORAGE_KEY = "prodoc-hero-logo-concept";

export const logoConcepts = [
  {
    id: "foldedP",
    name: "Folded Document + P",
    philosophy:
      "A document transformed into the flagship mark of an intelligent documentation platform.",
    marks: LogoFoldedDocumentP,
  },
  {
    id: "orbitCore",
    name: "Orbit Nodes + Document Core",
    philosophy:
      "Structured content connected to analytics, governance, review workflows, and AI.",
    marks: LogoOrbitDocumentCore,
  },
  {
    id: "knowledgeCube",
    name: "Knowledge Cube",
    philosophy:
      "Documentation as a scalable infrastructure block for modern product teams.",
    marks: LogoKnowledgeCube,
  },
  {
    id: "neuralDoc",
    name: "Neural Document",
    philosophy:
      "AI-powered knowledge processing, automation, and intelligent content assistance.",
    marks: LogoNeuralDocument,
  },
  {
    id: "blueprint",
    name: "Blueprint Grid",
    philosophy:
      "Documentation engineered with the precision of software architecture.",
    marks: LogoBlueprintGrid,
  },
  {
    id: "lighthouse",
    name: "Lighthouse Beacon",
    philosophy:
      "Guiding users to answers faster with clear and discoverable content.",
    marks: LogoLighthouseBeacon,
  },
  {
    id: "hexEco",
    name: "Hexagonal Ecosystem",
    philosophy:
      "Multiple documentation products orchestrated as one connected platform.",
    marks: LogoHexEcosystem,
  },
  {
    id: "openCircuit",
    name: "Open Book + Circuit",
    philosophy:
      "Traditional documentation enhanced with modern AI intelligence.",
    marks: LogoOpenBookCircuit,
  },
];

export type LogoConceptId = typeof logoConcepts[number]["id"];

type ProDocHeroProps = {
  demoAnchorId?: string;
  /** Full path for primary CTA when the hero is not on `/prodoc-platform` (e.g. `/prodoc-platform#concept-demo`). */
  demoHref?: string;
  ecosystemHref?: string;
  /** Use `h2` on the portfolio home to keep a single page `<h1>`. */
  titleAs?: "h1" | "h2";
};

// ── Unified card icon — one cohesive outline style across all 8 concepts ──
function ConceptIcon({ id }: { id: string }) {
  const cls =
    "h-7 w-7 text-accent transition-colors duration-200 group-hover:text-accent-hover";
  const sw = "1.75";

  switch (id) {
    // Folded Document + P — folded-corner document with a subtle "P"
    case "foldedP":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M9 13h3a1.5 1.5 0 0 1 0 3H9v-3z"/>
          <line x1="9" y1="16" x2="9" y2="18"/>
        </svg>
      );

    // Orbit Nodes + Document Core — network/orbit nodes
    case "orbitCore":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <circle cx="12" cy="12" r="3"/>
          <circle cx="4" cy="6" r="1.5"/>
          <circle cx="20" cy="6" r="1.5"/>
          <circle cx="4" cy="18" r="1.5"/>
          <circle cx="20" cy="18" r="1.5"/>
          <line x1="5.5" y1="6.75" x2="9.5" y2="10.5"/>
          <line x1="18.5" y1="6.75" x2="14.5" y2="10.5"/>
          <line x1="5.5" y1="17.25" x2="9.5" y2="13.5"/>
          <line x1="18.5" y1="17.25" x2="14.5" y2="13.5"/>
        </svg>
      );

    // Knowledge Cube — 3-D cube
    case "knowledgeCube":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <polyline points="21 16 21 8 12 3 3 8 3 16 12 21 21 16"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      );

    // Neural Document — document with connected nodes
    case "neuralDoc":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <circle cx="9" cy="13" r="1"/>
          <circle cx="15" cy="13" r="1"/>
          <circle cx="12" cy="17" r="1"/>
          <line x1="10" y1="13" x2="14" y2="13"/>
          <line x1="9.5" y1="14" x2="11.5" y2="16.3"/>
          <line x1="14.5" y1="14" x2="12.5" y2="16.3"/>
        </svg>
      );

    // Blueprint Grid — layout / grid blueprint
    case "blueprint":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      );

    // Lighthouse Beacon — beacon / signal light
    case "lighthouse":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <path d="M9 9h6l1 12H8L9 9z"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <path d="M5 6.5A7 7 0 0 1 19 6.5"/>
          <path d="M3 4A10 10 0 0 1 21 4"/>
        </svg>
      );

    // Hexagonal Ecosystem — hexagon with inner nodes
    case "hexEco":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <polygon points="12 2 20.66 7 20.66 17 12 22 3.34 17 3.34 7"/>
          <circle cx="12" cy="12" r="2"/>
          <line x1="12" y1="7" x2="12" y2="10"/>
          <line x1="12" y1="14" x2="12" y2="17"/>
          <line x1="7.5" y1="9.5" x2="10.3" y2="11"/>
          <line x1="16.5" y1="9.5" x2="13.7" y2="11"/>
        </svg>
      );

    // Open Book + Circuit — open book
    case "openCircuit":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          <line x1="6" y1="9" x2="8" y2="9"/>
          <line x1="16" y1="9" x2="18" y2="9"/>
          <line x1="6" y1="12" x2="8" y2="12"/>
          <line x1="16" y1="12" x2="18" y2="12"/>
        </svg>
      );

    default:
      return null;
  }
}

function isLogoConceptId(s: string): s is LogoConceptId {
  return logoConcepts.some((c) => c.id === s);
}

export function ProDocHero({
  demoAnchorId = "concept-demo",
  demoHref,
  ecosystemHref = getEcosystemEntryHref(),
  titleAs = "h1",
}: ProDocHeroProps) {
  const [conceptId, setConceptId] = useState<LogoConceptId>("orbitCore");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && isLogoConceptId(raw)) setConceptId(raw);
      else localStorage.setItem(STORAGE_KEY, "orbitCore");
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((id: LogoConceptId) => {
    setConceptId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const TitleTag = titleAs === "h2" ? "h2" : "h1";
  const primaryDemoHref = demoHref ?? `#${demoAnchorId}`;

  return (
    <section className="prodoc-hero-shell home-panel relative isolate flex w-full flex-col items-center overflow-hidden px-6 pb-8 pt-8 text-center sm:px-8 sm:pt-9 md:pt-10">
      {/* Ambient glow — soft in light, stronger in dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[420px] w-[520px] rounded-full bg-accent/8 blur-[100px] dark:bg-purple-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[360px] w-[480px] rounded-full bg-secondary-accent/8 blur-[90px] dark:bg-pink-500/14"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[5%] h-px w-[min(620px,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/25 to-transparent dark:via-white/25"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-0 text-center">
        {/* Primary mark — ProDoc logo (transparent PNG) */}
        <div className="flex justify-center">
          <ProDocBrandLogo variant="hero" />
        </div>

        <TitleTag className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          ProDoc
        </TitleTag>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mt-2 bg-gradient-to-r from-accent via-[color:var(--accent-secondary)] to-secondary-accent bg-clip-text pb-px text-xl font-semibold tracking-tight text-transparent sm:text-2xl md:text-[1.65rem]"
        >
          Documentation infrastructure that ships like a product.
        </motion.p>

        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Teams need documentation that evolves with the product, not static PDFs
          and disconnected wikis. ProDoc is an AI-powered documentation platform
          that combines structured authoring, governance, review workflows,
          analytics, and reader feedback into one intelligent knowledge system.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent dark:border-purple-500/25 dark:bg-purple-500/10 dark:text-purple-200/95">
            AI-powered documentation platform
          </span>
          <span className="rounded-full border border-secondary-accent/25 bg-secondary-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-secondary-accent dark:border-pink-500/25 dark:bg-pink-500/10 dark:text-pink-200/90">
            Documentation ecosystem flagship
          </span>
        </div>

        <div className="mt-5 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href={primaryDemoHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-accent to-secondary-accent px-8 py-3 text-center text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 dark:shadow-purple-500/25"
          >
            View concept demo
          </Link>
          <Link
            href={ecosystemHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border-card bg-elevated px-8 py-3 text-center text-sm font-semibold text-foreground backdrop-blur transition hover:border-accent/35 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:border-white/12 dark:bg-white/[0.04] dark:text-[#F8FAFC] dark:hover:bg-white/[0.07]"
          >
            Explore documentation ecosystem
          </Link>
        </div>
      </div>

      {/* Visual Identity Exploration */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-5xl border-t border-border-card pt-8">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Visual Identity Exploration
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground md:text-xl">
            Eight conceptual directions explored to define ProDoc&apos;s flagship brand identity
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each concept represents a unique interpretation of documentation as scalable product infrastructure.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-fg-tertiary">
            This section demonstrates the strategic design thinking behind ProDoc&apos;s visual identity. Each concept translates core product themes — structured content, AI-powered workflows, governance, analytics, and ecosystem orchestration — into a distinct logo direction.
          </p>
        </div>

        <motion.ul
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          layout="position"
          role="listbox"
          aria-label="ProDoc logo concepts"
        >
          {logoConcepts.map((c, i) => {
            const sel = conceptId === c.id;
            return (
              <motion.li key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <motion.button
                  type="button"
                  role="option"
                  aria-selected={sel}
                  onClick={() => persist(c.id)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ duration: 0.18 }}
                  className={`group flex h-full w-full flex-col rounded-2xl border p-4 text-left outline-none ring-offset-4 ring-offset-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent/50 ${
                    sel
                      ? "border-accent/40 bg-gradient-to-br from-accent/10 to-secondary-accent/5 shadow-md shadow-accent/10 dark:border-purple-500/50 dark:from-purple-500/10 dark:to-cyan-500/5 dark:shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                      : "border-border-card bg-elevated hover:border-accent/30 hover:bg-muted hover:shadow-md hover:shadow-accent/5 dark:border-white/10 dark:bg-slate-950/70 dark:hover:border-cyan-500/30 dark:hover:bg-white/[0.05] dark:hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)]"
                  }`}
                >
                  <div className="mb-4 flex items-start gap-4">
                    {/* ── Unified icon container ── */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-card p-3 shadow-sm shadow-accent/5 transition-all duration-200 group-hover:border-accent/40 group-hover:shadow-md group-hover:shadow-accent/10 dark:border-cyan-500/20 dark:bg-slate-950/80 dark:shadow-[0_0_20px_rgba(6,182,212,0.08)] dark:group-hover:shadow-[0_0_24px_rgba(6,182,212,0.15)]">
                      <ConceptIcon id={c.id} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                        {c.philosophy}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

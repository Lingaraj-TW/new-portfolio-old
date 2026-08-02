"use client";

import { FileCode2, RefreshCw, Sparkles, type LucideIcon } from "lucide-react";

import { closingSection } from "@/content/homepage";
import { handleHomeSectionScroll } from "@/lib/scroll-to-section";
import { resumeDownload } from "@/lib/resume";

const pillarIcons: Record<(typeof closingSection.pillars)[number]["icon"], LucideIcon> = {
  fileCode: FileCode2,
  sparkles: Sparkles,
  loop: RefreshCw,
};

const secondaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-border-card bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/40 hover:bg-muted";

const primaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_4px_24px_rgba(147,51,234,0.25)] transition hover:bg-accent/90 hover:shadow-[0_6px_28px_rgba(147,51,234,0.35)]";

function sectionHref(id: string) {
  return `#${id}`;
}

export function HomeClosingSection() {
  return (
    <section
      id="work-with-me"
      className="scroll-mt-20"
      aria-labelledby="closing-heading"
    >
      <div className="home-panel relative overflow-hidden p-6 sm:p-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {closingSection.eyebrow}
          </p>
          <h2
            id="closing-heading"
            className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            {closingSection.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {closingSection.description}
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {closingSection.pillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.icon];
              return (
                <li
                  key={pillar.title}
                  className="home-card group p-4 duration-200 hover:border-accent/35 hover:bg-muted/50"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 transition group-hover:bg-accent/15"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4 text-accent" strokeWidth={2} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-xl border border-accent/25 bg-accent/5 px-6 py-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 text-left sm:flex-1">
              <p className="font-display text-lg font-semibold text-foreground sm:text-xl">
                {closingSection.cta.headline}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {closingSection.cta.subline}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:mt-0 sm:shrink-0 sm:flex-row sm:flex-wrap sm:justify-end">
              {closingSection.cta.actions.map((action) => {
                if (action.download) {
                  return (
                    <a
                      key={action.label}
                      href={resumeDownload.href}
                      download={resumeDownload.filename}
                      className={secondaryButtonClass}
                    >
                      {action.label}
                    </a>
                  );
                }

                const isPrimary = action.variant === "primary";
                const className = isPrimary ? primaryButtonClass : secondaryButtonClass;
                const sectionId = action.href.startsWith("#")
                  ? action.href.slice(1)
                  : null;

                if (sectionId) {
                  return (
                    <a
                      key={action.label}
                      href={sectionHref(sectionId)}
                      className={className}
                      onClick={(e) => handleHomeSectionScroll(e, sectionId)}
                    >
                      {action.label}
                    </a>
                  );
                }

                return (
                  <a key={action.label} href={action.href} className={className}>
                    {action.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

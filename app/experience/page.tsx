import type { Metadata } from "next";

import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { education, experiencePage } from "@/content/experience";

export const metadata: Metadata = experiencePage.metadata;

export default function ExperiencePage() {
  return (
    <MarketingPageShell>
      <section className="scroll-mt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {experiencePage.heading}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
          Professional background
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {experiencePage.homeIntro}
        </p>

        <ExperienceTimeline className="mt-2" />
      </section>

      <section className="mt-16 scroll-mt-24">
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {experiencePage.educationHeading}
        </h2>
        <div className="home-card mt-6 p-6">
          <h3 className="text-lg font-semibold text-foreground">{education.degree}</h3>
          <p className="mt-2 text-sm font-medium text-foreground/85">{education.school}</p>
          <p className="mt-1 text-sm text-muted-foreground">{education.period}</p>
        </div>
      </section>
    </MarketingPageShell>
  );
}

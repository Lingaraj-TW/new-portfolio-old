import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { experiencePage } from "@/content/experience";

export function ExperienceSection() {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        {experiencePage.heading}
      </p>
      <h2
        id="experience-heading"
        className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]"
      >
        Professional background
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {experiencePage.homeIntro}
      </p>

      <ExperienceTimeline />
    </div>
  );
}

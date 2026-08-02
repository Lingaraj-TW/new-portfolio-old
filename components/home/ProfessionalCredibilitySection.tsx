import { ExperienceSection } from "@/components/home/ExperienceSection";
import { KeyAchievementsSection } from "@/components/home/KeyAchievementsSection";

/** Experience + key achievements — credibility block before portfolio. */
export function ProfessionalCredibilitySection() {
  return (
    <section
      id="experience"
      className="scroll-mt-24"
      aria-label="Experience and key achievements"
    >
      <div className="home-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,420px)] xl:gap-12">
          <ExperienceSection />
          <KeyAchievementsSection />
        </div>
      </div>
    </section>
  );
}

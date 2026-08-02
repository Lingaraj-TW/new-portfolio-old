import { ContactSection } from "@/components/home/ContactSection";
import { EcosystemDiagram } from "@/components/home/EcosystemDiagram";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeClosingSection } from "@/components/home/HomeClosingSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { ProfessionalCredibilitySection } from "@/components/home/ProfessionalCredibilitySection";
import { TechStackSection } from "@/components/home/TechStackSection";
import { ScrollEnhancements } from "@/components/home/ScrollEnhancements";
import FadeUp from "@/components/shared/FadeUp";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProDocHero } from "@/components/products/prodoc/ProDocHero";
import { ecosystemSection, proDocHeroOnHome } from "@/content/homepage";
import { getEcosystemEntryHref } from "@/lib/prodoc-urls";

export default function Home() {
  const ecosystemEntry = getEcosystemEntryHref();

  return (
    <div
      data-portfolio-surface
      className="page-wrapper flex min-h-0 flex-col bg-transparent text-foreground"
    >
      <ScrollEnhancements />
      <Navbar />
      <HeroSection />

      <main className="flex flex-1 flex-col">
        <div className="home-content flex flex-col gap-6 py-6 sm:gap-8 sm:py-8">
          <FadeUp>
            <HomeClosingSection />
          </FadeUp>

          <FadeUp delay={0.05}>
            <section
              id="prodoc-demo"
              className="scroll-mt-24"
              aria-label="ProDoc flagship concept demo"
            >
              <ProDocHero
                titleAs="h2"
                demoHref={proDocHeroOnHome.demoHref}
                ecosystemHref={ecosystemEntry}
              />
            </section>
          </FadeUp>

          <FadeUp delay={0.1}>
            <section id="ecosystem" className="scroll-mt-24" aria-labelledby="ecosystem-heading">
              <div className="home-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                  aria-hidden
                />
                <h2 id="ecosystem-heading" className="home-section-title relative">
                  {ecosystemSection.heading}
                </h2>
                <div className="relative mt-6">
                  <EcosystemDiagram />
                </div>
              </div>
            </section>
          </FadeUp>

          <FadeUp delay={0.1}>
            <ProfessionalCredibilitySection />
          </FadeUp>

          <FadeUp delay={0.1}>
            <TechStackSection />
          </FadeUp>

          <FadeUp delay={0.1}>
            <PortfolioSection />
          </FadeUp>

          <FadeUp delay={0.1}>
            <ContactSection />
          </FadeUp>
        </div>
      </main>

      <FadeUp delay={0.05}>
        <Footer />
      </FadeUp>
    </div>
  );
}

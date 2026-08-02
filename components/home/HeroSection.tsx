"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { HeroCapabilityBadges } from "@/components/home/HeroCapabilityBadges";
import { StrategicEvolution } from "@/components/home/StrategicEvolution";
import { ProfilePhoto } from "@/components/home/ProfilePhoto";
import { QuickFacts } from "@/components/home/QuickFacts";
import { hero } from "@/content/homepage";

const MotionLink = motion.create(Link);

export function HeroSection() {
  return (
    <section id="hero" className="hero-section relative overflow-x-clip min-h-[85vh] min-h-[85dvh]">
      <div className="home-content hero-grid relative z-[1]">
        <div className="hero-grid__main min-w-0">
          <motion.p
            className="hero-eyebrow relative z-[1] max-w-full text-xs font-medium tracking-normal text-muted-foreground md:text-sm md:whitespace-nowrap"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className="hero-h1 relative z-[1] mt-2.5 font-display font-bold tracking-[-0.025em] text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {hero.headline}
          </motion.h1>

          {/* Mobile photo */}
          <div className="relative z-[1] mb-5 mt-5 flex justify-center lg:hidden">
            <ProfilePhoto className="h-24 w-24 sm:h-28 sm:w-28" />
          </div>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MotionLink
              href={hero.primaryCta.href}
              className="hero-cta-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground"
              whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {hero.primaryCta.label}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </MotionLink>
            <MotionLink
              href={hero.secondaryCta.href}
              className="hero-cta-secondary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-foreground"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {hero.secondaryCta.label}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </MotionLink>
          </motion.div>

          <motion.div
            className="hero-capability-pills-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroCapabilityBadges />
          </motion.div>

          <motion.div
            className="strategic-evolution-wrap mt-8 flex justify-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <StrategicEvolution />
          </motion.div>
        </div>

        <div className="hero-grid__aside">
          <ProfilePhoto className="hero-grid__photo hidden h-36 w-36 shrink-0 lg:block xl:h-40 xl:w-40" />
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuickFacts />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Cog,
  Layers,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { hero } from "@/content/homepage";

const CYCLE_MS = 2500;

const CAPABILITY_ICONS: Record<(typeof hero.capabilityPills)[number], LucideIcon> = {
  "Documentation Platforms": Layers,
  "AI Documentation": Sparkles,
  "Developer Experience": Cog,
  "Documentation Analytics": BarChart3,
  "Feedback Operations": MessageSquare,
  "SaaS Product Docs": BookOpen,
};

export function HeroCapabilityBadges() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((index) => (index + 1) % hero.capabilityPills.length);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div className="hero-capability-pills" aria-label="Capabilities">
      {hero.capabilityPills.map((label, index) => {
        const Icon = CAPABILITY_ICONS[label];
        const isActive = !reduceMotion && activeIndex === index;

        return (
          <motion.span
            key={label}
            className={`hero-capability-pill${isActive ? " hero-capability-pill--active" : ""}`}
            animate={{ scale: isActive ? 1.03 : 1 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-capability-pill__icon" aria-hidden>
              <Icon strokeWidth={2} />
            </span>
            <span className="hero-capability-pill__label">{label}</span>
          </motion.span>
        );
      })}
    </div>
  );
}

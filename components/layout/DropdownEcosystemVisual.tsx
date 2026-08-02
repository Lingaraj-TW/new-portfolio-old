"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, FileText, MessageSquare } from "lucide-react";

const cards = [
  {
    id: "docs",
    className: "dropdown-glass-card--docs",
    Icon: FileText,
    rotate: -7,
    floatDelay: 0,
    enterDelay: 0.05,
  },
  {
    id: "center",
    className: "dropdown-glass-card--center",
    Icon: BarChart3,
    rotate: 0,
    floatDelay: 0.35,
    enterDelay: 0.12,
  },
  {
    id: "feed",
    className: "dropdown-glass-card--feed",
    Icon: MessageSquare,
    rotate: 8,
    floatDelay: 0.7,
    enterDelay: 0.19,
  },
] as const;

type DropdownEcosystemVisualProps = {
  /** Narrow / stacked dropdown — use centered row layout and gentler motion */
  compact?: boolean;
};

/** Floating glass cards — no backdrop; cards animate in open space. */
export function DropdownEcosystemVisual({ compact = false }: DropdownEcosystemVisualProps) {
  const reduceMotion = useReducedMotion();
  const staticMotion = !!reduceMotion;

  return (
    <div
      className={`dropdown-feature-visual${compact ? " dropdown-feature-visual--compact" : ""}`}
      aria-hidden
    >
      {cards.map(({ id, className, Icon, rotate, floatDelay, enterDelay }) => (
        <motion.div
          key={id}
          className={`dropdown-glass-card ${className}`}
          initial={
            staticMotion
              ? { opacity: 1, y: 0, scale: 1, rotate }
              : { opacity: 0, y: compact ? 8 : 14, scale: 0.9, rotate: rotate - 4 }
          }
          animate={
            staticMotion
              ? { opacity: 1, y: 0, scale: 1, rotate }
              : compact
                ? { opacity: 1, y: 0, scale: 1, rotate }
                : {
                    opacity: 1,
                    y: [0, -6, 0, -4, 0],
                    scale: [1, 1.03, 1, 1.02, 1],
                    rotate: [rotate, rotate, rotate, rotate, rotate],
                  }
          }
          transition={
            staticMotion
              ? { duration: 0.2 }
              : compact
                ? {
                    opacity: { duration: 0.3, delay: enterDelay, ease: "easeOut" },
                    y: { duration: 0.35, delay: enterDelay, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.35, delay: enterDelay, ease: [0.22, 1, 0.36, 1] },
                    rotate: { duration: 0.35, delay: enterDelay },
                  }
                : {
                    opacity: { duration: 0.35, delay: enterDelay, ease: "easeOut" },
                    y: {
                      duration: 4.2,
                      delay: enterDelay + 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 4.2,
                      delay: floatDelay + 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: { duration: 0.35, delay: enterDelay },
                  }
          }
        >
          <span className="dropdown-glass-card-shine" aria-hidden />
          <motion.span
            className="dropdown-glass-card-icon-wrap"
            animate={
              staticMotion || compact
                ? undefined
                : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }
            }
            transition={{
              duration: 3.5,
              delay: floatDelay + 0.4,
              repeat: compact ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="dropdown-glass-card-icon" strokeWidth={1.75} />
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

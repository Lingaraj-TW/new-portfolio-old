"use client";

import { motion } from "framer-motion";

import { MarqueePillIcon } from "@/components/home/tech-stack/marquee-icons";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/use-theme";

export type MarqueePillData = {
  id: string;
  name: string;
};

const PILL_SHADOW_LIGHT = `
  0 2px 8px rgba(0,0,0,0.08),
  0 1px 2px rgba(0,0,0,0.06),
  inset 0 1px 0 rgba(255,255,255,0.25)
`;

const PILL_SHADOW_DARK = `
  0 2px 12px rgba(0,0,0,0.3),
  0 1px 2px rgba(0,0,0,0.2),
  inset 0 1px 0 rgba(255,255,255,0.07)
`;

export function MarqueePill({ tool }: { tool: MarqueePillData }) {
  const theme = useTheme();

  return (
    <motion.div
      className="
        relative mx-1.5 flex shrink-0 items-center gap-2.5
        px-4 py-2.5 rounded-2xl
        whitespace-nowrap cursor-default
        select-none
        transition-all duration-300 ease-out
        group/pill
      "
      style={{
        boxShadow: theme === "dark" ? PILL_SHADOW_DARK : PILL_SHADOW_LIGHT,
      }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-white/[0.08] backdrop-blur-xl transition-colors duration-300 ease-out group-hover/pill:bg-white/[0.14] dark:bg-white/[0.06] dark:group-hover/pill:bg-white/[0.10]" />
      <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/5" />
      <div className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10" />
      <div className="absolute inset-[1px] rounded-[15px] border border-white/30 dark:border-white/[0.07]" />
      <div className="absolute inset-0 rounded-2xl opacity-0 shadow-[0_0_16px_2px_rgba(139,92,246,0.15)] transition-opacity duration-300 group-hover/pill:opacity-100" />

      <div className="relative z-10 flex items-center gap-2.5">
        <div
          className={cn(
            "relative flex h-7 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-0.5 backdrop-blur-sm dark:bg-white/[0.07]",
            tool.id === "dita"
              ? "w-12 border-white/30 bg-white/95 dark:bg-white/95"
              : "w-7",
          )}
        >
          <MarqueePillIcon toolId={tool.id} />
        </div>
        <span className="relative z-10 text-sm font-medium text-foreground/90">
          {tool.name}
        </span>
      </div>
    </motion.div>
  );
}

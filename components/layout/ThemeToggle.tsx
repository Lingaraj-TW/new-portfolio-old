"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { applyTheme, persistTheme, type Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function setTheme(next: Theme) {
    persistTheme(next);
    applyTheme(next);
  }

  const indicatorShadow =
    theme === "light"
      ? "0 0 8px 2px rgba(251,191,36,0.25)"
      : "0 0 8px 2px rgba(139,92,246,0.25)";

  if (!mounted) {
    return (
      <div
        className="h-9 w-[4.5rem] shrink-0 rounded-full border border-border/60 bg-background/60"
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-0.5 rounded-full border border-border/60 bg-background/60 p-1 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200"
      >
        <motion.div
          animate={{
            scale: theme === "light" ? 1 : 0.85,
            rotate: theme === "light" ? 0 : -30,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Sun
            className={cn(
              "h-3.5 w-3.5 transition-colors duration-200",
              theme === "light" ? "text-amber-500" : "text-muted-foreground",
            )}
            strokeWidth={2}
            aria-hidden
          />
        </motion.div>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200"
      >
        <motion.div
          animate={{
            scale: theme === "dark" ? 1 : 0.85,
            rotate: theme === "dark" ? 0 : 30,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Moon
            className={cn(
              "h-3.5 w-3.5 transition-colors duration-200",
              theme === "dark" ? "text-violet-400" : "text-muted-foreground",
            )}
            strokeWidth={2}
            aria-hidden
          />
        </motion.div>
      </button>

      <motion.div
        className="absolute top-1 h-7 w-7 rounded-full bg-muted shadow-sm"
        animate={{ x: theme === "light" ? 4 : 32 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{ boxShadow: indicatorShadow }}
        aria-hidden
      />
    </div>
  );
}

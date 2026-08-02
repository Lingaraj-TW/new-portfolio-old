"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { applyTheme, persistTheme, type Theme } from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

export function DocsThemeToggle() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-md border border-[var(--docs-border)] bg-[var(--docs-bg)]" />
    );
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    persistTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--docs-border)] bg-[var(--docs-bg)] text-[var(--docs-muted-fg)] transition-colors hover:bg-[var(--docs-sidebar-bg)] hover:text-[var(--docs-fg)]"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";

import { DEFAULT_THEME, type Theme } from "@/lib/theme";

function readThemeFromDocument(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Subscribes to `html` class changes from ThemeToggle — no refresh required. */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readThemeFromDocument());

    const observer = new MutationObserver(() => {
      setTheme(readThemeFromDocument());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "light" as const;
export type Theme = "light" | "dark";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export function resolveTheme(stored: Theme | null): Theme {
  return stored ?? DEFAULT_THEME;
}

export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  html.classList.add(theme);
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Inline script for ThemeBootstrapScript — prevents flash of wrong theme. */
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var initial=t||'${DEFAULT_THEME}';var el=document.documentElement;el.classList.remove('dark','light');el.classList.add(initial);}catch(e){}})();`;

"use client";

import { themeBootstrapScript } from "@/lib/theme";

/** SSR-only inline script — skipped on client to avoid React 19 script warnings. */
export function ThemeBootstrapScript() {
  if (typeof window !== "undefined") return null;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
    />
  );
}

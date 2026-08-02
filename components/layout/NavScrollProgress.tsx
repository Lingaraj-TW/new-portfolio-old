"use client";

import { useEffect, useState } from "react";

/** Scroll fill overlay aligned to the bottom edge of the sticky header. */
export function NavScrollProgress({ progress }: { progress: number }) {
  const [top, setTop] = useState(96);

  useEffect(() => {
    const measure = () => {
      const shell = document.querySelector(".site-header-shell");
      if (shell) {
        setTop(shell.getBoundingClientRect().bottom);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const shell = document.querySelector(".site-header-shell");
    const ro = shell ? new ResizeObserver(measure) : null;
    if (shell && ro) ro.observe(shell);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 z-[101]"
      style={{
        top: `${top}px`,
        height: "2px",
        width: `${progress}%`,
        background: "linear-gradient(90deg, #9333EA, #EC4899)",
        boxShadow: "0 0 8px rgba(147,51,234,0.45)",
        transition: "width 0.12s ease-out",
      }}
    />
  );
}

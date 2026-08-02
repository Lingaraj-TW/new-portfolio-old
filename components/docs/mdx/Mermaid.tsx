"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = { chart: string };

export function Mermaid({ chart }: Props) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "neutral",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to render diagram");
        }
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="not-prose overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="not-prose my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-muted/30 p-4"
    />
  );
}

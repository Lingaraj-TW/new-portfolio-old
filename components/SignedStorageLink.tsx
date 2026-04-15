"use client";

import { useEffect, useState } from "react";

export function SignedStorageLink({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  const [href, setHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/storage/sign?path=${encodeURIComponent(path)}`, {
      credentials: "include",
    })
      .then(async (r) => {
        const j = (await r.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!r.ok) throw new Error(j?.error || "Could not sign URL.");
        if (!j?.url) throw new Error("Missing URL.");
        return j.url;
      })
      .then((url) => {
        if (!cancelled) setHref(url);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (error) {
    return <span className="text-[11px] text-rose-600">{error}</span>;
  }
  if (!href) {
    return <span className="text-[11px] text-zinc-500">Preparing link…</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[11px] font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
    >
      {label}
    </a>
  );
}

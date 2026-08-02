"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

/**
 * URL-based filters for /profeed dashboard (client-side navigation).
 */
export function ProFeedFilters({
  basePath = "/profeed/inbox",
}: {
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") ?? "");
  const [team, setTeam] = useState(searchParams.get("team") ?? "");
  const [writer, setWriter] = useState(searchParams.get("writer") ?? "");
  const [star, setStar] = useState(searchParams.get("star") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");

  const apply = useCallback(() => {
    const p = new URLSearchParams();
    if (page.trim()) p.set("page", page.trim());
    if (team.trim()) p.set("team", team.trim());
    if (writer.trim()) p.set("writer", writer.trim());
    if (star.trim()) p.set("star", star.trim());
    if (status.trim()) p.set("status", status.trim());
    const q = p.toString();
    router.push(q ? `${basePath}?${q}` : basePath);
  }, [page, team, writer, star, status, router, basePath]);

  const clear = useCallback(() => {
    setPage("");
    setTeam("");
    setWriter("");
    setStar("");
    setStatus("");
    router.push(basePath);
  }, [router, basePath]);

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-muted/50 p-4 dark:border-border dark:bg-muted/40">
      <label className="flex min-w-[140px] flex-col gap-1 text-xs font-medium text-muted-foreground">
        Page path
        <input
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="/docs/…"
          className="rounded-lg border border-border bg-card px-2 py-1.5 font-mono text-xs dark:border-border dark:bg-card"
        />
      </label>
      <label className="flex min-w-[120px] flex-col gap-1 text-xs font-medium text-muted-foreground">
        Team
        <input
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          placeholder="contains"
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs dark:border-border dark:bg-card"
        />
      </label>
      <label className="flex min-w-[120px] flex-col gap-1 text-xs font-medium text-muted-foreground">
        Writer
        <input
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          placeholder="contains"
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs dark:border-border dark:bg-card"
        />
      </label>
      <label className="flex w-20 flex-col gap-1 text-xs font-medium text-muted-foreground">
        Stars
        <select
          value={star}
          onChange={(e) => setStar(e.target.value)}
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs dark:border-border dark:bg-card"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[120px] flex-col gap-1 text-xs font-medium text-muted-foreground">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs dark:border-border dark:bg-card"
        >
          <option value="">Any</option>
          <option value="open">open</option>
          <option value="triaged">triaged</option>
          <option value="closed">closed</option>
        </select>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={apply}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-border px-3 py-1.5 text-xs dark:border-border"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

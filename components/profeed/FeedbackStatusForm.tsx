"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { updateFeedbackStatus } from "@/app/profeed/actions";
import { broadcastProInsightsRefresh } from "@/components/proinsights/ProInsightsAutoRefresh";
import type { FeedbackStatus } from "@/lib/types/feedback";

type Props = {
  id: string;
  status: FeedbackStatus;
};

export function FeedbackStatusForm({ id, status }: Props) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<FeedbackStatus>(status);

  useEffect(() => {
    setValue(status);
    setError(null);
  }, [id, status]);

  const submit = (next: FeedbackStatus) => {
    startTransition(async () => {
      setError(null);
      const fd = new FormData();
      fd.append("id", id);
      fd.append("status", next);
      const res = await updateFeedbackStatus(fd);
      if (!res.ok) {
        setError(res.error || "Could not save.");
        setValue(status);
        return;
      }
      if (res.status) setValue(res.status);
      // Keep other UI (e.g. insights) in sync, without forcing a route refresh.
      broadcastProInsightsRefresh();
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-2"
    >
      <select
        name="status"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = (e.currentTarget.value || "open") as FeedbackStatus;
          setValue(next); // optimistic UI
          submit(next);
        }}
        className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground dark:bg-card dark:text-foreground"
      >
        <option value="open">Open</option>
        <option value="triaged">Triaged</option>
        <option value="closed">Closed</option>
      </select>
      {pending ? (
        <span className="text-[10px] text-muted-foreground">Saving…</span>
      ) : null}
      {error ? (
        <span className="text-[10px] text-rose-500">{error}</span>
      ) : null}
    </form>
  );
}

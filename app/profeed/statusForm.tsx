"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import type { FeedbackStatus } from "@/lib/types/feedback";

import { updateFeedbackStatus } from "./actions";
import { broadcastProInsightsRefresh } from "@/components/ProInsightsAutoRefresh";

type Props = {
  id: string;
  status: FeedbackStatus;
};

export function FeedbackStatusForm({ id, status }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
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
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <option value="open">Open</option>
        <option value="triaged">Triaged</option>
        <option value="closed">Closed</option>
      </select>
      {pending ? <span className="text-[10px] text-zinc-500">Saving…</span> : null}
      {error ? <span className="text-[10px] text-rose-500">{error}</span> : null}
    </form>
  );
}


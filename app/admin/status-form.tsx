"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateFeedbackStatus } from "./actions";
import type { FeedbackStatus } from "@/lib/types/feedback";

const STATUSES: FeedbackStatus[] = ["open", "triaged", "closed"];

export function FeedbackStatusForm({
  id,
  status,
}: {
  id: string;
  status: FeedbackStatus;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      key={`${id}-${status}`}
      action={(formData) => {
        setMessage(null);
        startTransition(async () => {
          const res = await updateFeedbackStatus(formData);
          if (!res.ok) {
            setMessage(res.error);
            return;
          }
          router.refresh();
        });
      }}
      className="flex flex-col gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {message ? (
        <span className="text-[11px] text-rose-600 dark:text-rose-400">{message}</span>
      ) : null}
    </form>
  );
}

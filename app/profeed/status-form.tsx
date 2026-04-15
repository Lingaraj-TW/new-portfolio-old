"use client";

import { useTransition } from "react";

import type { FeedbackStatus } from "@/lib/types/feedback";

import { updateFeedbackStatus } from "./actions";

type Props = {
  id: string;
  status: FeedbackStatus;
};

export function FeedbackStatusForm({ id, status }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await updateFeedbackStatus(formData);
        });
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <option value="open">Open</option>
        <option value="triaged">Triaged</option>
        <option value="closed">Closed</option>
      </select>
      {pending ? (
        <span className="text-[10px] text-zinc-500">Saving…</span>
      ) : null}
    </form>
  );
}


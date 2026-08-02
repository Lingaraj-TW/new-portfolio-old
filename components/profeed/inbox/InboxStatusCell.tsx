"use client";

import type { FeedbackStatus } from "@/lib/types/feedback";

import { FeedbackStatusForm } from "@/components/profeed/FeedbackStatusForm";

import { StatusBadge } from "./inbox-badges";

export function InboxStatusCell({
  id,
  status,
  canTriage,
}: {
  id: string;
  status: FeedbackStatus;
  canTriage: boolean;
}) {
  if (!canTriage) {
    return <StatusBadge status={status} />;
  }

  return (
    <div className="[&_select]:border-white/10 [&_select]:bg-slate-900 [&_select]:text-slate-200">
      <FeedbackStatusForm id={id} status={status} />
    </div>
  );
}

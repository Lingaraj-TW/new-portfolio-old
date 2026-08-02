"use client";

import { Star } from "lucide-react";
import Image from "next/image";

import {
  STATUS_STYLES,
  avatarColor,
  formatHelpfulLabel,
  helpfulTone,
  initials,
  teamBadgeClass,
} from "./inbox-types";

export function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status as keyof typeof STATUS_STYLES] ??
    STATUS_STYLES.closed;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}

export function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= count
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-700 text-slate-700"
          }
        />
      ))}
    </div>
  );
}

export function WriterAvatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover ring-2 ring-white/10"
        unoptimized
      />
    );
  }
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white/10 ${avatarColor(name)}`}
    >
      {initials(name)}
    </div>
  );
}

export function TeamBadge({ name }: { name: string }) {
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-xs ${teamBadgeClass(name)}`}
    >
      {name}
    </span>
  );
}

export function HelpfulBadge({ rating }: { rating: number | null }) {
  const label = formatHelpfulLabel(rating);
  if (!label) {
    return <span className="text-slate-600">—</span>;
  }
  const tone = helpfulTone(rating);
  const cls =
    tone === "positive"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : tone === "negative"
        ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
        : "bg-slate-500/15 text-slate-400 border-slate-500/20";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {label}
    </span>
  );
}

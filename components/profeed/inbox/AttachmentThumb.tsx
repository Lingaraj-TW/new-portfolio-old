"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { InboxAttachment } from "./inbox-types";

function isImageAttachment(a: InboxAttachment): boolean {
  if (a.kind === "screenshot") return true;
  const mime = a.mime_type ?? "";
  if (mime.startsWith("image/")) return true;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(a.file_name);
}

export function AttachmentThumb({
  attachment,
  canOpen,
  showName = false,
}: {
  attachment: InboxAttachment;
  canOpen: boolean;
  showName?: boolean;
}) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (!canOpen) return;
    let cancelled = false;
    void fetch(
      `/api/storage/sign?path=${encodeURIComponent(attachment.storage_path)}`,
      { credentials: "include" },
    )
      .then(async (r) => {
        const j = (await r.json()) as { url?: string };
        if (!r.ok || !j.url) throw new Error("sign failed");
        return j.url;
      })
      .then((url) => {
        if (!cancelled) setHref(url);
      })
      .catch(() => {
        if (!cancelled) setHref(null);
      });
    return () => {
      cancelled = true;
    };
  }, [attachment.storage_path, canOpen]);

  if (!canOpen) {
    return (
      <span className="text-[10px] text-slate-500">{attachment.file_name}</span>
    );
  }

  if (isImageAttachment(attachment) && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-block"
      >
        <Image
          src={href}
          alt={attachment.file_name}
          width={32}
          height={32}
          className="mx-auto h-8 w-8 rounded object-cover ring-1 ring-white/10 transition group-hover:scale-110"
          unoptimized
        />
        {showName ? (
          <span className="mt-1 block truncate text-slate-400">
            {attachment.file_name}
          </span>
        ) : null}
      </a>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
      >
        <FileText size={14} className={showName ? "" : "mx-auto"} />
        {showName ? (
          <span className="truncate text-xs">{attachment.file_name}</span>
        ) : null}
      </a>
    );
  }

  return <span className="text-[10px] text-slate-600">…</span>;
}

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { ProFeedButton } from "./ProFeedButton";
import { ProFeedDialog } from "./ProFeedDialog";

/**
 * Floating ProFeed entry point for documentation pages (`/docs`, `/prodoc`).
 */
export function ProFeedWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!pathname?.startsWith("/docs") && !pathname?.startsWith("/prodoc")) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex w-full max-w-lg flex-col items-end gap-2">
        <ProFeedButton onClick={() => setOpen(true)} />
        <ProFeedDialog open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}

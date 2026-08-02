"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { getProdocEntryHref, isExternalDocHref } from "@/lib/prodoc-urls";

type Props = {
  children: ReactNode;
  prodocEntry: string;
};

export function ProFeedShell({ children, prodocEntry }: Props) {
  const pathname = usePathname();
  const isInbox =
    pathname === "/profeed/inbox" || pathname.startsWith("/profeed/inbox/");

  if (isInbox) {
    return <>{children}</>;
  }

  const prodocExternal = isExternalDocHref(prodocEntry);

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link
              href="/profeed"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              ProFeed
            </Link>
            {prodocExternal ? (
              <a
                href={prodocEntry}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View ProDoc
              </a>
            ) : (
              <Link
                href={prodocEntry}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View ProDoc
              </Link>
            )}
            <Link
              href="/proinsights"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ProInsights
            </Link>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Portfolio
            </Link>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            Public · No login
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

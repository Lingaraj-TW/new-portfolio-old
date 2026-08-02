import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { ProInsightsAutoRefresh } from "@/components/proinsights/ProInsightsAutoRefresh";
import { getProdocEntryHref, isExternalDocHref } from "@/lib/prodoc-urls";

export const metadata: Metadata = {
  title: "ProInsights — Live documentation analytics",
};

export default function ProInsightsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const prodocEntry = getProdocEntryHref();

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link
              href="/proinsights"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              ProInsights
            </Link>
            <Link
              href="/profeed"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ProFeed
            </Link>
            {isExternalDocHref(prodocEntry) ? (
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
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <ProInsightsAutoRefresh />
    </div>
  );
}

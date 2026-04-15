import Link from "next/link";
import type { ReactNode } from "react";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { ProInsightsAutoRefresh } from "@/components/ProInsightsAutoRefresh";

const PRODOC_URL = process.env.NEXT_PUBLIC_PRODOC_URL || "http://localhost:3001";

export default function ProInsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link
              href="/proinsights"
              className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              ProInsights
            </Link>
            <Link
              href="/profeed"
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              ProFeed
            </Link>
            <a
              href={PRODOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              View ProDoc
            </a>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <ProInsightsAutoRefresh />
    </div>
  );
}


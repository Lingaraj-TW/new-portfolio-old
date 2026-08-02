"use client";

import Link from "next/link";

import { getProdocEntryHref, isExternalDocHref } from "@/lib/prodoc-urls";

export function ProFeedInboxHeader({ isAdmin }: { isAdmin: boolean }) {
  const prodocEntry = getProdocEntryHref();
  const prodocExternal = isExternalDocHref(prodocEntry);

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
        <nav className="flex items-center gap-6">
          <Link href="/profeed/inbox" className="text-lg font-bold text-white">
            Pro<span className="text-purple-400">Feed</span>
          </Link>
          {prodocExternal ? (
            <a
              href={prodocEntry}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              View ProDoc
            </a>
          ) : (
            <Link
              href={prodocEntry}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              View ProDoc
            </Link>
          )}
          <Link
            href="/proinsights"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ProInsights
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Portfolio
          </Link>
          <Link
            href="/profeed"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Content feed
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              Admin
            </Link>
          ) : (
            <Link
              href="/admin/login?next=/profeed/inbox"
              className="text-xs text-slate-500 hover:text-purple-300"
            >
              Admin sign-in
            </Link>
          )}
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
            Public · No login required
          </span>
        </div>
      </div>
    </header>
  );
}

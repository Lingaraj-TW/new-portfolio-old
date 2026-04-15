import Link from "next/link";
import type { ReactNode } from "react";

import { FeedbackWidget } from "@/components/FeedbackWidget";
import { defaultDocSlug, listNavDocs } from "@/lib/docs/paths";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navDocs = listNavDocs();
  const homeSlug = defaultDocSlug();

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside className="border-b border-zinc-200 bg-zinc-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950 lg:w-64 lg:border-b-0 lg:border-r lg:px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            ProDoc
          </Link>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Documentation & work samples
          </p>
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <Link
              href="/"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ← Portfolio home
            </Link>
            <Link
              href="/#about"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              About me
            </Link>
            <Link
              href="/#contact"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Contact
            </Link>
            <Link
              href="/portal/login"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Customer portal
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {navDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
            >
              {doc.title}
            </Link>
          ))}
        </nav>
        {homeSlug ? (
          <Link
            href={`/docs/${homeSlug}`}
            className="mt-6 hidden text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 lg:inline"
          >
            First page →
          </Link>
        ) : null}
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">{children}</div>
      </div>
      <FeedbackWidget />
    </div>
  );
}

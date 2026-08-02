import Link from "next/link";
import type { ReactNode } from "react";

import { PortalLogoutButton } from "@/components/profeed/portal/PortalLogoutButton";
import { getProdocEntryHref } from "@/lib/prodoc-urls";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const docsHref = getProdocEntryHref();

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <Link
              href="/portal"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Customer feedback portal
            </Link>
            <Link
              href={docsHref}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/#experience"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
          <PortalLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

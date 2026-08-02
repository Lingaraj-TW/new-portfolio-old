"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export function AdminLayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Admin
            </Link>
            <Link
              href="/profeed"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Public feed
            </Link>
            <Link
              href="/profeed/inbox"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Feedback inbox
            </Link>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

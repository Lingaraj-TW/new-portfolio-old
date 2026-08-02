"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ProApiAssistant } from "@/components/proapi/ProApiAssistant";
import { ProApiNav } from "@/components/proapi/ProApiNav";
import { cn } from "@/lib/cn";

export function ProApiShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-proapi-portal
      className="proapi-portal min-h-screen bg-[#FAFAFC] text-slate-900"
    >
      <header className="sticky top-0 z-40 border-b border-[rgba(124,58,237,0.1)] bg-[#FAFAFC]/85 backdrop-blur-xl [-webkit-backdrop-filter:blur(12px)]">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/proapi" className="flex items-center gap-2 font-semibold text-[#7C3AED]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C3AED] text-xs font-bold text-white">
                API
              </span>
              <span className="hidden sm:inline">ProAPI Developer Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/products/proapi" className="hidden text-slate-500 hover:text-[#7C3AED] sm:inline">
              Product overview
            </Link>
            <Link href="/" className="text-slate-500 hover:text-[#7C3AED]">
              Portfolio
            </Link>
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 border-r border-[rgba(124,58,237,0.08)] bg-[#FAFAFC]/95 p-4 pt-20 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 lg:pt-6",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <ProApiNav />
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>

      <ProApiAssistant />
    </div>
  );
}

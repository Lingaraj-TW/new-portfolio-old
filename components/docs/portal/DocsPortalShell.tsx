"use client";

import { useState, type ReactNode } from "react";

import { DocsNavbar } from "@/components/docs/portal/DocsNavbar";
import { DocsSidebar } from "@/components/docs/portal/DocsSidebar";
import { DocsVersionBanner } from "@/components/docs/portal/DocsVersionBanner";
import { ProFeedWidget } from "@/components/profeed/ProFeedWidget";
import type { PortalNavData } from "@/lib/docs/nav-config";

type SearchItem = { slug: string; title: string; description?: string };

type Props = {
  children: ReactNode;
  searchIndex: SearchItem[];
  navData: PortalNavData;
};

export function DocsPortalShell({ children, searchIndex, navData }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="docs-portal-root flex min-h-screen flex-col">
      <DocsNavbar
        searchIndex={searchIndex}
        sidebarOpen={sidebarOpen}
        onOpenSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <DocsVersionBanner />
      <div className="flex min-h-0 flex-1">
        <DocsSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navData={navData}
        />
        <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--docs-bg)]">
          {children}
        </main>
      </div>
      <ProFeedWidget />
    </div>
  );
}

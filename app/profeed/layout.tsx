import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProFeedShell } from "@/components/profeed/ProFeedShell";
import { getProdocEntryHref } from "@/lib/prodoc-urls";

export const metadata: Metadata = {
  title: "ProFeed — Public content feed",
  description: "Public writing feed — no login required.",
};

export default function ProFeedLayout({ children }: { children: ReactNode }) {
  return (
    <ProFeedShell prodocEntry={getProdocEntryHref()}>{children}</ProFeedShell>
  );
}

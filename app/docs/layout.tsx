import type { ReactNode } from "react";

import { DocsPortalShell } from "@/components/docs/portal/DocsPortalShell";
import {
  buildPortalNavData,
  buildPortalSearchIndex,
} from "@/lib/docs/nav-data.server";

import "./portal.css";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const searchIndex = buildPortalSearchIndex();
  const navData = buildPortalNavData();

  return (
    <DocsPortalShell searchIndex={searchIndex} navData={navData}>
      {children}
    </DocsPortalShell>
  );
}

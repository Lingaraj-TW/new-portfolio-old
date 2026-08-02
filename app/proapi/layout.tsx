import type { Metadata } from "next";

import { ProApiShell } from "@/components/proapi/ProApiShell";

export const metadata: Metadata = {
  title: "ProAPI Developer Portal",
  description:
    "Interactive API documentation — explorer, OpenAPI import, try-it console, SDKs, and playground.",
};

export default function ProApiLayout({ children }: { children: React.ReactNode }) {
  return <ProApiShell>{children}</ProApiShell>;
}

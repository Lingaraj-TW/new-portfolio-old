import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLayoutChrome } from "@/components/admin/AdminLayoutChrome";

export const metadata: Metadata = {
  title: "Admin — ProFeed posts",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutChrome>{children}</AdminLayoutChrome>;
}

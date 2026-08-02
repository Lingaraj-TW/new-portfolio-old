import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

type MarketingPageShellProps = {
  children: ReactNode;
  headerTrailing?: ReactNode;
};

export function MarketingPageShell({
  children,
  headerTrailing,
}: MarketingPageShellProps) {
  return (
    <div
      data-portfolio-surface
      className="flex min-h-full max-w-full flex-col overflow-x-hidden bg-background text-foreground"
    >
      <Navbar trailing={headerTrailing} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">{children}</main>
      <Footer />
    </div>
  );
}

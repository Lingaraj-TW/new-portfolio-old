"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { DocsNavbarSearch } from "@/components/docs/portal/DocsNavbarSearch";
import { DocsVersionDropdown } from "@/components/docs/portal/DocsVersionDropdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ProDocBrandLogo } from "@/components/products/ProDocBrandLogo";
import { useDocsVersion } from "@/lib/docs/use-docs-version";
import { detectProductSection, PRODUCT_NAV } from "@/lib/docs/sidebar";
import { cn } from "@/lib/cn";

type SearchItem = { slug: string; title: string; description?: string };

type Props = {
  searchIndex: SearchItem[];
  onOpenSidebar?: () => void;
  sidebarOpen?: boolean;
};

export function DocsNavbar({ searchIndex, onOpenSidebar, sidebarOpen }: Props) {
  const pathname = usePathname();
  const { docSlug, docHref } = useDocsVersion();
  const activeProduct = detectProductSection(docSlug);
  const [productsOpen, setProductsOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: "Docs", href: docHref("getting-started/intro") },
      { label: "API", href: "/proapi/api-reference" },
      { label: "Samples", href: docHref("documentation-samples") },
    ],
    [docHref],
  );

  return (
    <header className="docs-navbar sticky top-0 z-30 flex h-[var(--docs-navbar-height)] items-center gap-4 border-b border-[var(--docs-border)] bg-[var(--docs-bg)] px-4">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--docs-border)] lg:hidden"
        onClick={onOpenSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      <Link
        href={docHref("getting-started/intro")}
        aria-label="ProDocs documentation home"
        className="flex shrink-0 items-center gap-2.5 text-[var(--docs-fg)] no-underline"
      >
        <ProDocBrandLogo variant="nav" alt="" />
        <span className="hidden font-semibold sm:inline">ProDocs</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => {
          const isDocsHome =
            link.label === "Docs" &&
            !activeProduct &&
            !docSlug.startsWith("documentation-samples") &&
            !docSlug.startsWith("reference/") &&
            docSlug !== "glossary" &&
            !docSlug.startsWith("platform-overview");
          const isActive =
            link.label === "Docs"
              ? isDocsHome ||
                docSlug === "getting-started/intro" ||
                docSlug.startsWith("getting-started/")
              : link.label === "API"
                ? pathname.startsWith("/proapi")
                : docSlug.startsWith("documentation-samples");
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--docs-primary)]"
                  : "text-[var(--docs-muted-fg)] hover:text-[var(--docs-fg)]",
              )}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="relative">
          <button
            type="button"
            onClick={() => setProductsOpen(!productsOpen)}
            className={cn(
              "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeProduct
                ? "text-[var(--docs-primary)]"
                : "text-[var(--docs-muted-fg)] hover:text-[var(--docs-fg)]",
            )}
          >
            Products
            <ChevronDown className="size-3.5 opacity-60" />
          </button>
          {productsOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close products menu"
                onClick={() => setProductsOpen(false)}
              />
              <ul className="absolute left-0 z-50 mt-1 min-w-[11rem] rounded-md border border-[var(--docs-border)] bg-[var(--docs-bg)] py-1 shadow-lg">
                {PRODUCT_NAV.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={docHref(p.entrySlug)}
                      className={cn(
                        "block px-3 py-2 text-sm hover:bg-[var(--docs-sidebar-bg)]",
                        activeProduct === p.id
                          ? "font-medium text-[var(--docs-primary)]"
                          : "text-[var(--docs-fg)]",
                      )}
                      onClick={() => setProductsOpen(false)}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </nav>

      <DocsNavbarSearch index={searchIndex} />

      <div className="ml-auto flex items-center gap-2">
        <DocsVersionDropdown />
        <ThemeToggle className="shrink-0" />
      </div>
    </header>
  );
}

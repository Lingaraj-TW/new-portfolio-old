"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  categoryContainsSlug,
  shouldExpandCategory,
  type PortalNavData,
  type ResolvedSidebarCategory,
  type ResolvedSidebarDoc,
  type ResolvedSidebarNode,
} from "@/lib/docs/nav-config";
import { useDocsVersion } from "@/lib/docs/use-docs-version";
import { detectProductSection, PRODUCT_NAV } from "@/lib/docs/sidebar";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  navData: PortalNavData;
};

function NavDocLink({
  href,
  title,
  active,
  depth,
  onNavigate,
}: {
  href: string;
  title: string;
  active: boolean;
  depth: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "block rounded-md py-1.5 text-sm leading-snug transition-colors",
        active
          ? "font-medium text-[var(--docs-primary)]"
          : "text-[var(--docs-fg)] hover:text-[var(--docs-primary)]",
      )}
      style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: "8px" }}
    >
      {title}
    </Link>
  );
}

function NavCategory({
  category,
  currentSlug,
  depth,
  onNavigate,
  docHref,
}: {
  category: ResolvedSidebarCategory;
  currentSlug: string;
  depth: number;
  onNavigate: () => void;
  docHref: (slug: string) => string;
}) {
  const containsActive = categoryContainsSlug(category, currentSlug);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const isOpen = manualOpen ?? shouldExpandCategory(category, currentSlug);

  if (!category.collapsible) {
    return (
      <div className="mb-1">
        <p
          className="mb-1 px-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--docs-muted-fg)]"
          style={{ paddingLeft: `${depth * 8}px` }}
        >
          {category.label}
        </p>
        <NavItems
          items={category.items}
          currentSlug={currentSlug}
          depth={depth + 1}
          onNavigate={onNavigate}
          docHref={docHref}
        />
      </div>
    );
  }

  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setManualOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-1 rounded-md py-1.5 text-left text-sm font-medium transition-colors hover:bg-[var(--docs-bg)]",
          containsActive
            ? "text-[var(--docs-fg)]"
            : "text-[var(--docs-muted-fg)]",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: "8px" }}
        aria-expanded={isOpen}
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            isOpen && "rotate-90",
          )}
        />
        {category.label}
      </button>
      {isOpen ? (
        <NavItems
          items={category.items}
          currentSlug={currentSlug}
          depth={depth + 1}
          onNavigate={onNavigate}
          docHref={docHref}
        />
      ) : null}
    </div>
  );
}

function NavItems({
  items,
  currentSlug,
  depth,
  onNavigate,
  docHref,
}: {
  items: ResolvedSidebarNode[];
  currentSlug: string;
  depth: number;
  onNavigate: () => void;
  docHref: (slug: string) => string;
}) {
  return (
    <nav className="flex flex-col">
      {items.map((item) =>
        item.type === "doc" ? (
          <NavDocLink
            key={item.slug}
            href={docHref(item.slug)}
            title={item.title}
            active={currentSlug === item.slug}
            depth={depth}
            onNavigate={onNavigate}
          />
        ) : (
          <NavCategory
            key={item.label}
            category={item}
            currentSlug={currentSlug}
            depth={depth}
            onNavigate={onNavigate}
            docHref={docHref}
          />
        ),
      )}
    </nav>
  );
}

function ProductSidebar({
  productId,
  items,
  currentSlug,
  onNavigate,
  docHref,
}: {
  productId: string;
  items: ResolvedSidebarDoc[];
  currentSlug: string;
  onNavigate: () => void;
  docHref: (slug: string) => string;
}) {
  const label = PRODUCT_NAV.find((p) => p.id === productId)?.label ?? productId;

  return (
    <div>
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--docs-muted-fg)]">
        {label}
      </p>
      <nav className="flex flex-col gap-0.5">
        {items.map((doc) => (
          <NavDocLink
            key={doc.slug}
            href={docHref(doc.slug)}
            title={doc.title}
            active={currentSlug === doc.slug}
            depth={0}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      {productId === "proapi" ? (
        <div className="mt-4 border-t border-[var(--docs-border)] pt-3">
          <Link
            href="/proapi/api-reference"
            onClick={onNavigate}
            className="block rounded-md px-2 py-1.5 text-sm text-[var(--docs-fg)] hover:text-[var(--docs-primary)]"
          >
            OpenAPI Reference
          </Link>
        </div>
      ) : null}
      <div className="mt-4 border-t border-[var(--docs-border)] pt-3">
        <Link
          href={docHref("getting-started/intro")}
          onClick={onNavigate}
          className="block px-2 text-xs text-[var(--docs-muted-fg)] hover:text-[var(--docs-primary)]"
        >
          ← Documentation home
        </Link>
      </div>
    </div>
  );
}

export function DocsSidebar({ open, onClose, navData }: Props) {
  const { docSlug, docHref } = useDocsVersion();
  const productId = detectProductSection(docSlug);
  const isProductView = productId !== null;

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "docs-sidebar fixed inset-y-[var(--docs-navbar-height)] left-0 z-20 w-[var(--docs-sidebar-width)] overflow-y-auto border-r border-[var(--docs-border)] bg-[var(--docs-sidebar-bg)] transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-2 py-4">
          {isProductView && productId ? (
            <ProductSidebar
              productId={productId}
              items={navData.productSidebars[productId]}
              currentSlug={docSlug}
              onNavigate={onClose}
              docHref={docHref}
            />
          ) : (
            navData.mainSidebar.map((section) => (
              <div key={section.label} className="mb-3">
                <NavCategory
                  category={section}
                  currentSlug={docSlug}
                  depth={0}
                  onNavigate={onClose}
                  docHref={docHref}
                />
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

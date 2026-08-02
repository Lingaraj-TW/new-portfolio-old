import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Code2,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { productNavItems, productsOverview } from "@/content/products";
import type { ProductNavItem } from "@/content/products/types";

export const metadata: Metadata = {
  title: "Products — ProDoc ecosystem",
  description: productsOverview.description,
};

const productIconMap = {
  FileText,
  Sparkles,
  MessageSquare,
  BarChart3,
  Code2,
} as const;

function getProductIcon(item: ProductNavItem) {
  return productIconMap[item.iconKey];
}

export default function ProductsPage() {
  return (
    <MarketingPageShell>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          {productsOverview.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {productsOverview.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {productsOverview.description}
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productNavItems.map((product) => {
          const Icon = getProductIcon(product);
          return (
            <Link
              key={product.slug}
              href={product.href}
              className="group rounded-xl border border-border-card bg-card p-5 transition hover:border-border-teal-hover"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {product.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </MarketingPageShell>
  );
}

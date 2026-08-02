import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { isExternalDocHref } from "@/lib/prodoc-urls";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LiveDemoLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  if (isExternalDocHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export type ProductCardData = {
  title: string;
  shortDescription: string;
  tags: string[];
  liveDemoHref: string;
  previewImage: string;
};

type ProductCardProps = {
  product: ProductCardData;
  visibleTagCount: number;
  animationDelayClass: string;
  anchorId?: string;
};

export function ProductCard({
  product,
  visibleTagCount,
  animationDelayClass,
  anchorId,
}: ProductCardProps) {
  const visibleTags = product.tags.slice(0, visibleTagCount);
  const hiddenCount = product.tags.length - visibleTagCount;

  return (
    <article
      id={anchorId}
      className={`animate-scale ${animationDelayClass} home-card group flex flex-col overflow-hidden scroll-mt-28 transition hover:border-border-teal-hover`}
    >
      <div className="border-b border-border">
        <div className="flex items-center gap-1.5 border-b border-border bg-elevated px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" title="Close" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" title="Minimize" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" title="Zoom" aria-hidden />
          <span className="ml-2 truncate text-[10px] text-muted-foreground">
            {product.title.toLowerCase()} · snapshot
          </span>
        </div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
          <Image
            src={product.previewImage}
            alt={`${product.title} product preview`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{product.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm italic leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground/85"
            >
              {tag}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
              +{hiddenCount}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-1">
          <LiveDemoLink
            href={product.liveDemoHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-sm transition hover:bg-accent/90 hover:border-accent/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            <GlobeIcon className="shrink-0 opacity-90" />
            Live demo
            {isExternalDocHref(product.liveDemoHref) ? (
              <span className="sr-only"> (opens in new tab)</span>
            ) : null}
          </LiveDemoLink>
        </div>
      </div>
    </article>
  );
}

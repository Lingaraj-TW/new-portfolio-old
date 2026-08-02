"use client";

import { LogoImage } from "@/components/products/LogoImage";
import { cn } from "@/lib/cn";

const LOGO_SRC = "/images/prodoc-logo.png";

type Props = {
  /** Hero = landing page ProDoc section; nav = docs portal navbar */
  variant?: "hero" | "nav";
  className?: string;
  alt?: string;
};

/**
 * ProDoc mark — same PNG as homepage ProDocHero.
 * Nav variant strips the PNG black matte via canvas (readable on light + dark).
 */
export function ProDocBrandLogo({
  variant = "nav",
  className,
  alt = "ProDoc",
}: Props) {
  if (variant === "nav") {
    return (
      <LogoImage
        src={LOGO_SRC}
        alt={alt}
        height={36}
        className={cn("docs-brand-logo shrink-0", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt={alt}
      decoding="async"
      className={cn(
        "prodoc-hero-svg block h-auto w-24 object-contain sm:w-28 md:w-32",
        className,
      )}
      style={{
        animation: "fadeInLogo 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both",
      }}
    />
  );
}

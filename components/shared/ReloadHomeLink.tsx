"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { navigateToHome } from "@/lib/navigate-home";

type ReloadHomeLinkProps = ComponentProps<typeof Link>;

export function ReloadHomeLink({
  href = "/",
  onClick,
  ...props
}: ReloadHomeLinkProps) {
  const homeHref = typeof href === "string" ? href : "/";

  return (
    <Link
      href={homeHref}
      {...props}
      onClick={(event) => {
        navigateToHome(event, homeHref);
        onClick?.(event);
      }}
    />
  );
}

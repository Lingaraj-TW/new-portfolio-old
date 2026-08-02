import type { ReactNode } from "react";

import {
  BookOpen,
  Braces,
  ClipboardCheck,
  Code2,
  FileCode2,
  GitBranch,
  Layers,
  Network,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { TechIconKey } from "@/content/skills";

type BrandIconProps = {
  icon: TechIconKey;
  className?: string;
};

/** Inline SVG wrapper — for hand-crafted paths already embedded in this file. */
function SvgIcon({
  children,
  className,
  viewBox = "0 0 24 24",
}: {
  children: ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("h-6 w-6 shrink-0", className)}
      aria-hidden
      fill="currentColor"
    >
      {children}
    </svg>
  );
}

/**
 * Image from the simpleicons CDN.
 * Supports optional light + dark hex overrides via the /{slug}/{hex}/{darkHex} API.
 */
function CdnIcon({
  slug,
  hex,
  darkHex,
  className,
}: {
  slug: string;
  hex?: string;
  darkHex?: string;
  className?: string;
}) {
  const src =
    hex && darkHex
      ? `https://cdn.simpleicons.org/${slug}/${hex}/${darkHex}`
      : hex
        ? `https://cdn.simpleicons.org/${slug}/${hex}`
        : `https://cdn.simpleicons.org/${slug}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={24}
      height={24}
      className={cn("h-6 w-6 shrink-0 object-contain", className)}
    />
  );
}

/** Text monogram badge for tools without a public vector icon. */
function MonogramIcon({
  label,
  className,
  accentClass,
}: {
  label: string;
  className?: string;
  accentClass?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold tracking-tight",
        accentClass ?? "bg-accent/12 text-accent",
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  );
}

function MarkdownIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M22.269 4.985H1.73A1.73 1.73 0 0 0 0 6.715v10.57a1.73 1.73 0 0 0 1.73 1.73h20.538a1.73 1.73 0 0 0 1.731-1.73V6.715a1.73 1.73 0 0 0-1.73-1.73zM4.192 15.99V8.01l2.835 4.764 2.835-4.764v7.98H8.43l-2.122-3.58-2.122 3.58H4.192zm7.383 0V8.01h2.299v7.98H11.575zm8.813 0l-3.343-3.89 3.343-3.89h-2.752l-3.343 3.89 3.343 3.89h2.752z" />
    </SvgIcon>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.177 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </SvgIcon>
  );
}

function OpenApiIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4a9.6 9.6 0 1 1 0 19.2 9.6 9.6 0 0 1 0-19.2zm-1.2 4.8h2.4v9.6h-2.4V7.2zm4.8 0h2.4v9.6h-2.4V7.2z" />
    </SvgIcon>
  );
}

const lucideMap: Partial<Record<TechIconKey, LucideIcon>> = {
  "docs-as-code": Code2,
  xml: FileCode2,
  diataxis: BookOpen,
  "information-architecture": Network,
  agile: RefreshCw,
  editorial: ClipboardCheck,
  governance: ShieldCheck,
  json: Braces,
  yaml: Layers,
};

export function BrandIcon({ icon, className }: BrandIconProps) {
  const wrap = (node: ReactNode, tone?: string) => (
    <span
      className={cn(
        "tech-stack-icon flex items-center justify-center",
        tone,
        className,
      )}
    >
      {node}
    </span>
  );

  switch (icon) {
    // ── Real logos via simpleicons CDN ───────────────────────────────────────
    case "confluence":
      return wrap(<CdnIcon slug="confluence" hex="172B4D" darkHex="FFFFFF" />);
    case "docusaurus":
      return wrap(<CdnIcon slug="docusaurus" hex="3ECC5F" />);
    case "swagger":
      return wrap(<CdnIcon slug="swagger" hex="85EA2D" />);
    case "postman":
      return wrap(<CdnIcon slug="postman" hex="FF6C37" />);
    case "github":
      return wrap(<GitHubIcon />, "text-foreground");
    case "jira":
      return wrap(<CdnIcon slug="jira" hex="0052CC" />);
    case "vscode":
      return wrap(<CdnIcon slug="visualstudiocode" hex="007ACC" />);
    case "canva":
      return wrap(<CdnIcon slug="canva" hex="00C4CC" />);
    case "miro":
      return wrap(<CdnIcon slug="miro" hex="050038" darkHex="FFD02F" />);
    case "html5":
      return wrap(<CdnIcon slug="html5" hex="E34F26" />);
    case "css3":
      return wrap(<CdnIcon slug="css3" hex="1572B6" />);
    case "azure-devops":
      return wrap(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/tech-stack/azure-devops.png?v=2"
          alt=""
          aria-hidden
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
        />,
      );

    // ── Inline SVGs ──────────────────────────────────────────────────────────
    case "markdown":
      return wrap(<MarkdownIcon />, "text-foreground");
    case "openapi":
      return wrap(<OpenApiIcon />, "text-[#6BA539]");

    // ── Text monograms ───────────────────────────────────────────────────────
    case "document360":
      return wrap(
        <MonogramIcon
          label="D360"
          accentClass="bg-[#1e3a8a]/10 text-[#1e40af] dark:text-[#93c5fd]"
        />,
      );
    case "madcap-flare":
      return wrap(
        <MonogramIcon
          label="MC"
          accentClass="bg-[#ea580c]/12 text-[#c2410c] dark:text-[#fdba74]"
        />,
      );
    case "robohelp":
      return wrap(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/tech-stack/robohelp.png?v=2"
          alt=""
          aria-hidden
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 object-contain"
        />,
      );
    case "arbortext":
      return wrap(
        <MonogramIcon label="ATX" accentClass="bg-accent/12 text-accent" />,
      );
    case "ms-word":
      return wrap(
        <MonogramIcon
          label="W"
          accentClass="bg-[#185ABD]/10 text-[#185ABD] dark:text-[#93c5fd]"
        />,
      );
    case "snagit":
      return wrap(
        <MonogramIcon
          label="SN"
          accentClass="bg-[#ea580c]/10 text-[#c2410c] dark:text-[#fdba74]"
        />,
      );
    case "camtasia":
      return wrap(
        <MonogramIcon
          label="CAM"
          className="w-8 text-[8px]"
          accentClass="bg-[#16a34a]/10 text-[#15803d] dark:text-[#86efac]"
        />,
      );
    case "photoshop":
      return wrap(
        <MonogramIcon
          label="Ps"
          accentClass="bg-[#001e36] text-[#31a8ff]"
        />,
      );
    case "ms-visio":
      return wrap(
        <MonogramIcon
          label="VIO"
          className="text-[8px]"
          accentClass="bg-[#3b0764]/10 text-[#6b21a8] dark:text-[#d8b4fe]"
        />,
      );
    case "dita":
      return wrap(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/tech-stack/dita.png?v=3"
          alt=""
          aria-hidden
          width={72}
          height={24}
          className="h-6 w-auto max-w-[4.5rem] shrink-0 rounded-md bg-white/95 object-contain p-0.5 dark:bg-white/95"
        />,
      );

    // ── Lucide icons (methodologies + data languages) ────────────────────────
    case "docs-as-code":
    case "xml":
    case "diataxis":
    case "information-architecture":
    case "agile":
    case "editorial":
    case "governance":
    case "json":
    case "yaml": {
      const Lucide = lucideMap[icon] ?? GitBranch;
      return wrap(<Lucide className="h-6 w-6 text-accent" strokeWidth={1.75} />);
    }

    default:
      return wrap(<GitBranch className="h-6 w-6 text-accent" strokeWidth={1.75} />);
  }
}

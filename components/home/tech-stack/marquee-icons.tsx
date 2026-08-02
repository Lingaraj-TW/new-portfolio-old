import { Code2, FileCode2 } from "lucide-react";

import { cn } from "@/lib/cn";

/** Logo inside frosted mini-container (h-7 w-7 slot) */
export const MARQUEE_LOGO_CLASS =
  "h-4 w-4 shrink-0 object-contain flex-shrink-0";

/** Local brand assets for marquee pills */
const STACK_LOGOS = {
  document360: "/images/tech-stack/document360.png",
  "madcap-flare": "/images/tech-stack/madcap-flare.png",
  robohelp: "/images/tech-stack/robohelp.png?v=2",
  "ms-word": "/images/tech-stack/microsoft-365.png",
  arbortext: "/images/tech-stack/arbortext.png",
  "azure-devops": "/images/tech-stack/azure-devops.png?v=2",
  vscode: "/images/tech-stack/vscode.png",
  cursor: "/images/tech-stack/cursor.png",
  chatgpt: "/images/tech-stack/chatgpt.svg",
  "claude-ai": "/images/tech-stack/claude-ai.png",
  snagit: "/images/tech-stack/snagit.png?v=4",
  camtasia: "/images/tech-stack/camtasia.png?v=2",
  canva: "/images/tech-stack/canva.png",
  "ms-visio": "/images/tech-stack/ms-visio.png",
  dita: "/images/tech-stack/dita.png?v=3",
} as const;

type MarqueePillIconProps = {
  toolId: string;
  className?: string;
};

function AssetLogo({
  src,
  className,
  invertOnLight,
  invertDark,
  wide,
}: {
  src: string;
  className?: string;
  /** White knock-out logos: invert on light pills, native on dark */
  invertOnLight?: boolean;
  invertDark?: boolean;
  /** Wide wordmarks inside the frosted logo slot */
  wide?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={wide ? 40 : 16}
      height={16}
      className={cn(
        MARQUEE_LOGO_CLASS,
        wide && "h-5 w-auto max-h-5 max-w-[3rem]",
        invertOnLight && "invert dark:invert-0",
        invertDark && "dark:invert",
        className,
      )}
      style={{ background: "transparent" }}
    />
  );
}

function CdnLogo({
  src,
  invertDark,
  className,
}: {
  src: string;
  invertDark?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={16}
      height={16}
      className={cn(MARQUEE_LOGO_CLASS, invertDark && "dark:invert", className)}
    />
  );
}

function InitialsLogo({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        MARQUEE_LOGO_CLASS,
        "flex items-center justify-center rounded text-xs font-bold",
        className,
      )}
      aria-hidden
    >
      {text}
    </span>
  );
}

/** Marquee pill logos — CDN img or initials per product spec. */
export function MarqueePillIcon({ toolId, className }: MarqueePillIconProps) {
  switch (toolId) {
    case "confluence":
      return (
        <CdnLogo
          src="/images/tech-stack/confluence-icon.svg"
          className={className}
        />
      );
    case "docusaurus":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/docusaurus"
          className={className}
        />
      );
    case "document360":
      return (
        <AssetLogo src={STACK_LOGOS.document360} className={className} />
      );
    case "madcap-flare":
      return (
        <AssetLogo
          src={STACK_LOGOS["madcap-flare"]}
          className={className}
        />
      );
    case "robohelp":
      return (
        <AssetLogo src={STACK_LOGOS.robohelp} className={className} />
      );
    case "ms-word":
      return (
        <AssetLogo src={STACK_LOGOS["ms-word"]} className={className} />
      );
    case "arbortext":
      return (
        <AssetLogo
          src={STACK_LOGOS.arbortext}
          invertOnLight
          className={className}
        />
      );
    case "swagger":
      return (
        <CdnLogo src="https://cdn.simpleicons.org/swagger" className={className} />
      );
    case "postman":
      return (
        <CdnLogo src="https://cdn.simpleicons.org/postman" className={className} />
      );
    case "github":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/github"
          invertDark
          className={className}
        />
      );
    case "jira":
      return (
        <CdnLogo src="https://cdn.simpleicons.org/jira" className={className} />
      );
    case "vscode":
      return (
        <AssetLogo src={STACK_LOGOS.vscode} className={className} />
      );
    case "azure-devops":
      return (
        <AssetLogo
          src={STACK_LOGOS["azure-devops"]}
          className={className}
        />
      );
    case "git":
      return (
        <CdnLogo src="https://cdn.simpleicons.org/git" className={className} />
      );
    case "markdown":
    case "markdown-lang":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/markdown"
          invertDark
          className={className}
        />
      );
    case "docs-as-code":
      return (
        <Code2
          className={cn(MARQUEE_LOGO_CLASS, "text-accent", className)}
          strokeWidth={1.75}
          aria-hidden
        />
      );
    case "openapi":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/openapiinitiative"
          className={className}
        />
      );
    case "xml":
    case "xml-lang":
      return (
        <FileCode2
          className={cn(MARQUEE_LOGO_CLASS, "text-accent", className)}
          strokeWidth={1.75}
          aria-hidden
        />
      );
    case "dita":
      return (
        <AssetLogo
          src={STACK_LOGOS.dita}
          wide
          className={cn("brightness-100 dark:brightness-110", className)}
        />
      );
    case "claude-ai":
      return (
        <AssetLogo src={STACK_LOGOS["claude-ai"]} className={className} />
      );
    case "chatgpt":
      return (
        <AssetLogo
          src={STACK_LOGOS.chatgpt}
          invertDark
          className={className}
        />
      );
    case "grammarly":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/grammarly"
          className={className}
        />
      );
    case "notion-ai":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/notion"
          invertDark
          className={className}
        />
      );
    case "cursor":
      return (
        <AssetLogo src={STACK_LOGOS.cursor} className={className} />
      );
    case "github-copilot":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/githubcopilot"
          invertDark
          className={className}
        />
      );
    case "snagit":
      return <AssetLogo src={STACK_LOGOS.snagit} className={className} />;
    case "camtasia":
      return <AssetLogo src={STACK_LOGOS.camtasia} className={className} />;
    case "canva":
      return <AssetLogo src={STACK_LOGOS.canva} className={className} />;
    case "miro":
      return (
        <CdnLogo
          src="https://cdn.simpleicons.org/miro"
          className={className}
        />
      );
    case "photoshop":
      return (
        <InitialsLogo
          text="Ps"
          className={cn("bg-[#001e36]/90 text-[#31a8ff]", className)}
        />
      );
    case "ms-visio":
      return (
        <AssetLogo src={STACK_LOGOS["ms-visio"]} className={className} />
      );
    default:
      return (
        <InitialsLogo
          text="?"
          className={cn("bg-muted text-muted-foreground", className)}
        />
      );
  }
}

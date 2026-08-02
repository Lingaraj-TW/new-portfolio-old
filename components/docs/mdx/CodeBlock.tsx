"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
};

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children ?? "");
  }
  return "";
}

export function CodeBlock({ children, className, title }: Props) {
  const [copied, setCopied] = useState(false);
  const text = extractText(children).replace(/\n$/, "");

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="not-prose group relative my-4">
      {title ? (
        <div className="rounded-t-lg border border-b-0 border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      ) : null}
      <div className="relative">
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="absolute right-2 top-2 rounded-md border border-border bg-background/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
        <pre
          className={[
            "overflow-x-auto rounded-xl border border-border bg-foreground p-4 text-sm text-background dark:bg-muted dark:text-foreground",
            title ? "rounded-t-none" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

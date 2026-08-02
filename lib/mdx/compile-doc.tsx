import type { MDXComponents } from "mdx/types";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Admonition } from "@/components/docs/mdx/Admonition";
import { CodeBlock } from "@/components/docs/mdx/CodeBlock";
import { Collapse } from "@/components/docs/mdx/Collapse";
import { Mermaid } from "@/components/docs/mdx/Mermaid";
import { Screenshot } from "@/components/docs/mdx/Screenshot";
import { Tab, Tabs } from "@/components/docs/mdx/Tabs";
import { DocImage } from "@/components/docs/mdx/ZoomImage";
import { VideoEmbed } from "@/components/docs/mdx/VideoEmbed";

function heading(
  Tag: "h1" | "h2" | "h3" | "h4",
  className: string,
): (props: HTMLAttributes<HTMLHeadingElement>) => ReactElement {
  return function DocHeading(props: HTMLAttributes<HTMLHeadingElement>) {
    const { className: extra, ...rest } = props;
    return (
      <Tag {...rest} className={[className, extra].filter(Boolean).join(" ")} />
    );
  };
}

function getCodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getCodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return getCodeText(props?.children ?? "");
  }
  return "";
}

function DocPre(props: React.ComponentPropsWithoutRef<"pre">) {
  const child = props.children;
  if (
    child &&
    typeof child === "object" &&
    "props" in child &&
    typeof (child as { props?: { className?: string } }).props?.className ===
      "string"
  ) {
    const codeProps = (child as { props: { className?: string; children?: ReactNode } })
      .props;
    const lang = codeProps.className?.replace("language-", "") ?? "";
    const text = getCodeText(codeProps.children);

    if (lang === "mermaid") {
      return <Mermaid chart={text} />;
    }

    return <CodeBlock>{text}</CodeBlock>;
  }

  return (
    <pre
      {...props}
      className="overflow-x-auto rounded-xl border border-[var(--docs-border)] bg-[var(--docs-code-bg)] p-4 text-sm text-[var(--docs-fg)]"
    />
  );
}

const docComponents = {
  h1: heading(
    "h1",
    "scroll-mt-28 text-3xl font-bold tracking-tight text-[var(--docs-fg)]",
  ),
  h2: heading(
    "h2",
    "scroll-mt-28 mt-12 border-b border-[var(--docs-border)] pb-2 text-2xl font-semibold tracking-tight text-[var(--docs-fg)]",
  ),
  h3: heading(
    "h3",
    "scroll-mt-28 mt-8 text-xl font-semibold tracking-tight text-[var(--docs-fg)]",
  ),
  h4: heading(
    "h4",
    "scroll-mt-28 mt-6 text-lg font-semibold tracking-tight text-[var(--docs-fg)]",
  ),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className="font-medium text-[var(--docs-primary)] underline decoration-[var(--docs-border)] underline-offset-4 hover:text-[var(--docs-primary-hover)] hover:decoration-[var(--docs-primary)]"
    />
  ),
  code: (props: React.ComponentPropsWithoutRef<"code">) => (
    <code
      {...props}
      className="rounded border border-[var(--docs-border)] bg-[var(--docs-code-bg)] px-1.5 py-0.5 text-[0.9em] text-[var(--docs-fg)]"
    />
  ),
  pre: DocPre,
  Admonition,
  Note: (props: Omit<React.ComponentProps<typeof Admonition>, "type">) => (
    <Admonition type="note" {...props} />
  ),
  Tip: (props: Omit<React.ComponentProps<typeof Admonition>, "type">) => (
    <Admonition type="tip" {...props} />
  ),
  Warning: (props: Omit<React.ComponentProps<typeof Admonition>, "type">) => (
    <Admonition type="warning" {...props} />
  ),
  Info: (props: Omit<React.ComponentProps<typeof Admonition>, "type">) => (
    <Admonition type="info" {...props} />
  ),
  Tabs,
  Tab,
  Mermaid,
  Collapse,
  CodeBlock,
  Screenshot,
  VideoEmbed,
  img: DocImage,
} satisfies MDXComponents;

export async function compileDocMdx(source: string) {
  return compileMDX({
    source,
    components: docComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor-link"],
              },
            },
          ],
        ],
      },
    },
  });
}

export function estimateReadingMinutes(source: string): number {
  const text = source.replace(/^---[\s\S]*?---/, "").replace(/[#*`[\]()>-]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

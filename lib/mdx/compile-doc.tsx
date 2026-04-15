import type { MDXComponents } from "mdx/types";
import type { HTMLAttributes, ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function heading(
  Tag: "h1" | "h2" | "h3" | "h4",
  className: string,
): (props: HTMLAttributes<HTMLHeadingElement>) => ReactElement {
  return function DocHeading(props: HTMLAttributes<HTMLHeadingElement>) {
    const { className: extra, ...rest } = props;
    return (
      <Tag
        {...rest}
        className={[className, extra].filter(Boolean).join(" ")}
      />
    );
  };
}

const docComponents = {
  h1: heading("h1", "scroll-mt-28 text-3xl font-semibold tracking-tight"),
  h2: heading(
    "h2",
    "scroll-mt-28 mt-12 border-b border-zinc-200 pb-2 text-2xl font-semibold tracking-tight dark:border-zinc-800",
  ),
  h3: heading("h3", "scroll-mt-28 mt-8 text-xl font-semibold tracking-tight"),
  h4: heading("h4", "scroll-mt-28 mt-6 text-lg font-semibold tracking-tight"),
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-400"
    />
  ),
  code: (props: React.ComponentPropsWithoutRef<"code">) => (
    <code
      {...props}
      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.9em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
    />
  ),
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm text-zinc-50 dark:border-zinc-800"
    />
  ),
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

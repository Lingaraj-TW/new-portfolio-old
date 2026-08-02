import { ImageIcon } from "lucide-react";

type Props = {
  alt: string;
  caption?: string;
};

export function Screenshot({ alt, caption }: Props) {
  return (
    <figure className="not-prose my-6">
      <div className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 px-6 text-center">
        <ImageIcon className="mb-2 size-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-muted-foreground">{alt}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Screenshot placeholder</p>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

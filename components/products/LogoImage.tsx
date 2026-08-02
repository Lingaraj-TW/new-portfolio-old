"use client";

import { useEffect, useRef } from "react";

type LogoImageProps = {
  src: string;
  alt?: string;
  height?: number;
  /** 0–1: render only the leftmost fraction of the image (crops the wordmark) */
  iconCrop?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders a PNG logo on a <canvas>, stripping near-black pixels so the
 * background box is permanently removed — no mix-blend-mode stacking issues.
 *
 * CSS sizing quirk: canvas `width:auto` uses intrinsic pixel width, not
 * aspect-ratio-scaled from height. We fix this by setting canvas.style.width
 * explicitly inside the onload callback once we know the real dimensions.
 */
export function LogoImage({
  src,
  alt = "Logo",
  height = 80,
  iconCrop,
  className = "",
  style,
}: LogoImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      const cropW = iconCrop ? Math.round(srcW * iconCrop) : srcW;

      // Set drawing buffer dimensions
      canvas.width = cropW;
      canvas.height = srcH;

      // Explicitly set CSS dimensions so the canvas renders at the correct
      // visual size (canvas `width:auto` would use intrinsic px, not scale ratio)
      const cssHeight = height;
      const cssWidth = Math.round(cssHeight * (cropW / srcH));
      canvas.style.height = `${cssHeight}px`;
      canvas.style.width = `${cssWidth}px`;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Strip near-black pixels (removes the PNG background box)
      const imageData = ctx.getImageData(0, 0, cropW, srcH);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r < 40 && g < 40 && b < 40) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
  }, [src, iconCrop, height]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        height: `${height}px`,
        minHeight: `${height}px`,
        minWidth: `${Math.round(height * (iconCrop ?? 1))}px`,
        width: "auto",
        ...style,
      }}
    />
  );
}

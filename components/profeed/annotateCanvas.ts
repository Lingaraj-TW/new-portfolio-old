/**
 * Draw freehand strokes on a second canvas; merge with base image for export.
 */
export function mergeImageWithOverlay(
  baseDataUrl: string,
  overlayCanvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const out = document.createElement("canvas");
      out.width = img.naturalWidth;
      out.height = img.naturalHeight;
      const ctx = out.getContext("2d");
      if (!ctx) {
        reject(new Error("no context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      ctx.drawImage(
        overlayCanvas,
        0,
        0,
        overlayCanvas.width,
        overlayCanvas.height,
        0,
        0,
        out.width,
        out.height,
      );
      out.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("toBlob"));
        },
        "image/png",
        0.92,
      );
    };
    img.onerror = () => reject(new Error("image load"));
    img.src = baseDataUrl;
  });
}

import { toPng } from "html-to-image";

const COLOR_PROPS = [
  "color",
  "background",
  "background-color",
  "background-image",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "column-rule-color",
  "caret-color",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
] as const;

/**
 * Walk source + cloned trees in parallel and copy resolved colors as inline styles
 * so html2canvas's parser never sees `lab()` / `oklch()` from stylesheets.
 */
function inlineResolvedColors(source: Element, clone: Element) {
  if (source instanceof HTMLElement && clone instanceof HTMLElement) {
    const cs = getComputedStyle(source);
    for (const prop of COLOR_PROPS) {
      const v = cs.getPropertyValue(prop);
      if (v && v.length > 0) {
        try {
          clone.style.setProperty(prop, v);
        } catch {
          /* ignore */
        }
      }
    }
    if (
      source instanceof HTMLImageElement &&
      clone instanceof HTMLImageElement
    ) {
      try {
        clone.removeAttribute("crossorigin");
      } catch {
        /* ignore */
      }
    }
  }
  const sChildren = source.children;
  const cChildren = clone.children;
  for (let i = 0; i < sChildren.length; i++) {
    if (cChildren[i]) {
      inlineResolvedColors(sChildren[i], cChildren[i]);
    }
  }
}

/**
 * Prefer `html-to-image` (SVG) — avoids most `lab()` / `oklch()` parse errors with Tailwind 4.
 * Falls back to `html2canvas` with inlined computed colors.
 */
export async function captureElementToPngDataUrl(
  el: HTMLElement,
  scrollY: number,
): Promise<string> {
  const pr = Math.min(
    2,
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
  );

  let lastError: unknown;
  try {
    // SVG-based export; browser resolves `lab()` / `oklch()` — avoids html2canvas parser limits.
    return await toPng(el, {
      cacheBust: true,
      pixelRatio: pr,
    });
  } catch (e) {
    lastError = e;
  }

  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      scale: pr,
      logging: false,
      scrollX: 0,
      scrollY: -scrollY,
      onclone: (_documentClone, elementClone) => {
        inlineResolvedColors(el, elementClone);
      },
    });
    return canvas.toDataURL("image/png");
  } catch (e) {
    lastError = e;
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("Screen capture failed.");
}

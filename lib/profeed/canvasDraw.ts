/**
 * 2D canvas helpers for snapshot annotation (pen, highlighter, shapes, arrow).
 */

export type AnnotationTool = "pen" | "highlighter" | "rectangle" | "arrow";

export function applyToolStyle(
  ctx: CanvasRenderingContext2D,
  tool: AnnotationTool,
  canvasW: number,
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const base = Math.max(2, canvasW / 400);
  switch (tool) {
    case "pen":
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgb(220, 38, 38)";
      ctx.lineWidth = base * 2.2;
      break;
    case "highlighter":
      // Snipping-style: one stroke() per drag; wide semi-transparent yellow (see drawHighlighterPath).
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = base * 11;
      ctx.strokeStyle = "rgba(255, 230, 40, 0.45)";
      ctx.fillStyle = "rgba(255, 230, 40, 0.45)";
      break;
    case "rectangle":
    case "arrow":
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgb(37, 99, 235)";
      ctx.fillStyle = "rgb(37, 99, 235)";
      ctx.lineWidth = base * 2.5;
      break;
    default:
      break;
  }
}

/**
 * Windows Snipping Tool–like highlighter: one path, one stroke per gesture (avoids stacked-segment opacity).
 */
export function drawHighlighterPath(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  canvasW: number,
) {
  if (points.length === 0) return;
  ctx.save();
  applyToolStyle(ctx, "highlighter", canvasW);
  const w = ctx.lineWidth;
  if (points.length === 1) {
    const { x, y } = points[0];
    ctx.beginPath();
    ctx.arc(x, y, w * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  const d = Math.hypot(x1 - x0, y1 - y0) || 1;
  const lineW = ctx.lineWidth;
  // Head must be clearly larger than the shaft (was ~same size on large canvas exports).
  const head = Math.max(lineW * 2.8, Math.min(48, 0.035 * d));
  const angle = Math.atan2(y1 - y0, x1 - x0);
  const color =
    ctx.strokeStyle && typeof ctx.strokeStyle === "string"
      ? ctx.strokeStyle
      : "rgb(37, 99, 235)";

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  // Stop the shaft at the head base; avoid overshooting on very short drags.
  const inset = Math.min(lineW * 0.65, d * 0.4);
  const bx = x1 - inset * Math.cos(angle);
  const by = y1 - inset * Math.sin(angle);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(
    x1 - head * Math.cos(angle - Math.PI / 6),
    y1 - head * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x1 - head * Math.cos(angle + Math.PI / 6),
    y1 - head * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawRectStroke(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  const x = Math.min(x0, x1);
  const y = Math.min(y0, y1);
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  if (w < 1 && h < 1) return;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.stroke();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: "rectangle" | "arrow",
  canvasW: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  if (Math.hypot(x1 - x0, y1 - y0) < 2) return;
  ctx.save();
  applyToolStyle(ctx, tool, canvasW);
  if (tool === "rectangle") {
    drawRectStroke(ctx, x0, y0, x1, y1);
  } else {
    drawArrow(ctx, x0, y0, x1, y1);
  }
  ctx.restore();
}

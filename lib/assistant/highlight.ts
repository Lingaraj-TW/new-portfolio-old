const HIGHLIGHT_CLASS = "assistant-target-highlight";
let clearTimer: ReturnType<typeof setTimeout> | null = null;

export function clearSectionHighlight() {
  document
    .querySelectorAll(`.${HIGHLIGHT_CLASS}`)
    .forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));
  if (clearTimer) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
}

export function highlightSection(targetId: string, durationMs = 2600) {
  clearSectionHighlight();
  const el = document.getElementById(targetId);
  if (!el) return;

  el.classList.add(HIGHLIGHT_CLASS);
  clearTimer = setTimeout(() => {
    el.classList.remove(HIGHLIGHT_CLASS);
    clearTimer = null;
  }, durationMs);
}

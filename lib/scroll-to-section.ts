import type { MouseEvent } from "react";

/** Smooth-scroll to a section id (homepage uses `.page-wrapper` as scroll root). */
export function scrollToSectionId(
  id: string,
  behavior: ScrollBehavior = "smooth",
): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const wrapper = document.querySelector(".page-wrapper") as HTMLElement | null;
  if (wrapper) {
    const shell = document.querySelector(".site-header-shell");
    const headerOffset = shell
      ? shell.getBoundingClientRect().height
      : window.innerWidth < 768
        ? 92
        : 116;
    const rect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const top =
      wrapper.scrollTop + (rect.top - wrapperRect.top) - headerOffset;
    wrapper.scrollTo({ top: Math.max(0, top), behavior });
    return true;
  }

  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

export function handleHomeSectionScroll(
  event: MouseEvent<HTMLAnchorElement>,
  id: string,
): void {
  if (typeof window === "undefined" || window.location.pathname !== "/") return;
  event.preventDefault();
  scrollToSectionId(id);
  window.history.replaceState(null, "", `#${id}`);
}

import type { MouseEvent } from "react";

/** Full navigation to homepage top — reloads when already on `/`. */
export function navigateToHome(
  event: MouseEvent<HTMLAnchorElement>,
  homeHref = "/",
): void {
  event.preventDefault();

  const onHome =
    window.location.pathname === homeHref || window.location.pathname === "/";

  if (onHome) {
    window.history.replaceState(null, "", homeHref);
    window.location.reload();
    return;
  }

  window.location.assign(homeHref);
}

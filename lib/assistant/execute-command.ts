import { scrollToSectionId } from "@/lib/scroll-to-section";

import type { AssistantCommandId } from "./types";
import { highlightSection } from "./highlight";

export const ASSISTANT_OPEN_PRODUCTS = "prodoc-assistant:open-products";

function isHomePage(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path === "/" || path === "";
}

function syncHash(sectionId: string) {
  if (!isHomePage()) return;
  window.history.replaceState(null, "", `#${sectionId}`);
}

function navigateToHomeSection(sectionId: string) {
  if (!isHomePage()) {
    window.location.assign(`/#${sectionId}`);
    return;
  }

  const scrolled = scrollToSectionId(sectionId);
  if (scrolled) {
    syncHash(sectionId);
    highlightSection(sectionId);
  } else {
    window.location.assign(`/#${sectionId}`);
  }
}

function navigateToPath(path: string) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === path) return;
  window.location.assign(path);
}

export function openProductsMenu() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ASSISTANT_OPEN_PRODUCTS));
}

export function executeAssistantCommand(commandId: AssistantCommandId): void {
  switch (commandId) {
    case "explore-prodoc":
      if (!isHomePage()) {
        navigateToPath("/products/prodoc");
        return;
      }
      navigateToHomeSection("prodoc-demo");
      break;
    case "show-api-docs":
      navigateToHomeSection("portfolio");
      break;
    case "view-experience":
      navigateToHomeSection("experience");
      break;
    case "view-skills":
    case "docs-as-code":
      navigateToHomeSection("skills");
      break;
    case "view-portfolio":
      navigateToHomeSection("portfolio");
      break;
    case "go-profeed":
      if (!isHomePage()) {
        navigateToPath("/products/profeed");
        return;
      }
      scrollToSectionId("portfolio");
      syncHash("portfolio");
      window.setTimeout(() => highlightSection("profeed"), 450);
      break;
    case "ai-workflows":
    case "doc-architecture":
      navigateToHomeSection("ecosystem");
      break;
    case "contact":
      navigateToHomeSection("contact");
      break;
    case "open-products":
      if (!isHomePage()) {
        navigateToPath("/products/prodoc");
        return;
      }
      openProductsMenu();
      break;
    default:
      break;
  }
}

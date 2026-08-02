"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Boxes, ChevronDown } from "lucide-react";

import { NavBrandTypewriter } from "@/components/layout/NavBrandTypewriter";
import { AppSwitcher } from "@/components/products/AppSwitcher";
import { ProductsDropdown } from "@/components/layout/ProductsDropdown";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { siteBrand } from "@/content/homepage";
import { primaryNav, type PrimaryNavItem } from "@/content/navigation";
import { isProductPlatformPage } from "@/lib/portfolio-suite";
import { ASSISTANT_OPEN_PRODUCTS } from "@/lib/assistant/execute-command";
import { navigateToHome } from "@/lib/navigate-home";
import { scrollToSectionId } from "@/lib/scroll-to-section";

const SCROLL_SECTION_IDS = ["experience", "skills", "portfolio", "contact"] as const;

/** No nav highlight while the hero is in view */
const HERO_SCROLL_CLEAR_PX = 180;
/** Section becomes active once its top crosses this line (below sticky header) */
const SECTION_ACTIVATE_OFFSET_PX = 132;

function syncHomeUrlHash(
  sectionId: string | null,
  homeHref: string,
): void {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  if (pathname !== "/" && pathname !== homeHref) return;

  const next = sectionId ? `${pathname}#${sectionId}` : pathname;
  const current = `${pathname}${window.location.hash}`;
  if (current === next) return;

  window.history.replaceState(null, "", next);
}

function getSectionScrollTop(
  el: HTMLElement,
  scrollRoot: HTMLElement | null,
): number {
  if (!scrollRoot) {
    return el.getBoundingClientRect().top + window.scrollY;
  }
  const elRect = el.getBoundingClientRect();
  const rootRect = scrollRoot.getBoundingClientRect();
  return scrollRoot.scrollTop + (elRect.top - rootRect.top);
}

function getActiveScrollSection(
  scrollRoot: HTMLElement | null,
): (typeof SCROLL_SECTION_IDS)[number] | null {
  const scrollTop = scrollRoot?.scrollTop ?? window.scrollY;
  if (scrollTop < HERO_SCROLL_CLEAR_PX) return null;

  if (scrollRoot) {
    const nearBottom =
      scrollRoot.scrollTop + scrollRoot.clientHeight >=
      scrollRoot.scrollHeight - 48;
    if (nearBottom) return "contact";
  }

  const activateLine = scrollTop + SECTION_ACTIVATE_OFFSET_PX;
  let active: (typeof SCROLL_SECTION_IDS)[number] | null = null;

  for (const id of SCROLL_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (activateLine >= getSectionScrollTop(el, scrollRoot)) {
      active = id;
    }
  }

  return active;
}

function isScrollNavItem(
  item: PrimaryNavItem,
): item is PrimaryNavItem & {
  sectionId: (typeof SCROLL_SECTION_IDS)[number];
} {
  return (
    item.sectionId !== undefined &&
    (SCROLL_SECTION_IDS as readonly string[]).includes(item.sectionId)
  );
}

function scrollSectionHref(sectionId: string, onHome: boolean) {
  return onHome ? `#${sectionId}` : `/#${sectionId}`;
}

const smoothScroll = (e: MouseEvent, id: string) => {
  if (window.location.pathname !== "/") return;
  e.preventDefault();
  scrollToSectionId(id);
  window.history.replaceState(null, "", `#${id}`);
};

type NavbarProps = {
  homeHref?: string;
  trailing?: ReactNode;
  showPrimaryNav?: boolean;
  showProductSubNav?: boolean;
};

export function Navbar({
  homeHref = "/",
  trailing,
  showPrimaryNav = true,
  showProductSubNav,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [activeHashSection, setActiveHashSection] = useState<string | null>(null);
  const showAppSwitcher =
    showProductSubNav ??
    (pathname !== "/" && isProductPlatformPage(pathname));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaAreaRef = useRef<HTMLSpanElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedHashRef = useRef<string | null | undefined>(undefined);

  const openMega = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  useEffect(() => {
    const onAssistantOpenProducts = () => {
      cancelClose();
      setMobileOpen(false);
      setMegaOpen(true);
    };
    window.addEventListener(ASSISTANT_OPEN_PRODUCTS, onAssistantOpenProducts);
    return () =>
      window.removeEventListener(ASSISTANT_OPEN_PRODUCTS, onAssistantOpenProducts);
  }, [cancelClose]);

  useEffect(() => {
    const nav = document.querySelector(".navbar") as HTMLElement | null;
    const scrollRoot =
      (document.querySelector(".page-wrapper") as HTMLElement | null) ?? null;

    const onScroll = () => {
      if (!nav) return;
      const scrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
      if (scrollTop > 20) {
        nav.style.backdropFilter = "blur(20px)";
        nav.style.setProperty("-webkit-backdrop-filter", "blur(20px)");
        nav.style.boxShadow = "0 1px 0 rgba(124,58,237,0.15)";
      } else {
        nav.style.backdropFilter = "blur(0px)";
        nav.style.setProperty("-webkit-backdrop-filter", "blur(0px)");
        nav.style.boxShadow = "none";
      }
    };

    onScroll();
    const target: HTMLElement | Window = scrollRoot ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) {
      setActiveHashSection(null);
      return;
    }

    const scrollRoot =
      (document.querySelector(".page-wrapper") as HTMLElement | null) ?? null;

    const updateActiveSection = () => {
      const active = getActiveScrollSection(scrollRoot);
      setActiveHashSection(active);

      const hashKey = active ?? "";
      if (lastSyncedHashRef.current !== hashKey) {
        lastSyncedHashRef.current = hashKey;
        syncHomeUrlHash(active, homeHref);
      }
    };

    updateActiveSection();
    const target: HTMLElement | Window = scrollRoot ?? window;
    target.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });

    return () => {
      target.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      lastSyncedHashRef.current = undefined;
    };
  }, [onHome, homeHref]);

  const navLinkClassName = (active: boolean) =>
    `navbar__link whitespace-nowrap no-underline ${
      active ? "navbar__link--active" : ""
    }`;

  const renderNavItem = (item: PrimaryNavItem, onNavigate?: () => void) => {
    if (isScrollNavItem(item)) {
      const active = onHome && activeHashSection === item.sectionId;
      return (
        <a
          href={scrollSectionHref(item.sectionId, onHome)}
          className={navLinkClassName(active)}
          onClick={(e) => {
            smoothScroll(e, item.sectionId);
            onNavigate?.();
          }}
        >
          {item.label}
        </a>
      );
    }

    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        href={item.href}
        className={navLinkClassName(active)}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <div
        className="navbar site-header-shell sticky top-0 z-[100] backdrop-blur-[20px]"
        style={{ backgroundColor: "var(--nav-bg)" }}
      >
        <header style={{ borderBottom: "1px solid var(--border-primary)" }}>
          <div className="flex items-center justify-between px-5 h-[48px] lg:px-[48px] lg:h-[52px]">
            <Link
              href={homeHref}
              className="flex min-w-0 shrink-0 items-center gap-2.5 outline-none lg:gap-3.5"
              onClick={(e) => navigateToHome(e, homeHref)}
            >
              <span className="flex min-w-0 max-w-[min(100%,240px)] flex-col justify-center gap-px overflow-hidden sm:max-w-[min(100%,320px)] lg:max-w-none">
                <NavBrandTypewriter
                  name={siteBrand.name}
                  subtitle={siteBrand.subtitle}
                />
              </span>
            </Link>

            <div className="hidden lg:flex items-center" style={{ gap: "8px" }}>
              {showPrimaryNav && (
                <nav className="flex items-center" style={{ gap: "0" }} aria-label="Primary">
                  {primaryNav.map((item, i) => (
                    <span key={item.label} className="flex items-center">
                      {i > 0 && (
                        <span
                          aria-hidden
                          style={{
                            color: "var(--border-color)",
                            fontSize: "12px",
                            userSelect: "none",
                            opacity: 0.4,
                            padding: "0 2px",
                          }}
                        >
                          |
                        </span>
                      )}
                      {renderNavItem(item)}
                    </span>
                  ))}

                  <span
                    aria-hidden
                    style={{
                      color: "var(--border-color)",
                      fontSize: "12px",
                      userSelect: "none",
                      opacity: 0.4,
                      padding: "0 2px",
                    }}
                  >
                    |
                  </span>

                  <span
                    ref={megaAreaRef}
                    className="flex items-center relative"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                  >
                    <button
                      type="button"
                      className={`products-trigger flex cursor-pointer items-center gap-1.5 border whitespace-nowrap bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 ${
                        megaOpen
                          ? "border-purple-400/40 text-[#C084FC] shadow-[0_0_16px_rgba(147,51,234,0.2)]"
                          : "border-transparent text-[color:var(--text-secondary)]"
                      }`}
                      style={{ fontSize: "13px", fontWeight: 400 }}
                      aria-haspopup="dialog"
                      aria-expanded={megaOpen}
                      onClick={() => setMegaOpen((v) => !v)}
                    >
                      <Boxes size={14} className="shrink-0 opacity-90" aria-hidden />
                      Products
                      <ChevronDown
                        size={12}
                        className="shrink-0 opacity-70"
                        style={{
                          transform: megaOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                  </span>
                </nav>
              )}

              <div
                aria-hidden
                style={{
                  width: "1px",
                  height: "18px",
                  background: "var(--border-color)",
                  margin: "0 12px",
                  opacity: 0.4,
                  flexShrink: 0,
                }}
              />
              <ThemeToggle />
              {trailing}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="hidden"
                style={{
                  width: "44px",
                  height: "44px",
                  color: "var(--text-secondary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {showAppSwitcher ? <AppSwitcher /> : null}
      </div>

      <ProductsDropdown
        open={megaOpen}
        onClose={() => setMegaOpen(false)}
        anchorRef={megaAreaRef}
        onPanelHoverStart={cancelClose}
        onPanelHoverEnd={closeMega}
      />

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[190] bg-black/50 md:hidden lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div
            className="fixed right-0 top-0 z-[200] flex h-full flex-col overflow-y-auto md:hidden lg:hidden"
            style={{
              width: "75vw",
              maxWidth: "300px",
              background: "var(--bg-secondary)",
              borderLeft: "1px solid var(--border-color)",
              padding: "24px 20px",
            }}
            role="dialog"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col" aria-label="Mobile primary">
              {primaryNav.map((item) => (
                <span
                  key={item.label}
                  className="block border-b border-[color:var(--border-color)]"
                >
                  {isScrollNavItem(item) ? (
                    <a
                      href={scrollSectionHref(item.sectionId, onHome)}
                      className={`navbar__link-mobile block no-underline ${
                        onHome && activeHashSection === item.sectionId
                          ? "navbar__link-mobile--active"
                          : ""
                      }`}
                      onClick={(e) => {
                        smoothScroll(e, item.sectionId);
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`navbar__link-mobile block no-underline ${
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                          ? "navbar__link-mobile--active"
                          : ""
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </span>
              ))}
              <button
                type="button"
                className="w-full cursor-pointer rounded-none border-none bg-transparent text-left transition-colors duration-200 hover:text-[#C084FC]"
                style={{
                  fontSize: "15px",
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/products");
                }}
              >
                Products
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

/** @deprecated Use Navbar — kept for gradual migration */
export const SiteHeader = Navbar;

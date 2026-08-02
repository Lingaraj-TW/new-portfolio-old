"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Boxes,
  Briefcase,
  FolderOpen,
  Home,
  Layers,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { navigateToHome } from "@/lib/navigate-home";
import { useTheme } from "@/lib/use-theme";

const SCROLL_SECTION_IDS = [
  "experience",
  "skills",
  "portfolio",
  "contact",
] as const;

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Experience", href: "/#experience", icon: Briefcase },
  { label: "Skills", href: "/#skills", icon: Layers },
  { label: "Portfolio", href: "/#portfolio", icon: FolderOpen },
  { label: "Contact", href: "/#contact", icon: Mail },
  { label: "Docs", href: "/documentation", icon: BookOpen },
  { label: "Products", href: "/products", icon: Boxes },
] as const;

const HERO_SCROLL_CLEAR_PX = 180;
const SECTION_ACTIVATE_OFFSET_PX = 132;

function getActiveScrollSection(): (typeof SCROLL_SECTION_IDS)[number] | null {
  const scrollRoot =
    (document.querySelector(".page-wrapper") as HTMLElement | null) ?? null;
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
    const top = scrollRoot
      ? scrollRoot.scrollTop +
        (el.getBoundingClientRect().top -
          scrollRoot.getBoundingClientRect().top)
      : el.getBoundingClientRect().top + window.scrollY;
    if (activateLine >= top) active = id;
  }

  return active;
}

function isNavItemActive(
  href: string,
  pathname: string,
  activeSection: string | null,
): boolean {
  if (href === "/") {
    return pathname === "/" && activeSection === null;
  }
  const hash = href.includes("#") ? href.split("#")[1] : null;
  if (hash && pathname === "/") {
    return activeSection === hash;
  }
  if (href === "/products") {
    return pathname === "/products" || pathname.startsWith("/products/");
  }
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const scrollRoot =
      (document.querySelector(".page-wrapper") as HTMLElement | null) ?? null;
    const update = () => setActiveSection(getActiveScrollSection());
    update();

    const target: HTMLElement | Window = scrollRoot ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const navSurfaceStyle =
    theme === "dark"
      ? {
          background: "rgba(15,15,20,0.75)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }
      : {
          background: "rgba(255,255,255,0.65)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
        };

  if (pathname?.startsWith("/proapi")) return null;
  if (pathname?.startsWith("/docs") || pathname?.startsWith("/prodoc")) return null;

  return (
    <div
      className="mobile-bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex justify-center px-3 pb-3 lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-white/20 px-1.5 py-1.5 backdrop-blur-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "bg-white/65 dark:border-white/10 dark:bg-zinc-900/75",
        )}
        style={navSurfaceStyle}
        aria-label="Mobile primary"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(item.href, pathname, activeSection);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-w-[3.25rem] shrink-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors duration-200 sm:min-w-[3.5rem] sm:px-2.5"
              onClick={
                item.href === "/"
                  ? (event) => navigateToHome(event, "/")
                  : undefined
              }
            >
              {isActive ? (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-xl bg-accent/15"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              ) : null}
              <Icon
                className={cn(
                  "relative h-[1.125rem] w-[1.125rem] transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted-foreground",
                )}
                strokeWidth={isActive ? 2.25 : 1.75}
                aria-hidden
              />
              <span
                className={cn(
                  "relative text-[0.6rem] font-medium leading-none transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { NavScrollProgress } from "@/components/layout/NavScrollProgress";
import { scrollSections } from "@/content/navigation";
import { scrollToSectionId } from "@/lib/scroll-to-section";

const sections = [
  { id: "hero", label: "Home" },
  { id: "work-with-me", label: "What I deliver" },
  ...scrollSections.map((s) => ({ id: s.id, label: s.label })),
];

export function ScrollEnhancements() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  const scrollToId = useCallback((id: string) => {
    scrollToSectionId(id);
  }, []);

  // ── Gate animation CSS — body class added only after JS hydrates ─────────
  useEffect(() => {
    document.body.classList.add("scroll-anims-ready");
    return () => document.body.classList.remove("scroll-anims-ready");
  }, []);

  // ── Scroll progress bar ──────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const wrapper = document.querySelector(".page-wrapper") as HTMLElement;
      if (!wrapper) return;
      const scrollTop = wrapper.scrollTop;
      const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(pct);
    };
    const wrapper = document.querySelector(".page-wrapper");
    wrapper?.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => wrapper?.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Active section tracking ──────────────────────────────────────────────
  useEffect(() => {
    const wrapper = document.querySelector(".page-wrapper");
    const observers = sections.map((section, i) => {
      const el = document.getElementById(section.id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(i);
        },
        { threshold: 0.3, root: wrapper ?? null }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // ── Entrance animations (once per element — no repeat on re-scroll) ───────
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".animate-on-scroll, .animate-from-left, .animate-from-right, .animate-scale"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, root: null },
    );
    elements.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ── Scroll to hash after navigation to homepage ─────────────────────────
  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = window.setTimeout(() => scrollToId(hash), 50);
    return () => window.clearTimeout(t);
  }, [pathname, scrollToId]);

  // ── Intercept anchor-link clicks for wrapper smooth scroll ────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a, button[data-scroll-to]");
      const href =
        anchor?.getAttribute("href") ?? anchor?.getAttribute("data-scroll-to");
      if (!href) return;

      let id: string | null = null;
      if (href.startsWith("#")) {
        id = href.slice(1);
      } else if (href.startsWith("/#")) {
        id = href.slice(2);
      }

      if (id && pathname === "/") {
        e.preventDefault();
        scrollToId(id);
        window.history.replaceState(null, "", `#${id}`);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, scrollToId]);

  const scrollToSection = scrollToId;

  return (
    <>
      <NavScrollProgress progress={progress} />

      {/* ── Dot navigation ── */}
      <nav
        className="dot-nav"
        aria-label="Section navigation"
        style={{
          position: "fixed",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          zIndex: 1000,
        }}
      >
        {sections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            className={`dot-nav__btn${activeSection === i ? " dot-nav__btn--active" : ""}`}
            onClick={() => scrollToSection(section.id)}
            title={section.label}
            aria-label={`Go to ${section.label}`}
            aria-current={activeSection === i ? "true" : undefined}
          />
        ))}
      </nav>
    </>
  );
}

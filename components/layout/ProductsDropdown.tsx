"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { DropdownEcosystemVisual } from "@/components/layout/DropdownEcosystemVisual";
import { productNavItems } from "@/content/products";
import { dropdownSolutions, ecosystemCard } from "@/content/products/dropdown";
import type { ProductNavItem } from "@/content/products/types";
import {
  FileText,
  MessageSquare,
  BarChart3,
  Sparkles,
  Code2,
  Zap,
  Shield,
  CheckSquare,
  TrendingUp,
  PenLine,
  Users,
} from "lucide-react";

const productIconMap = {
  FileText,
  Sparkles,
  MessageSquare,
  BarChart3,
  Code2,
} as const;

const solutionIconMap = {
  Zap,
  Shield,
  CheckSquare,
  TrendingUp,
  PenLine,
  Users,
} as const;

function getProductIcon(item: ProductNavItem) {
  return productIconMap[item.iconKey];
}

type MegaMenuCoords = {
  top: number;
  left: number;
  width: number;
};

type ProductsDropdownProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  onPanelHoverStart?: () => void;
  onPanelHoverEnd?: () => void;
};

const MEGA_WIDTH = 1120;
/** Estimated panel height for viewport clamping (desktop, no scroll) */
const PANEL_ESTIMATE_PX = 540;

function computeAnchoredCoords(anchorEl: HTMLElement | null): MegaMenuCoords | null {
  if (!anchorEl) return null;
  const rect = anchorEl.getBoundingClientRect();
  const gutter = 16;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const desired = Math.min(MEGA_WIDTH, vw - gutter * 2);
  let left = rect.right - desired;
  if (left < gutter) left = gutter;
  if (left + desired > vw - gutter) left = Math.max(gutter, vw - gutter - desired);

  const below = rect.bottom + 10;
  const maxTop = vh - PANEL_ESTIMATE_PX - gutter;
  const top = Math.min(below, Math.max(64, maxTop));

  return { top, left, width: desired };
}

function computeMobileCoords(): MegaMenuCoords {
  const gutter = 16;
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  return {
    top: 72,
    left: gutter,
    width: vw - gutter * 2,
  };
}

export function ProductsDropdown({
  open,
  onClose,
  anchorRef,
  onPanelHoverStart,
  onPanelHoverEnd,
}: ProductsDropdownProps) {
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false,
  );
  const [coords, setCoords] = useState<MegaMenuCoords | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const update = () => {
      if (narrow) {
        setCoords(computeMobileCoords());
        return;
      }
      const anchored = computeAnchoredCoords(anchorRef?.current ?? null);
      if (anchored && (anchorRef?.current?.getBoundingClientRect().width ?? 0) > 0) {
        setCoords(anchored);
      } else {
        setCoords(computeMobileCoords());
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, mounted, narrow, anchorRef]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const panelCoords = coords ?? { top: 72, left: 16, width: 400 };

  const panelInner = (
    <div className="products-dropdown-panel">
      <div className="dropdown-column">
        <p className="dropdown-heading">{ecosystemCard.productsColumnLabel}</p>
        {productNavItems.map((product) => {
          const Icon = getProductIcon(product);
          return (
            <Link
              key={product.name}
              href={product.href}
              onClick={onClose}
              className="dropdown-item"
            >
              <span className="dropdown-icon">
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="dropdown-item-body">
                <p className="dropdown-title">{product.name}</p>
                <p className="dropdown-description">{product.subtitle}</p>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="dropdown-column dropdown-column--divider">
        <p className="dropdown-heading">{ecosystemCard.solutionsColumnLabel}</p>
        {dropdownSolutions.map((sol) => {
          const Icon = solutionIconMap[sol.iconKey];
          return (
            <div key={sol.title} className="dropdown-item cursor-default">
              <span className="dropdown-icon">
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="dropdown-item-body">
                <p className="dropdown-title">{sol.title}</p>
                <p className="dropdown-description">{sol.description}</p>
              </span>
            </div>
          );
        })}
      </div>

      <div className="dropdown-feature">
        <div className="dropdown-feature-main">
          <h3>{ecosystemCard.title}</h3>
          <p>{ecosystemCard.description}</p>
          <Link
            href="/platform"
            onClick={onClose}
            className="dropdown-feature-link"
          >
            {ecosystemCard.exploreLabel.replace(" →", "")}
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
        </div>
        <DropdownEcosystemVisual compact={narrow} />
        <div className="dropdown-feature-footer">
          <span className="dropdown-feature-badge">
            <span className="dropdown-feature-badge-dot" aria-hidden />
            {ecosystemCard.pillLabel}
          </span>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={
              narrow
                ? "fixed inset-0 z-[198] bg-background/70 backdrop-blur-sm"
                : "fixed inset-0 z-[198] pointer-events-none bg-transparent"
            }
            aria-hidden
            onClick={() => narrow && onClose()}
          />
          <motion.div
            key="mega-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Documentation ecosystem"
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{
              ...panelCoords,
              position: "fixed",
              transformOrigin: narrow ? "top center" : "top right",
            }}
            className="products-dropdown-shell z-[200] text-foreground"
            onMouseEnter={onPanelHoverStart}
            onMouseLeave={onPanelHoverEnd}
          >
            {panelInner}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** @deprecated Use ProductsDropdown */
export const ProductsMegaMenu = ProductsDropdown;

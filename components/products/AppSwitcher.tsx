"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { productPlatformRoutes } from "@/lib/portfolio-suite";

export function AppSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: "var(--bg-secondary)" }}
      aria-label="Product navigation"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto px-5 py-2 lg:px-[48px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {productPlatformRoutes.map((pill, i) => {
          const isActive =
            pathname === pill.href || pathname.startsWith(`${pill.href}/`);

          return (
            <Link
              key={pill.href}
              href={pill.href}
              className="product-pill no-underline whitespace-nowrap rounded-full border px-3.5 py-1 text-xs"
              style={{
                animationDelay: `${0.1 + i * 0.1}s`,
                ...(isActive
                  ? {
                      background: "rgba(147, 51, 234, 0.1)",
                      borderColor: "rgba(147, 51, 234, 0.35)",
                      color: "#C084FC",
                      fontWeight: 600,
                    }
                  : {
                      borderColor: "transparent",
                      color: "var(--text-secondary)",
                      fontWeight: 500,
                    }),
              }}
            >
              {pill.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

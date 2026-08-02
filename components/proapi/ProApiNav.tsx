"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code2, FlaskConical, History, Key, Rocket, Terminal } from "lucide-react";

import { cn } from "@/lib/cn";

const navItems = [
  { href: "/proapi", label: "Overview", icon: Rocket, exact: true },
  { href: "/proapi/getting-started", label: "Getting Started", icon: BookOpen },
  { href: "/proapi/authentication", label: "Authentication", icon: Key },
  { href: "/proapi/api-reference", label: "API Reference", icon: Terminal },
  { href: "/proapi/guides", label: "Guides", icon: BookOpen },
  { href: "/proapi/sdks", label: "SDKs", icon: Code2 },
  { href: "/proapi/playground", label: "Playground", icon: FlaskConical },
  { href: "/proapi/changelog", label: "Changelog", icon: History },
];

export function ProApiNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Developer portal">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type TabProps = { label: string; children: ReactNode; value?: string };

export function Tab(_props: TabProps) {
  return null;
}

type TabsProps = {
  children: ReactNode;
  defaultValue?: string;
};

export function Tabs({ children, defaultValue }: TabsProps) {
  const tabs = (Array.isArray(children) ? children : [children]).filter(Boolean) as {
    props: TabProps;
  }[];

  const items = tabs.map((t) => ({
    label: t.props.label,
    value: t.props.value ?? t.props.label.toLowerCase().replace(/\s+/g, "-"),
    content: t.props.children,
  }));

  const [active, setActive] = useState(defaultValue ?? items[0]?.value ?? "");

  return (
    <div className="not-prose pds-tabs my-6">
      <div className="pds-tabs__list" role="tablist">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            onClick={() => setActive(item.value)}
            className={cn(
              "pds-tabs__trigger",
              active === item.value && "pds-tabs__trigger--active",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pds-tabs__panel" role="tabpanel">
        {items.find((i) => i.value === active)?.content}
      </div>
    </div>
  );
}

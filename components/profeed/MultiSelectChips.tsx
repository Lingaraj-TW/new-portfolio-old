"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useId } from "react";

import { cn } from "@/lib/cn";
import {
  PROFEED_TEAM_OPTIONS,
  PROFEED_WRITER_OPTIONS,
} from "@/lib/profeed/constants";

type Props = {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  id?: string;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Multi-select as a dropdown (checkbox-style rows). Uses `modal={false}` so it works inside dialogs.
 */
export function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  id: idProp,
}: Props) {
  const genId = useId();
  const labelId = idProp || `${genId}-label`;

  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt].slice(0, 32));
    }
  };

  const summary =
    value.length === 0
      ? placeholder
      : value.length <= 2
        ? value.join(", ")
        : `${value.length} selected`;

  return (
    <div>
      <p id={labelId} className="text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          type="button"
          aria-labelledby={labelId}
          className={cn(
            "mt-1.5 flex w-full items-center justify-between gap-2 rounded-xl border border-border/90 bg-card px-3 py-2.5 text-left text-sm",
            "text-foreground shadow-sm outline-none transition",
            "hover:border-border focus:border-ring focus:ring-2 focus:ring-ring/20",
            "dark:bg-card dark:text-foreground dark:hover:border-border",
            "data-[state=open]:border-indigo-400/50 data-[state=open]:ring-1 data-[state=open]:ring-indigo-500/20",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              value.length === 0 &&
                "text-muted-foreground dark:text-muted-foreground",
            )}
          >
            {summary}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              "z-[200] max-h-60 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-border/90 bg-card p-1.5",
              "shadow-[0_16px_50px_rgba(0,0,0,0.18)] will-change-transform",
              "data-[side=bottom]:animate-in data-[side=top]:animate-in",
              "dark:border-border dark:bg-muted",
            )}
            sideOffset={6}
            align="start"
            avoidCollisions
          >
            {options.map((opt) => {
              const active = value.includes(opt);
              return (
                <DropdownMenu.Item
                  key={opt}
                  className={cn(
                    "flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none",
                    "text-foreground/90 data-[highlighted]:bg-muted dark:text-foreground dark:data-[highlighted]:bg-muted/80",
                  )}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggle(opt);
                  }}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
                      active
                        ? "border-indigo-500 bg-indigo-500 text-accent-foreground"
                        : "border-border bg-card text-transparent dark:border-border dark:bg-card",
                    )}
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">{opt}</span>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export function MultiSelectWriters(p: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <MultiSelectDropdown
      label="Tag writers"
      placeholder="Select writers…"
      options={PROFEED_WRITER_OPTIONS}
      value={p.value}
      onChange={p.onChange}
    />
  );
}

export function MultiSelectTeams(p: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <MultiSelectDropdown
      label="Tag teams"
      placeholder="Select teams…"
      options={PROFEED_TEAM_OPTIONS}
      value={p.value}
      onChange={p.onChange}
    />
  );
}

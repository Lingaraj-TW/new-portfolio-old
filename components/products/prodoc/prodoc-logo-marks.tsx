"use client";

import { useId } from "react";

type MarkProps = {
  className?: string;
};

function gradientDefs(
  gid: string,
  start = "#06B6D4",
  mid = "#14B8A6",
  end = "#10B981",
) {
  return (
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={start} />
        <stop offset="55%" stopColor={mid} />
        <stop offset="100%" stopColor={end} />
      </linearGradient>
    </defs>
  );
}

/** 1 · Folded-P logo — closely matches the cyan/teal ChatGPT brand asset */
export function LogoFoldedDocumentP({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const gMain = `pd-fp-main-${id}`;
  const gFold = `pd-fp-fold-${id}`;
  const gGlow = `pd-fp-glow-${id}`;
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ProDoc"
    >
      <defs>
        {/* Main cyan → teal gradient */}
        <linearGradient id={gMain} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
        {/* Ribbon fold */}
        <linearGradient id={gFold} x1="55" y1="35" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        {/* Pixel glow */}
        <linearGradient id={gGlow} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Body of the P letter */}
      <path
        d="M18 16 L18 84 L34 84 L34 62 L52 62 C65 62 74 54 74 44 C74 34 65 26 52 26 L18 26 Z"
        fill={`url(#${gMain})`}
      />
      {/* P counter (hole) */}
      <path
        d="M34 36 L50 36 C57 36 62 40 62 44 C62 48 57 52 50 52 L34 52 Z"
        fill="rgba(2,6,23,0.72)"
      />
      {/* Ribbon fold curving from top-right of P */}
      <path
        d="M65 20 Q80 28 78 50 Q76 68 62 76 Q72 60 70 44 Q68 30 55 24 Z"
        fill={`url(#${gFold})`}
        opacity="0.85"
      />
      {/* Fold highlight edge */}
      <path
        d="M55 24 Q68 30 70 44 Q72 60 62 76"
        stroke="rgba(186,230,253,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Floating pixel dots (top-right) */}
      <rect x="76" y="12" width="5" height="5" rx="1" fill={`url(#${gGlow})`} opacity="0.9" />
      <rect x="84" y="10" width="3.5" height="3.5" rx="0.7" fill={`url(#${gGlow})`} opacity="0.75" />
      <rect x="83" y="18" width="2.5" height="2.5" rx="0.5" fill={`url(#${gGlow})`} opacity="0.6" />
      <rect x="76" y="20" width="2" height="2" rx="0.4" fill={`url(#${gGlow})`} opacity="0.5" />
    </svg>
  );
}

/** 2 · Orbit nodes + document core — default flagship */
export function LogoOrbitDocumentCore({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-o-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      {/* Orbits */}
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="12"
        stroke="rgba(6,182,212,0.35)"
        strokeWidth="1.25"
        transform="rotate(-18 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="12"
        stroke="rgba(20,184,166,0.28)"
        strokeWidth="1"
        transform="rotate(58 32 32)"
      />
      {/* Outer nodes */}
      <circle cx="12" cy="28" r="3.25" fill={`url(#${g})`} />
      <circle cx="54" cy="38" r="3.25" fill={`url(#${g})`} opacity="0.85" />
      <circle cx="36" cy="52" r="2.75" fill="#10B981" opacity="0.85" />
      <circle cx="28" cy="12" r="2.75" fill="#06B6D4" opacity="0.8" />
      {/* Core doc */}
      <rect
        x="24"
        y="20"
        width="18"
        height="24"
        rx="3"
        fill="#020617"
        stroke={`url(#${g})`}
        strokeWidth="2"
      />
      <path
        d="M29 26h13M29 31h10M29 36h13"
        stroke="rgba(148,163,184,0.7)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 3 · Knowledge cube */
export function LogoKnowledgeCube({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-k-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      <path
        d="M32 12L48 21v21L32 53 16 42V21L32 12z"
        stroke={`url(#${g})`}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#020617"
      />
      <path
        d="M16 21l16 10 16-10M32 31v21"
        stroke={`url(#${g})`}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M26 37h14M26 43h11"
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.25"
      />
    </svg>
  );
}

/** 4 · Neural document */
export function LogoNeuralDocument({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-n-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      <rect
        x="17"
        y="17"
        width="30"
        height="38"
        rx="4"
        fill="#020617"
        stroke={`url(#${g})`}
        strokeWidth="2"
      />
      {/* Neural graph */}
      <path
        d="M46 46c-6-18-29-27-39-46"
        stroke="rgba(6,182,212,0.45)"
        strokeWidth="1.25"
      />
      <path
        d="M41 54c12-26-39-52-53-71"
        stroke="rgba(20,184,166,0.35)"
        strokeWidth="1"
      />
      <circle cx="18" cy="8" r="2.75" fill="#06B6D4" />
      <circle cx="56" cy="22" r="2.75" fill="#14B8A6" />
      <circle cx="50" cy="54" r="2.75" fill="#10B981" />
      <circle cx="32" cy="42" r="2.25" fill={`url(#${g})`} />
      <path
        d="M26 26h13M26 32h13M26 38h10"
        stroke="rgba(148,163,184,0.55)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** 5 · Blueprint grid */
export function LogoBlueprintGrid({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-bp-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      <path
        d="M14 50V14h36v36"
        stroke="rgba(6,182,212,0.25)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path opacity="0.15" stroke="rgba(148,163,184,0.5)" strokeWidth="0.5" d="M22 50V14M38 50V14M14 42h36M14 26h36" />
      <rect x="21" y="21" width="22" height="28" rx="3" stroke={`url(#${g})`} strokeWidth="2" />
      <path stroke={`url(#${g})`} strokeWidth="1.75" strokeLinecap="square" d="M17 17h8v8M41 43h8v8" />
      <path d="M27 31h13M27 37h13" stroke="rgba(148,163,184,0.5)" strokeWidth="1.4" />
    </svg>
  );
}

/** 6 · Lighthouse beacon */
export function LogoLighthouseBeacon({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-l-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      {/* Rays */}
      <path d="M32 52V10" stroke={`url(#${g})`} strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      <path d="M20 42L32 20l12 22" stroke="rgba(16,185,129,0.25)" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      {/* Doc lighthouse body */}
      <path
        d="M44 54H20v-12l6-26h12l6 26v12z"
        fill="#020617"
        stroke={`url(#${g})`}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M25 41h13" stroke="rgba(248,250,252,0.85)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="46" r="3" fill="#06B6D4" />
    </svg>
  );
}

/** 7 · Hexagonal ecosystem */
export function LogoHexEcosystem({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-hx-${id}`;
  const hexPoints = "32,8 50,17 50,35 32,54 14,35 14,17";
  const nodes: [number, number][] = [
    [32, 8],
    [50, 17],
    [50, 35],
    [32, 54],
    [14, 35],
    [14, 17],
  ];
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      <polygon
        points={hexPoints}
        stroke={`url(#${g})`}
        strokeWidth="1.85"
        fill="#020617"
      />
      <circle cx="32" cy="31" r="7" stroke={`url(#${g})`} strokeWidth="2" />
      {nodes.map(([x, y], i) => (
        <circle
          key={`${x}-${y}-${i}`}
          cx={x}
          cy={y}
          r="3"
          fill={i % 2 ? "#14B8A6" : "#06B6D4"}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

/** 8 · Open book + circuit */
export function LogoOpenBookCircuit({ className }: MarkProps) {
  const id = useId().replace(/:/g, "");
  const g = `pd-bc-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      {gradientDefs(g)}
      <path
        d="M32 52V15"
        stroke="rgba(6,182,212,0.35)"
        strokeWidth="1.25"
      />
      <path
        d="M13 43V15c10.5 0 17 12 17 22h2c1-13 15-26 26-26v28c-10 8-26 8-37 22-11-13-29-22-41-26V15"
        stroke={`url(#${g})`}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#020617"
      />
      <path
        d="M43 48h11M54 43v13M44 53l6 6"
        stroke="rgba(16,185,129,0.65)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="54" cy="39" r="2.75" fill="#06B6D4" opacity="0.9" />
    </svg>
  );
}

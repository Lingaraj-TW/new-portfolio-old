---
name: proinsights
description: "Skill for the Proinsights area of prodoc. 7 symbols across 1 files."
---

# Proinsights

7 symbols | 1 files | Cohesion: 86%

## When to Use

- Working with code in `app/`
- Understanding how ProInsightsPage work
- Modifying proinsights-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/proinsights/page.tsx` | clampNonEmpty, toDayKey, countHighlights, fmtPct, topN (+2) |

## Entry Points

Start here when exploring this area:

- **`ProInsightsPage`** (Function) — `app/proinsights/page.tsx:51`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ProInsightsPage` | Function | `app/proinsights/page.tsx` | 51 |
| `clampNonEmpty` | Function | `app/proinsights/page.tsx` | 22 |
| `toDayKey` | Function | `app/proinsights/page.tsx` | 27 |
| `countHighlights` | Function | `app/proinsights/page.tsx` | 35 |
| `fmtPct` | Function | `app/proinsights/page.tsx` | 39 |
| `topN` | Function | `app/proinsights/page.tsx` | 43 |
| `toChartKV` | Function | `app/proinsights/page.tsx` | 47 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ProInsightsPage → IsSupabaseConfigured` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Profeed | 2 calls |

## How to Explore

1. `gitnexus_context({name: "ProInsightsPage"})` — see callers and callees
2. `gitnexus_query({query: "proinsights"})` — find related execution flows
3. Read key files listed above for implementation details

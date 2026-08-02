---
name: app
description: "Skill for the App area of prodoc. 5 symbols across 4 files."
---

# App

5 symbols | 4 files | Cohesion: 67%

## When to Use

- Working with code in `app/`
- Understanding how isExternalDocHref, Home, ProInsightsLayout work
- Modifying app-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/page.tsx` | LiveDemoLink, Home |
| `lib/prodoc-urls.ts` | isExternalDocHref |
| `app/proinsights/layout.tsx` | ProInsightsLayout |
| `app/profeed/portal/layout.tsx` | ProFeedPortalLayout |

## Entry Points

Start here when exploring this area:

- **`isExternalDocHref`** (Function) — `lib/prodoc-urls.ts:30`
- **`Home`** (Function) — `app/page.tsx:191`
- **`ProInsightsLayout`** (Function) — `app/proinsights/layout.tsx:7`
- **`ProFeedPortalLayout`** (Function) — `app/profeed/portal/layout.tsx:6`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `isExternalDocHref` | Function | `lib/prodoc-urls.ts` | 30 |
| `Home` | Function | `app/page.tsx` | 191 |
| `ProInsightsLayout` | Function | `app/proinsights/layout.tsx` | 7 |
| `ProFeedPortalLayout` | Function | `app/profeed/portal/layout.tsx` | 6 |
| `LiveDemoLink` | Function | `app/page.tsx` | 89 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Home → GetProdocPublicBase` | cross_community | 3 |
| `ProInsightsLayout → GetProdocPublicBase` | cross_community | 3 |
| `ProFeedPortalLayout → GetProdocPublicBase` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Profeed | 3 calls |

## How to Explore

1. `gitnexus_context({name: "isExternalDocHref"})` — see callers and callees
2. `gitnexus_query({query: "app"})` — find related execution flows
3. Read key files listed above for implementation details

---
name: components
description: "Skill for the Components area of prodoc. 25 symbols across 9 files."
---

# Components

25 symbols | 9 files | Cohesion: 96%

## When to Use

- Working with code in `components/`
- Understanding how FeedbackWidget, sync, PortalLogoutButton work
- Modifying components-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/FeedbackWidget.tsx` | readSecrets, mergeSecret, getOrCreateVisitorId, sectionFromHash, docSlugFromPath (+2) |
| `components/PortalFeedbackList.tsx` | readSecrets, forgetSecret, formatHelpful, PortalFeedbackList, refreshSecrets |
| `my-website/src/components/ProFeedWidget.js` | readSecrets, mergeSecret, getOrCreateVisitorId, sectionFromHash, ProFeedWidget |
| `components/ProInsightsCharts.tsx` | formatShort, tooltipStyle, ProInsightsCharts |
| `components/PortalLogoutButton.tsx` | PortalLogoutButton |
| `components/PortalLoginForm.tsx` | PortalLoginForm |
| `components/AdminLogoutButton.tsx` | AdminLogoutButton |
| `components/AdminLoginForm.tsx` | AdminLoginForm |
| `lib/supabase/client.ts` | createSupabaseBrowserClient |

## Entry Points

Start here when exploring this area:

- **`FeedbackWidget`** (Function) — `components/FeedbackWidget.tsx:62`
- **`sync`** (Function) — `components/FeedbackWidget.tsx:86`
- **`PortalLogoutButton`** (Function) — `components/PortalLogoutButton.tsx:8`
- **`PortalLoginForm`** (Function) — `components/PortalLoginForm.tsx:7`
- **`AdminLogoutButton`** (Function) — `components/AdminLogoutButton.tsx:8`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `FeedbackWidget` | Function | `components/FeedbackWidget.tsx` | 62 |
| `sync` | Function | `components/FeedbackWidget.tsx` | 86 |
| `PortalLogoutButton` | Function | `components/PortalLogoutButton.tsx` | 8 |
| `PortalLoginForm` | Function | `components/PortalLoginForm.tsx` | 7 |
| `AdminLogoutButton` | Function | `components/AdminLogoutButton.tsx` | 8 |
| `AdminLoginForm` | Function | `components/AdminLoginForm.tsx` | 7 |
| `createSupabaseBrowserClient` | Function | `lib/supabase/client.ts` | 5 |
| `PortalFeedbackList` | Function | `components/PortalFeedbackList.tsx` | 54 |
| `refreshSecrets` | Function | `components/PortalFeedbackList.tsx` | 62 |
| `ProFeedWidget` | Function | `my-website/src/components/ProFeedWidget.js` | 45 |
| `ProInsightsCharts` | Function | `components/ProInsightsCharts.tsx` | 76 |
| `readSecrets` | Function | `components/FeedbackWidget.tsx` | 11 |
| `mergeSecret` | Function | `components/FeedbackWidget.tsx` | 23 |
| `getOrCreateVisitorId` | Function | `components/FeedbackWidget.tsx` | 28 |
| `sectionFromHash` | Function | `components/FeedbackWidget.tsx` | 45 |
| `docSlugFromPath` | Function | `components/FeedbackWidget.tsx` | 51 |
| `readSecrets` | Function | `components/PortalFeedbackList.tsx` | 8 |
| `forgetSecret` | Function | `components/PortalFeedbackList.tsx` | 20 |
| `formatHelpful` | Function | `components/PortalFeedbackList.tsx` | 48 |
| `readSecrets` | Function | `my-website/src/components/ProFeedWidget.js` | 7 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `PortalFeedbackList → ReadSecrets` | intra_community | 3 |
| `FeedbackWidget → SectionFromHash` | intra_community | 3 |
| `FeedbackWidget → ReadSecrets` | intra_community | 3 |
| `ProFeedWidget → ReadSecrets` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Profeed | 2 calls |

## How to Explore

1. `gitnexus_context({name: "FeedbackWidget"})` — see callers and callees
2. `gitnexus_query({query: "components"})` — find related execution flows
3. Read key files listed above for implementation details

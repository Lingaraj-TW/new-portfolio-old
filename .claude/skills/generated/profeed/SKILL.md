---
name: profeed
description: "Skill for the Profeed area of prodoc. 22 symbols across 17 files."
---

# Profeed

22 symbols | 17 files | Cohesion: 73%

## When to Use

- Working with code in `app/`
- Understanding how createSupabaseServerClient, isSupabaseConfigured, ProFeedHomePage work
- Modifying profeed-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/profeed/page.tsx` | formatHelpful, highlightsCount, ProFeedHomePage |
| `app/admin/actions.ts` | isStatus, updateFeedbackStatus |
| `app/profeed/statusForm.tsx` | FeedbackStatusForm, submit |
| `app/profeed/actions.ts` | isStatus, updateFeedbackStatus |
| `lib/supabase/server.ts` | createSupabaseServerClient |
| `lib/supabase/config.ts` | isSupabaseConfigured |
| `app/admin/status-form.tsx` | FeedbackStatusForm |
| `app/profeed/portal/page.tsx` | ProFeedPortalHomePage |
| `app/profeed/login/page.tsx` | ProFeedLoginPage |
| `app/api/storage/sign/route.ts` | GET |

## Entry Points

Start here when exploring this area:

- **`createSupabaseServerClient`** (Function) — `lib/supabase/server.ts:5`
- **`isSupabaseConfigured`** (Function) — `lib/supabase/config.ts:0`
- **`ProFeedHomePage`** (Function) — `app/profeed/page.tsx:21`
- **`updateFeedbackStatus`** (Function) — `app/admin/actions.ts:11`
- **`FeedbackStatusForm`** (Function) — `app/admin/status-form.tsx:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createSupabaseServerClient` | Function | `lib/supabase/server.ts` | 5 |
| `isSupabaseConfigured` | Function | `lib/supabase/config.ts` | 0 |
| `ProFeedHomePage` | Function | `app/profeed/page.tsx` | 21 |
| `updateFeedbackStatus` | Function | `app/admin/actions.ts` | 11 |
| `FeedbackStatusForm` | Function | `app/admin/status-form.tsx` | 10 |
| `ProFeedPortalHomePage` | Function | `app/profeed/portal/page.tsx` | 6 |
| `ProFeedLoginPage` | Function | `app/profeed/login/page.tsx` | 10 |
| `GET` | Function | `app/api/storage/sign/route.ts` | 7 |
| `ProFeedPortalLoginPage` | Function | `app/profeed/portal/login/page.tsx` | 10 |
| `broadcastProInsightsRefresh` | Function | `components/ProInsightsAutoRefresh.tsx` | 7 |
| `FeedbackStatusForm` | Function | `app/profeed/statusForm.tsx` | 15 |
| `submit` | Function | `app/profeed/statusForm.tsx` | 27 |
| `FeedbackStatusForm` | Function | `app/profeed/status-form.tsx` | 13 |
| `updateFeedbackStatus` | Function | `app/profeed/actions.ts` | 12 |
| `getProdocEntryHref` | Function | `lib/prodoc-urls.ts` | 11 |
| `ProFeedLayout` | Function | `app/profeed/layout.tsx` | 6 |
| `AdminLayout` | Function | `app/admin/layout.tsx` | 6 |
| `PortalLayout` | Function | `app/portal/layout.tsx` | 6 |
| `formatHelpful` | Function | `app/profeed/page.tsx` | 11 |
| `highlightsCount` | Function | `app/profeed/page.tsx` | 17 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `FeedbackStatusForm → IsSupabaseConfigured` | cross_community | 5 |
| `FeedbackStatusForm → IsStatus` | intra_community | 4 |
| `FeedbackStatusForm → CreateServiceRoleClient` | cross_community | 4 |
| `FeedbackStatusForm → IsSupabaseConfigured` | intra_community | 4 |
| `FeedbackStatusForm → IsSupabaseConfigured` | cross_community | 4 |
| `ProInsightsPage → IsSupabaseConfigured` | cross_community | 3 |
| `ProFeedHomePage → IsSupabaseConfigured` | intra_community | 3 |
| `FeedbackStatusForm → BroadcastProInsightsRefresh` | intra_community | 3 |
| `FeedbackStatusForm → IsStatus` | intra_community | 3 |
| `Home → GetProdocPublicBase` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Docs | 1 calls |
| App | 1 calls |
| [id] | 1 calls |

## How to Explore

1. `gitnexus_context({name: "createSupabaseServerClient"})` — see callers and callees
2. `gitnexus_query({query: "profeed"})` — find related execution flows
3. Read key files listed above for implementation details

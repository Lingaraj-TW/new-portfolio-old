---
name: id
description: "Skill for the [id] area of prodoc. 7 symbols across 5 files."
---

# [id]

7 symbols | 5 files | Cohesion: 70%

## When to Use

- Working with code in `app/`
- Understanding how createServiceRoleClient, highlightsJsonSizeOk, PATCH work
- Modifying [id]-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/api/feedback/[id]/route.ts` | assertEditSecret, PATCH, DELETE |
| `lib/supabase/service.ts` | createServiceRoleClient |
| `lib/feedback/highlights.ts` | highlightsJsonSizeOk |
| `app/api/feedback/route.ts` | validatePayload |
| `app/api/feedback/attachments/[attachmentId]/route.ts` | DELETE |

## Entry Points

Start here when exploring this area:

- **`createServiceRoleClient`** (Function) — `lib/supabase/service.ts:2`
- **`highlightsJsonSizeOk`** (Function) — `lib/feedback/highlights.ts:43`
- **`PATCH`** (Function) — `app/api/feedback/[id]/route.ts:25`
- **`DELETE`** (Function) — `app/api/feedback/[id]/route.ts:101`
- **`DELETE`** (Function) — `app/api/feedback/attachments/[attachmentId]/route.ts:7`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createServiceRoleClient` | Function | `lib/supabase/service.ts` | 2 |
| `highlightsJsonSizeOk` | Function | `lib/feedback/highlights.ts` | 43 |
| `PATCH` | Function | `app/api/feedback/[id]/route.ts` | 25 |
| `DELETE` | Function | `app/api/feedback/[id]/route.ts` | 101 |
| `DELETE` | Function | `app/api/feedback/attachments/[attachmentId]/route.ts` | 7 |
| `validatePayload` | Function | `app/api/feedback/route.ts` | 168 |
| `assertEditSecret` | Function | `app/api/feedback/[id]/route.ts` | 8 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `FeedbackStatusForm → CreateServiceRoleClient` | cross_community | 4 |
| `POST → HighlightsJsonSizeOk` | cross_community | 3 |
| `PATCH → CreateServiceRoleClient` | intra_community | 3 |
| `PATCH → ClampPct` | cross_community | 3 |
| `DELETE → CreateServiceRoleClient` | intra_community | 3 |
| `FeedbackStatusForm → CreateServiceRoleClient` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Profeed | 3 calls |
| Feedback | 1 calls |

## How to Explore

1. `gitnexus_context({name: "createServiceRoleClient"})` — see callers and callees
2. `gitnexus_query({query: "[id]"})` — find related execution flows
3. Read key files listed above for implementation details

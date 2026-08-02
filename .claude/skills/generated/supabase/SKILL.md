---
name: supabase
description: "Skill for the Supabase area of prodoc. 4 symbols across 2 files."
---

# Supabase

4 symbols | 2 files | Cohesion: 86%

## When to Use

- Working with code in `lib/`
- Understanding how middleware, updateSession work
- Modifying supabase-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `lib/supabase/middleware.ts` | isAdminUser, isCustomerUser, updateSession |
| `middleware.ts` | middleware |

## Entry Points

Start here when exploring this area:

- **`middleware`** (Function) — `middleware.ts:4`
- **`updateSession`** (Function) — `lib/supabase/middleware.ts:17`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `middleware` | Function | `middleware.ts` | 4 |
| `updateSession` | Function | `lib/supabase/middleware.ts` | 17 |
| `isAdminUser` | Function | `lib/supabase/middleware.ts` | 5 |
| `isCustomerUser` | Function | `lib/supabase/middleware.ts` | 11 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Middleware → IsSupabaseConfigured` | cross_community | 3 |
| `Middleware → IsAdminUser` | intra_community | 3 |
| `Middleware → IsCustomerUser` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Profeed | 1 calls |

## How to Explore

1. `gitnexus_context({name: "middleware"})` — see callers and callees
2. `gitnexus_query({query: "supabase"})` — find related execution flows
3. Read key files listed above for implementation details

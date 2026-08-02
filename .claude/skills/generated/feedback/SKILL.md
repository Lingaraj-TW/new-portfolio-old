---
name: feedback
description: "Skill for the Feedback area of prodoc. 9 symbols across 2 files."
---

# Feedback

9 symbols | 2 files | Cohesion: 80%

## When to Use

- Working with code in `app/`
- Understanding how parseHighlights, POST, OPTIONS work
- Modifying feedback-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/api/feedback/route.ts` | corsHeaders, allowedMime, sanitizeFilename, parseRequest, uploadAttachments (+2) |
| `lib/feedback/highlights.ts` | parseHighlights, clampPct |

## Entry Points

Start here when exploring this area:

- **`parseHighlights`** (Function) — `lib/feedback/highlights.ts:6`
- **`POST`** (Function) — `app/api/feedback/route.ts:228`
- **`OPTIONS`** (Function) — `app/api/feedback/route.ts:326`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseHighlights` | Function | `lib/feedback/highlights.ts` | 6 |
| `POST` | Function | `app/api/feedback/route.ts` | 228 |
| `OPTIONS` | Function | `app/api/feedback/route.ts` | 326 |
| `clampPct` | Function | `lib/feedback/highlights.ts` | 38 |
| `corsHeaders` | Function | `app/api/feedback/route.ts` | 17 |
| `allowedMime` | Function | `app/api/feedback/route.ts` | 30 |
| `sanitizeFilename` | Function | `app/api/feedback/route.ts` | 34 |
| `parseRequest` | Function | `app/api/feedback/route.ts` | 51 |
| `uploadAttachments` | Function | `app/api/feedback/route.ts` | 195 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `POST → ClampPct` | intra_community | 4 |
| `POST → HighlightsJsonSizeOk` | cross_community | 3 |
| `PATCH → ClampPct` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| [id] | 2 calls |
| Profeed | 1 calls |

## How to Explore

1. `gitnexus_context({name: "parseHighlights"})` — see callers and callees
2. `gitnexus_query({query: "feedback"})` — find related execution flows
3. Read key files listed above for implementation details

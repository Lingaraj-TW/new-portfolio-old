---
name: docs
description: "Skill for the Docs area of prodoc. 21 symbols across 6 files."
---

# Docs

21 symbols | 6 files | Cohesion: 71%

## When to Use

- Working with code in `lib/`
- Understanding how getProdocPublicBase, docPageHref, docsBootstrapPath work
- Modifying docs-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `lib/docs/paths.ts` | defaultDocSlug, isSafeDocSlug, getDocFilePath, readDocSource, getDocMeta (+8) |
| `lib/prodoc-urls.ts` | getProdocPublicBase, docPageHref, docsBootstrapPath |
| `app/docs/[[...slug]]/page.tsx` | DocPage, generateStaticParams |
| `lib/mdx/compile-doc.tsx` | compileDocMdx |
| `app/docs/layout.tsx` | DocsLayout |
| `app/api/docs/meta/[...slug]/route.ts` | GET |

## Entry Points

Start here when exploring this area:

- **`getProdocPublicBase`** (Function) — `lib/prodoc-urls.ts:5`
- **`docPageHref`** (Function) — `lib/prodoc-urls.ts:17`
- **`docsBootstrapPath`** (Function) — `lib/prodoc-urls.ts:24`
- **`defaultDocSlug`** (Function) — `lib/docs/paths.ts:113`
- **`compileDocMdx`** (Function) — `lib/mdx/compile-doc.tsx:50`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getProdocPublicBase` | Function | `lib/prodoc-urls.ts` | 5 |
| `docPageHref` | Function | `lib/prodoc-urls.ts` | 17 |
| `docsBootstrapPath` | Function | `lib/prodoc-urls.ts` | 24 |
| `defaultDocSlug` | Function | `lib/docs/paths.ts` | 113 |
| `compileDocMdx` | Function | `lib/mdx/compile-doc.tsx` | 50 |
| `DocsLayout` | Function | `app/docs/layout.tsx` | 7 |
| `DocPage` | Function | `app/docs/[[...slug]]/page.tsx` | 19 |
| `isSafeDocSlug` | Function | `lib/docs/paths.ts` | 10 |
| `getDocFilePath` | Function | `lib/docs/paths.ts` | 47 |
| `readDocSource` | Function | `lib/docs/paths.ts` | 53 |
| `getDocMeta` | Function | `lib/docs/paths.ts` | 67 |
| `getDocTitle` | Function | `lib/docs/paths.ts` | 92 |
| `GET` | Function | `app/api/docs/meta/[...slug]/route.ts` | 6 |
| `listDocSlugs` | Function | `lib/docs/paths.ts` | 35 |
| `generateStaticParams` | Function | `app/docs/[[...slug]]/page.tsx` | 15 |
| `listNavDocs` | Function | `lib/docs/paths.ts` | 96 |
| `listNavGroups` | Function | `lib/docs/paths.ts` | 133 |
| `rank` | Function | `lib/docs/paths.ts` | 170 |
| `toPosixPath` | Function | `lib/docs/paths.ts` | 15 |
| `walkMdxFiles` | Function | `lib/docs/paths.ts` | 19 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DocsLayout → IsSafeDocSlug` | cross_community | 7 |
| `DocsLayout → WalkMdxFiles` | cross_community | 5 |
| `DocsLayout → ToPosixPath` | cross_community | 5 |
| `GET → IsSafeDocSlug` | intra_community | 5 |
| `GetDocTitle → IsSafeDocSlug` | intra_community | 5 |
| `DocPage → WalkMdxFiles` | cross_community | 4 |
| `DocPage → ToPosixPath` | cross_community | 4 |
| `DocPage → IsSafeDocSlug` | cross_community | 4 |
| `DocPage → GetProdocPublicBase` | intra_community | 3 |
| `Home → GetProdocPublicBase` | cross_community | 3 |

## How to Explore

1. `gitnexus_context({name: "getProdocPublicBase"})` — see callers and callees
2. `gitnexus_query({query: "docs"})` — find related execution flows
3. Read key files listed above for implementation details

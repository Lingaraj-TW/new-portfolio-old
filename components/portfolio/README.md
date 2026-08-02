# `components/portfolio` (legacy)

Most files here **re-export** from the canonical locations:

- **Layout / nav / footer** → `components/layout/`
- **Product heroes & demo blocks** → `components/products/`

Prefer importing from `layout` or `products` in new code. This folder remains for older import paths and a few portfolio-only pieces (`EcosystemDiagram`, `ProfilePhoto`, etc.) that are not yet moved.

# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this repo is

`@vdaluz/astro-og-cards`: shared OG/social-card meta-tag component and a build-time card generation harness (satori + sharp) for vdaluz.com-family Astro sites. Component library, not a standalone site - raw `.astro`/`.ts` from `src/`, no build step. Tracked in Plane under VDA-902 (build) and per-site adoption issues (e.g. IPS-297 for imperfectsystems.com).

## Commands

```bash
npm install
npm test   # node --test - runs the generateCard smoke test against a real shadow-bearing card fixture
```

## Workflow

Single-maintainer, worked sequentially - no worktrees, work directly on `main` per the standing rule for the sibling `@vdaluz/*` packages (astro-blog, astro-affiliate, astro-opt-in-analytics all follow this). Consumers only ever see tagged releases, so `main` is safe to iterate on.

## Conventions

- **Raw source, no build step.** Ships `.ts`/`.astro` from `src/`; consuming apps' Astro/Vite compiles them. Never add a build/dist step or `main` field.
- **Explicit `.ts` extensions on relative imports** (matches astro-affiliate) - required for `node --test` to resolve them directly without a bundler.
- **Per-path exports.** New public files need an `exports` entry in `package.json`.

## Toolchain gotchas (found during VDA-902's spike, see also README)

- **sharp, not `@resvg/resvg-js`**, for SVG->PNG rasterization. resvg-js native-panics on Satori's shadow-filter (`feDropShadow`/`feGaussianBlur`) SVG output.
- **Pin `sharp` to `^0.35.0` or later**, not `^0.34.x` - `sharp@0.34.5`'s install check fails against Node 25 and falls back to a from-source build that then fails (missing `node-addon-api`). `0.35.3` installs its prebuilt binary correctly on the same machine/Node version.
- **Bundled font must be static, not variable** - Satori's font parser can't read variable-font files (e.g. macOS's system SF Mono).
- **Never read a bundled binary asset from a sibling file via `import.meta.url` at runtime** - confirmed via a real `astro build` that Vite/Rollup bundles this package's source into a relocated chunk file, breaking any path computed relative to the module's own location. Fonts are embedded as base64 in `src/lib/spaceMonoData.ts` instead. This applies to any future bundled asset this package might add, not just fonts.

## Release process

Same tag-pinned-tarball process shared by all `@vdaluz/*` component libraries - see root
`~/Repos/CLAUDE.md` -> "Astro shared-library release process".

## Consumers

None yet (v1 not released). Planned: imperfectsystems.com (IPS-297), then other sister sites as they adopt static/dynamic OG cards per VDA-902's standardization rule.

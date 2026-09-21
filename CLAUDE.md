# CLAUDE.md

## What this repo is

`@vdaluz/astro-og-cards`: shared OG/social-card meta-tag component and a build-time card generation harness (satori + sharp) for vdaluz.com-family Astro sites. Component library, not a standalone site - raw `.astro`/`.ts` from `src/`, no build step.

## Commands

```bash
npm install
npm test   # node --test on test/*.test.ts (lib tests, incl. the generateCard shadow-card smoke test), then vitest on test/*.vitest.ts (OgMeta.astro via Astro's Container API)
```

## Workflow

Shared preamble: `.claude/rules/git-workflow-direct-to-main.md`.

## Plane (AST project)

Project ID, state UUIDs, and label UUIDs: **`.claude/plane.yml`**.

## Conventions

Shared `@vdaluz/astro-*` conventions (raw source/no build step, per-path exports, `.ts` extensions on relative imports):
`.claude/rules/astro-package-conventions.md`.

## Toolchain gotchas (see also README)

- **sharp, not `@resvg/resvg-js`**, for SVG->PNG rasterization. resvg-js native-panics on Satori's shadow-filter (`feDropShadow`/`feGaussianBlur`) SVG output.
- **Pin `sharp` to `^0.35.0` or later**, not `^0.34.x` - the 0.34 line's install check fails against Node 25 and falls back to a from-source build that then fails (missing `node-addon-api`); 0.35+ installs its prebuilt binary correctly on the same machine/Node version.
- **Bundled font must be static, not variable** - Satori's font parser can't read variable-font files (e.g. macOS's system SF Mono).
- **Never read a bundled binary asset from a sibling file via `import.meta.url` at runtime** - confirmed via a real `astro build` that Vite/Rollup bundles this package's source into a relocated chunk file, breaking any path computed relative to the module's own location. Fonts are embedded as base64 in `src/lib/spaceMonoData.ts` instead. This applies to any future bundled asset this package might add, not just fonts.
- **`satori-html` unconditionally trims every text node's value** (confirmed by reading its source: `node.value.trim()`), so a literal space in a text node right before an inline-styled `<span>` is silently dropped - and a non-breaking space doesn't survive either, since JS `trim()` treats it as whitespace too. Confirmed twice in production markup built on this pattern ("./run--software" instead of "./run --software", missing the source space). Fix by giving the following span an explicit `margin-left` (or the preceding element a `margin-right`) instead of relying on a whitespace character.

## Release process

Same tag-then-npm-publish process shared by all `@vdaluz/*` component libraries, consumed via
npm-registry semver pins (not tarball URLs). See the README's "Releasing" section for the
concrete steps.

## Consumers

The README's "Consumers" section is the single list of sites pinning this package (npm-registry semver). Update it there, not here, when a site adopts or drops the package.

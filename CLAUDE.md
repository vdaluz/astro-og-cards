# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this repo is

`@vdaluz/astro-og-cards`: shared OG/social-card meta-tag component and a build-time card generation harness (satori + sharp) for vdaluz.com-family Astro sites. Component library, not a standalone site - raw `.astro`/`.ts` from `src/`, no build step.

## Commands

```bash
npm install
npm test   # node --test - runs the generateCard smoke test against a real shadow-bearing card fixture
```

## Workflow

Shared preamble: `.claude/rules/git-workflow-direct-to-main.md`.

## Conventions

Shared `@vdaluz/astro-*` conventions (raw source/no build step, per-path exports):
`.claude/rules/astro-package-conventions.md`.

- **Explicit `.ts` extensions on relative imports** (matches astro-affiliate) - required for `node --test` to resolve them directly without a bundler.

## Toolchain gotchas (see also README)

- **sharp, not `@resvg/resvg-js`**, for SVG->PNG rasterization. resvg-js native-panics on Satori's shadow-filter (`feDropShadow`/`feGaussianBlur`) SVG output.
- **Pin `sharp` to `^0.35.0` or later**, not `^0.34.x` - `sharp@0.34.5`'s install check fails against Node 25 and falls back to a from-source build that then fails (missing `node-addon-api`). `0.35.3` installs its prebuilt binary correctly on the same machine/Node version.
- **Bundled font must be static, not variable** - Satori's font parser can't read variable-font files (e.g. macOS's system SF Mono).
- **Never read a bundled binary asset from a sibling file via `import.meta.url` at runtime** - confirmed via a real `astro build` that Vite/Rollup bundles this package's source into a relocated chunk file, breaking any path computed relative to the module's own location. Fonts are embedded as base64 in `src/lib/spaceMonoData.ts` instead. This applies to any future bundled asset this package might add, not just fonts.
- **`satori-html` unconditionally trims every text node's value** (confirmed by reading its source: `node.value.trim()`), so a literal space in a text node right before an inline-styled `<span>` is silently dropped - and a non-breaking space doesn't survive either, since JS `trim()` treats it as whitespace too. Confirmed twice in production markup built on this pattern ("./run--software" instead of "./run --software", missing the source space). Fix by giving the following span an explicit `margin-left` (or the preceding element a `margin-right`) instead of relying on a whitespace character.

## Release process

Same tag-then-npm-publish process shared by all `@vdaluz/*` component libraries, consumed via
npm-registry semver pins (not tarball URLs). See the README's "Releasing" section for the
concrete steps.

## Consumers

All five family sites now pin this package (npm-registry semver, most on 1.1.1 as of META-90):

- [imperfectsystems.com](https://imperfectsystems.com) - generates the default card, Deep Cut Atlas card (en/es/pt), per-post blog cards, and Open Source section cards (index + one per package) via `scripts/generate-og-images.mjs` as a `prebuild` hook.
- vdaluz.com, freetoolbox.net, wq1k.com - similar `prebuild`-hook card generation per site's own script.
- vicstradamus.com - devDependency only (build-time card generation, not runtime).

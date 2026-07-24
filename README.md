# @vdaluz/astro-og-cards

[![CI](https://github.com/vdaluz/astro-og-cards/actions/workflows/ci.yml/badge.svg)](https://github.com/vdaluz/astro-og-cards/actions/workflows/ci.yml)

Shared OG/social-card machinery for [vdaluz.com](https://vdaluz.com)-family Astro sites: a meta-tag emission component and a build-time card generation harness (satori + sharp). Ships raw `.astro`/`.ts` - the consuming app's Astro/Vite compiles them (no prebuild step), same as `@vdaluz/astro-blog`.

## Install

Pinned https tarball from a tag (no registry needed):

```jsonc
// package.json
"dependencies": {
  "@vdaluz/astro-og-cards": "https://github.com/vdaluz/astro-og-cards/archive/refs/tags/v1.0.0.tar.gz"
}
```

Peer dependency: `astro` >= 6.

## Meta tags

```astro
---
import OgMeta from '@vdaluz/astro-og-cards/OgMeta.astro';
---

<OgMeta
  title="Page title"
  description="Page description"
  image="https://example.com/og/page.png"
  url="https://example.com/page"
  siteName="Example Site"
/>
```

Emits the full `og:*`/`twitter:*` tag set (title, description, image at 1200x630, url, type, site name, twitter card).

## Card generation

```ts
import { generateCard } from '@vdaluz/astro-og-cards';

const png = await generateCard(inlineStyledHtml); // Buffer, 1200x630 PNG
```

`markup` must use **inline styles, not `<style>` blocks or CSS classes** - `satori-html` (the HTML-to-Satori adapter) only reads inline styles. A hand-designed card with `<style>` + classes needs manual translation to inline styles first; see `src/assets/fixtures/imperfectSystemsCard.ts` for a worked example (imperfectsystems.com's real default card, translated).

Bundles a default static (non-variable) font, [Space Mono](https://github.com/googlefonts/spacemono) (OFL-licensed). Pass `fonts` in the options to override.

### Known gotchas (found during VDA-902's toolchain spike)

- **Use `sharp` for SVG->PNG, not `@resvg/resvg-js`.** resvg-js 2.6.2 (latest stable as of writing) native-panics (uncatchable Rust abort, not a JS exception) on Satori's `feDropShadow`/`feGaussianBlur` filter output - i.e. any `box-shadow` or `text-shadow` in the source markup. Confirmed via binary search against a real shadow-bearing design; independent of shadow color format (hex vs `rgba()`).
- **Variable fonts fail to parse.** Satori's bundled font parser (`@shuding/opentype.js`) can't read variable-font files (e.g. macOS's system SF Mono, which has an `fvar` table). Always pass a static font weight, never a system font reference.
- **The bundled default font is embedded as base64 in `src/lib/spaceMonoData.ts`, not read from a sibling `.ttf` file at runtime.** Confirmed via a real `astro build`: Vite/Rollup bundles this package's source into a new chunk file at a different physical location in the consumer's build output, so any `import.meta.url`-relative disk read breaks there (regardless of whether it's written as `new URL(...)` or a plain `path.join` - both are equally broken, since the problem is the module's *code* being relocated, not a specific path-construction pattern Vite's static analyzer happens to intercept). The raw `.ttf` files still live in `src/assets/fonts/` for provenance/license visibility and to regenerate the base64 if the font is ever updated; they aren't imported by any code path.
- `satori-html` is stale (last published Dec 2022) but works correctly against the current Satori API as of this writing - the smoke test (`npm test`) is the tripwire for a future break.

## License

MIT

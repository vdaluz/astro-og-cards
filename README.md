# @vdaluz/astro-og-cards

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
- `satori-html` is stale (last published Dec 2022) but works correctly against the current Satori API as of this writing - the smoke test (`npm test`) is the tripwire for a future break.

## License

MIT

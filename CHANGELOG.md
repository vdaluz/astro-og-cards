# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.1.1] - 2026-07-25

### Fixed

- `imperfectSystemsCard` fixture rendered `./run--software` instead of `./run --software`: `satori-html` unconditionally trims every text node's value, so a literal space in a text node right before an inline-styled `<span>` was silently dropped. Fixed by giving the element an explicit `margin-right` instead of relying on a whitespace character, matching the pattern already used elsewhere on the same line. Regenerated `docs/og-card-example.png`.
- Removed an internal ticket-tracker reference that had leaked into the published README and three source-file doc comments.
- `publish.yml`: removed `setup-node`'s `registry-url` input, which wrote an empty `_authToken` line to `.npmrc` that caused npm to skip the OIDC trusted-publishing exchange entirely.

## [1.1.0] - 2026-07-25

### Added

- `OgMeta` gained `imageWidth`/`imageHeight` props (default 1200/630, matching `generateCard`), `twitter:image:alt` (previously only `og:image:alt`), and `publishedTime`/`modifiedTime` props emitting `article:published_time`/`article:modified_time` when `type="article"`.
- Broader `generateCard` test coverage: custom width/height is verified via real PNG dimensions (sharp metadata, not just "did it render"), and the `fonts` option is verified to actually override the bundled default rather than being silently ignored.
- README note documenting the sharp/satori dependency cost as an intentional tradeoff, not an oversight.

## [1.0.3] - 2026-07-25

### Fixed

- `defaultFonts()` no longer re-decodes the bundled Space Mono base64 data on every call - the decoded buffers are now memoized at module scope, so generating many cards in one build only pays the decode cost once.

## [1.0.2] - 2026-07-25

### Added

- `repository`, `homepage`, `bugs`, and `keywords` fields to `package.json` for GitHub/npm discoverability, plus `sideEffects: false` (the package is a pure re-export entry point).
- This CHANGELOG, backfilled from tag history.

## [1.0.1] - 2026-07-25

### Changed

- Reframed the README around the general problem solved (build-time OG card generation) instead of internal framing, added the tarball-install rationale callout present in the sibling packages, added a Contributing section and a real example card generated from the existing test fixture.

### Added

- CI (typecheck + tests) via GitHub Actions.

## [1.0.0] - 2026-07-18

### Added

- Initial release: `OgMeta` meta-tag component and a build-time card generation harness (satori + sharp), with a bundled default font embedded as base64 to survive bundler relocation.

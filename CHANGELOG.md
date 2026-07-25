# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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

import type { SatoriOptions } from 'satori';
import { spaceMonoRegularBase64, spaceMonoBoldBase64 } from './spaceMonoData.ts';

type SatoriFont = SatoriOptions['fonts'][number];

let cachedFonts: SatoriFont[] | null = null;

/**
 * Bundled default font (Space Mono, OFL-licensed, static weights).
 * Satori's font parser can't read variable fonts (e.g. macOS's system SF Mono) -
 * bundling a static weight avoids that failure mode for consumers who don't supply
 * their own fonts.
 *
 * Decoding the base64 data is memoized at module scope - a site generating one
 * card per post would otherwise redo the ~200KB base64 decode on every call.
 */
export async function defaultFonts(): Promise<SatoriFont[]> {
  if (!cachedFonts) {
    cachedFonts = [
      { name: 'Space Mono', data: Buffer.from(spaceMonoRegularBase64, 'base64'), weight: 400, style: 'normal' },
      { name: 'Space Mono', data: Buffer.from(spaceMonoBoldBase64, 'base64'), weight: 700, style: 'normal' },
    ];
  }
  return cachedFonts;
}

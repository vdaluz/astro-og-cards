import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { SatoriOptions } from 'satori';

type SatoriFont = SatoriOptions['fonts'][number];

/**
 * Bundled default font (Space Mono, OFL-licensed, static weights).
 * Satori's font parser can't read variable fonts (e.g. macOS's system SF Mono) -
 * bundling a static weight avoids that failure mode for consumers who don't supply
 * their own fonts.
 */
export async function defaultFonts(): Promise<SatoriFont[]> {
  const [regular, bold] = await Promise.all([
    readFile(fileURLToPath(new URL('../assets/fonts/SpaceMono-Regular.ttf', import.meta.url))),
    readFile(fileURLToPath(new URL('../assets/fonts/SpaceMono-Bold.ttf', import.meta.url))),
  ]);
  return [
    { name: 'Space Mono', data: regular, weight: 400, style: 'normal' },
    { name: 'Space Mono', data: bold, weight: 700, style: 'normal' },
  ];
}

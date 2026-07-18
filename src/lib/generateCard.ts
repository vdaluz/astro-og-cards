import satori, { type SatoriOptions } from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { defaultFonts } from './fonts.ts';

type SatoriFont = SatoriOptions['fonts'][number];

export interface GenerateCardOptions {
  width?: number;
  height?: number;
  fonts?: SatoriFont[];
}

/**
 * Renders an inline-styled HTML string (satori-html requires inline styles, not
 * <style> blocks/classes) to a PNG buffer via satori -> sharp.
 *
 * sharp, not @resvg/resvg-js, does the SVG->PNG step: resvg-js 2.6.2 native-panics
 * on satori's feDropShadow/feGaussianBlur filter output (any box-shadow/text-shadow),
 * confirmed against a real shadow-bearing card design during VDA-902's toolchain spike.
 */
export async function generateCard(
  markup: string,
  options: GenerateCardOptions = {}
): Promise<Buffer> {
  const { width = 1200, height = 630, fonts } = options;
  const vtree = html(markup);
  const resolvedFonts = fonts ?? (await defaultFonts());
  const svg = await satori(vtree, { width, height, fonts: resolvedFonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

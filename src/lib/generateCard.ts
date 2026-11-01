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

interface VNode {
  type: string;
  props: { style?: Record<string, unknown>; children?: unknown };
}

// satori 0.42 switched to the CSS initial values (box-sizing: content-box,
// position: static). Card templates were written against the old defaults, so
// restore them wherever a template doesn't set its own. SVG internals are left
// alone, since satori serializes their props as SVG attributes.
function applyLegacyLayoutDefaults(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(applyLegacyLayoutDefaults);
    return;
  }
  if (typeof node !== 'object' || node === null || !('props' in node)) return;
  const { type, props } = node as VNode;
  props.style = { boxSizing: 'border-box', position: 'relative', ...props.style };
  if (type !== 'svg') applyLegacyLayoutDefaults(props.children);
}

/**
 * Renders an inline-styled HTML string (satori-html requires inline styles, not
 * <style> blocks/classes) to a PNG buffer via satori -> sharp.
 *
 * sharp, not @resvg/resvg-js, does the SVG->PNG step: resvg-js 2.6.2 native-panics
 * on satori's feDropShadow/feGaussianBlur filter output (any box-shadow/text-shadow),
 * confirmed against a real shadow-bearing card design (see README's Known gotchas).
 */
export async function generateCard(
  markup: string,
  options: GenerateCardOptions = {}
): Promise<Buffer> {
  const { width = 1200, height = 630, fonts } = options;
  const vtree = html(markup);
  applyLegacyLayoutDefaults(vtree);
  const resolvedFonts = fonts ?? (await defaultFonts());
  const svg = await satori(vtree, { width, height, fonts: resolvedFonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

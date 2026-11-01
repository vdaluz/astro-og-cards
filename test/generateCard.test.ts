import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { generateCard } from '../src/lib/generateCard.ts';
import { defaultFonts } from '../src/lib/fonts.ts';
import { imperfectSystemsCard } from '../fixtures/imperfectSystemsCard.ts';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test('generateCard renders a shadow-bearing card (box-shadow + text-shadow) to a valid PNG at its default dimensions', async () => {
  const png = await generateCard(imperfectSystemsCard);
  assert.ok(Buffer.isBuffer(png));
  assert.ok(png.subarray(0, 8).equals(PNG_MAGIC), 'output should start with the PNG signature');
  assert.ok(png.length > 1000, 'output should be a non-trivial image, not an empty/blank render');

  const { width, height } = await sharp(png).metadata();
  assert.equal(width, 1200);
  assert.equal(height, 630);
});

test('generateCard respects a custom width/height', async () => {
  const markup = `<div style="width:600px;height:400px;display:flex;background:#fff;"></div>`;
  const png = await generateCard(markup, { width: 600, height: 400 });

  const { width, height } = await sharp(png).metadata();
  assert.equal(width, 600);
  assert.equal(height, 400);
});

test('generateCard uses the fonts option instead of the bundled default when provided', async () => {
  // A real font is required for satori-html text content to render at all - reusing
  // defaultFonts() here (rather than an empty array) proves the option actually reaches
  // satori instead of being silently ignored: if it were ignored, this would still pass
  // by accident, but the empty-array variant below (which must throw) rules that out.
  const png = await generateCard(imperfectSystemsCard, { fonts: await defaultFonts() });
  assert.ok(png.subarray(0, 8).equals(PNG_MAGIC));
});

test('generateCard throws when fonts is explicitly emptied out, proving the option overrides the default rather than falling back to it', async () => {
  await assert.rejects(() => generateCard(imperfectSystemsCard, { fonts: [] }));
});

async function pixelAt(png: Buffer, x: number, y: number): Promise<[number, number, number]> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const i = (y * info.width + x) * info.channels;
  return [data[i], data[i + 1], data[i + 2]];
}

test('generateCard keeps a padded fixed-width box inside its width (border-box default)', async () => {
  const markup = `<div style="display:flex;width:1200px;height:630px;padding:76px;background:#ffffff;"><div style="display:flex;width:100%;height:100%;background:#ff0000;"></div></div>`;
  const png = await generateCard(markup);
  assert.deepEqual(await pixelAt(png, 1190, 315), [255, 255, 255]);
  assert.deepEqual(await pixelAt(png, 600, 315), [255, 0, 0]);
});

test('generateCard lets a template opt back into content-box', async () => {
  const markup = `<div style="display:flex;width:1200px;height:630px;padding:76px;background:#ffffff;box-sizing:content-box;"><div style="display:flex;width:100%;height:100%;background:#ff0000;"></div></div>`;
  const png = await generateCard(markup);
  assert.deepEqual(await pixelAt(png, 1190, 315), [255, 0, 0]);
});

test('generateCard paints a later static sibling over an earlier absolute overlay (relative default)', async () => {
  const markup = `<div style="display:flex;width:1200px;height:630px;background:#ffffff;"><div style="position:absolute;top:0;left:0;width:1200px;height:630px;background:#ff0000;"></div><div style="display:flex;width:1200px;height:630px;background:#00ff00;"></div></div>`;
  const png = await generateCard(markup);
  assert.deepEqual(await pixelAt(png, 600, 315), [0, 255, 0]);
});

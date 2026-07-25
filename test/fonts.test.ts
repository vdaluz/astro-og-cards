import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultFonts } from '../src/lib/fonts.ts';

test('defaultFonts returns Space Mono regular and bold entries', async () => {
  const fonts = await defaultFonts();
  assert.equal(fonts.length, 2);
  assert.equal(fonts[0].name, 'Space Mono');
  assert.equal(fonts[0].weight, 400);
  assert.equal(fonts[0].style, 'normal');
  assert.equal(fonts[1].name, 'Space Mono');
  assert.equal(fonts[1].weight, 700);
  assert.ok(Buffer.isBuffer(fonts[0].data));
  assert.ok((fonts[0].data as Buffer).length > 1000, 'font data should be a real decoded font, not empty');
});

test('defaultFonts memoizes - repeat calls return the identical buffer instances', async () => {
  const first = await defaultFonts();
  const second = await defaultFonts();
  assert.equal(first, second, 'should return the same cached array, not a fresh one');
  assert.equal(first[0].data, second[0].data, 'should return the same buffer instance, not a re-decoded copy');
  assert.equal(first[1].data, second[1].data);
});

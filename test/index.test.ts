import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateCard, defaultFonts } from '../src/index.ts';

test('the package barrel loads under Node and exports generateCard and defaultFonts', () => {
  assert.equal(typeof generateCard, 'function');
  assert.equal(typeof defaultFonts, 'function');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateCard } from '../src/lib/generateCard.ts';
import { imperfectSystemsCard } from '../src/assets/fixtures/imperfectSystemsCard.ts';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test('generateCard renders a shadow-bearing card (box-shadow + text-shadow) to a valid PNG', async () => {
  const png = await generateCard(imperfectSystemsCard);
  assert.ok(Buffer.isBuffer(png));
  assert.ok(png.subarray(0, 8).equals(PNG_MAGIC), 'output should start with the PNG signature');
  assert.ok(png.length > 1000, 'output should be a non-trivial image, not an empty/blank render');
});

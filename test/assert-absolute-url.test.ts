import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertAbsoluteUrl } from '../src/lib/assert-absolute-url.ts';

test('assertAbsoluteUrl accepts an https URL', () => {
  assert.doesNotThrow(() => assertAbsoluteUrl('https://example.com/og/page.png', 'image'));
});

test('assertAbsoluteUrl accepts an http URL', () => {
  assert.doesNotThrow(() => assertAbsoluteUrl('http://example.com/page', 'url'));
});

test('assertAbsoluteUrl rejects a root-relative path', () => {
  assert.throws(
    () => assertAbsoluteUrl('/og/post.png', 'image'),
    /OgMeta's `image` prop must be an absolute http\(s\) URL, got "\/og\/post\.png"/,
  );
});

test('assertAbsoluteUrl rejects a bare relative path', () => {
  assert.throws(() => assertAbsoluteUrl('og/post.png', 'image'));
});

test('assertAbsoluteUrl rejects a protocol-relative URL', () => {
  assert.throws(
    () => assertAbsoluteUrl('//cdn.example.com/og/post.png', 'image'),
    /must be an absolute http\(s\) URL/,
  );
});

test('assertAbsoluteUrl rejects an empty string', () => {
  assert.throws(() => assertAbsoluteUrl('', 'url'));
});

test('assertAbsoluteUrl rejects a non-http(s) scheme even though it parses as a valid URL', () => {
  assert.throws(() => assertAbsoluteUrl('mailto:a@b.com', 'url'));
  assert.throws(() => assertAbsoluteUrl('ftp://host/x', 'url'));
});

test('assertAbsoluteUrl error message names the prop and the offending value', () => {
  assert.throws(
    () => assertAbsoluteUrl('/relative', 'url'),
    (err: Error) => err.message.includes('`url`') && err.message.includes('/relative'),
  );
});
